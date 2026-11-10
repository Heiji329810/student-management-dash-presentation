async (page) => {
  const base = page.url().split(/[?#]/)[0];
  const checks = [];
  const assert = (ok, label) => { if (!ok) throw Error(label); checks.push(label); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '#slide-21');
  await page.setViewportSize({width:1920,height:1080});
  await page.waitForTimeout(600);
  assert(await page.locator('.slide').count() === 21, '21 HTML deck slides');
  assert(await page.locator('.swiper-slide').count() === 42, '42 Swiper captures');
  assert(await page.locator('[data-workflow]').count() === 7, 'Seven workflow navigation buttons');
  assert(await page.evaluate(() => !!document.querySelector('.swiper').swiper), 'Actual Swiper instance');
  const numbers = await page.locator('.swiper-slide img').evaluateAll(imgs => imgs.map(im => Number(im.src.split('/').pop().split('-')[0])).sort((a,b)=>a-b));
  assert(numbers.join(',') === Array.from({length:42},(_,i)=>i+1).join(','), 'Each original capture appears exactly once');
  assert(await page.locator('img').evaluateAll(imgs => imgs.every(im => im.complete && im.naturalWidth)), 'Every local image loads');
  const layout = async () => page.evaluate(() => {
    const s=document.querySelector('.slide.active'); const box=s.getBoundingClientRect();
    const frame=document.querySelector('.swiper-slide-active');
    const nodes=[document.querySelector('.atlas-layout'),document.querySelector('.atlas-toolbar'),frame,...frame.querySelectorAll('h2,p,a,img')];
    return {bg:getComputedStyle(s).backgroundColor,viewport:box.width===innerWidth && Math.abs(box.height-innerHeight)<2,overflow:document.documentElement.scrollWidth>innerWidth,nodes:nodes.every(n=>{const r=n.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;})};
  });
  for (const size of [{width:1920,height:1080},{width:2400,height:1350},{width:1280,height:720},{width:390,height:844},{width:360,height:640}]) {
    await page.setViewportSize(size); await page.waitForTimeout(450);
    for (let n=0;n<42;n++) {
      await page.locator('.swiper').evaluate((el,n)=>el.swiper.slideTo(n,0),n);
      const r=await layout();assert(r.bg==='rgb(24, 42, 44)'&&r.viewport&&!r.overflow&&r.nodes, `Capture ${n+1} fits ${size.width}×${size.height}`);
    }
  }
  await page.setViewportSize({width:1920,height:1080});
  await page.locator('[data-workflow="0"]').click();await page.waitForTimeout(500);
  await page.locator('.swiper').focus();
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(450);
  assert(await page.locator('.swiper').evaluate(el=>el.swiper.activeIndex)===1 && await page.locator('#jump').inputValue()==='20', 'Arrow key advances gallery without moving deck');
  await page.keyboard.press('End');await page.waitForTimeout(450);
  assert(await page.locator('.swiper').evaluate(el=>el.swiper.activeIndex)===41, 'End stays inside gallery');
  await page.keyboard.press('Home');await page.waitForTimeout(450);
  assert(await page.locator('.swiper').evaluate(el=>el.swiper.activeIndex)===0, 'Home stays inside gallery');
  await page.locator('[data-workflow="3"]').click();await page.waitForTimeout(450);
  assert(await page.locator('.swiper-slide-active').getAttribute('data-group')==='3', 'Workflow navigation selects chapter');
  await page.locator('#gallery-next').click();await page.waitForTimeout(450);
  assert(await page.locator('#gallery-count').textContent().then(t=>t.includes('2 / 8')), 'Count tracks chapter and capture');
  assert(await page.locator('.swiper-slide:not(.swiper-slide-active)').evaluateAll(els=>els.every(el=>el.inert)), 'Inactive captures cannot receive focus');
  await page.keyboard.press('f');await page.waitForTimeout(350);
  assert(await page.evaluate(()=>!!document.fullscreenElement), 'Actual browser fullscreen entered');
  for(let n=0;n<42;n++){await page.locator('.swiper').evaluate((el,n)=>el.swiper.slideTo(n,0),n);const full=await layout();assert(full.viewport&&!full.overflow&&full.nodes, `Capture ${n+1} fits actual fullscreen`);}
  await page.keyboard.press('f');await page.waitForTimeout(250);
  const browser=page.context().browser();
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await context.newPage();await phone.goto(base+'#slide-21');await phone.waitForTimeout(400);
  const cdp=await context.newCDPSession(phone);
  const bounds=await phone.locator('.atlas-image').first().boundingBox();
  const y=bounds.y+bounds.height/2;const x=bounds.x+bounds.width*.85;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for (let i=1;i<=8;i++) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*30,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await phone.waitForTimeout(650);
  assert(await phone.locator('.swiper').evaluate(el=>el.swiper.activeIndex)===1, 'Real mobile touch swipe advances capture');
  assert(await phone.locator('#jump').inputValue()==='20', 'Touch swipe leaves deck slide unchanged');
  await context.close();
  assert(errors.length===0,'No browser script errors');
  await page.locator('.swiper').evaluate(el=>el.swiper.slideTo(16,0));
  await page.screenshot({path:'output/playwright/atlas-desktop.png'});
  return {checks,errors};
}
