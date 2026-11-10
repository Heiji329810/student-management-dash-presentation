async (page) => {
 const base=page.url().split(/[?#]/)[0];
 const context=await page.context().browser().newContext({offline:true,viewport:{width:1280,height:720}});
 const fresh=await context.newPage();const network=[];const errors=[];
 fresh.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});fresh.on('pageerror',e=>errors.push(e.message));
 await fresh.goto(base+'#slide-21');await fresh.waitForTimeout(500);
 const result=await fresh.evaluate(()=>({slides:document.querySelectorAll('.slide').length,captures:document.querySelectorAll('.swiper-slide').length,swiper:document.querySelector('.swiper').swiper.initialized,images:[...document.images].every(im=>im.complete&&im.naturalWidth),title:document.title}));
 if(result.slides!==21||result.captures!==42||!result.swiper||!result.images)throw Error(JSON.stringify(result));
 await fresh.keyboard.press('ArrowRight');await fresh.waitForTimeout(500);
 if(await fresh.locator('.swiper').evaluate(el=>el.swiper.activeIndex)!==1)throw Error('Offline keyboard');
 await fresh.goto(base.replace('index.html','gallery.html'));
 await fresh.locator('img').evaluateAll(imgs=>imgs.forEach(im=>im.loading='eager'));
 await fresh.waitForFunction(()=>[...document.images].every(im=>im.complete&&im.naturalWidth));
 if(!await fresh.locator('img').evaluateAll(imgs=>imgs.length===42&&imgs.every(im=>im.complete&&im.naturalWidth)))throw Error('Offline standalone gallery');
 if(network.length||errors.length)throw Error(JSON.stringify({network,errors}));
 await context.close();return {checkout:'fresh staged checkout, no environment or browser cache copied',offline:true,protocol:'file:',...result,external_requests:network,errors,keyboard:'passed',standalone_gallery:'all 42 images loaded'};
}
