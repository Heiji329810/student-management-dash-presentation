async (page) => {
 const base=page.url().split(/[?#]/)[0];
 const problems=[],views=[];const count=20;
 await page.reload();await page.mouse.move(100,100);
 async function inspect(label){
  await page.locator('body').click({position:{x:3,y:3}});await page.goto(base+'#slide-1');
  const v=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,background:getComputedStyle(document.body).backgroundColor,fullscreen:Boolean(document.fullscreenElement)}));
  for(let i=0;i<count;i++){
   if(i)await page.keyboard.press('ArrowRight');
   const r=await page.locator('.slide.active').evaluate(el=>{
    const b=el.getBoundingClientRect(),footer=el.querySelector('.slide-footer').getBoundingClientRect();
    const children=[...el.querySelectorAll('h1,h3,li,.subtitle,.takeaway,.screen-layout,.cards,.steps,.architecture-grid,.gallery-frame')];
    const overflow=children.filter(c=>{const r=c.getBoundingClientRect();return r.bottom>footer.top+1||r.right>b.right+2||r.left<b.left-2}).map(c=>c.className||c.tagName);
    const missing=[...el.querySelectorAll('img')].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.src);
    return {background:getComputedStyle(el).backgroundColor,x:b.x,y:b.y,width:b.width,height:b.height,overflow,missing,controlsHidden:document.querySelector('#presentation-menu').hidden};
   });
   if(r.background!=='rgb(24, 42, 44)'||r.overflow.length||r.missing.length||r.x!==0||r.y!==0||Math.abs(r.width-v.width)>1||Math.abs(r.height-v.height)>1||!r.controlsHidden)problems.push({view:label,slide:i+1,...r});
   if([0,1,2,4,16,19,20].includes(i))await page.screenshot({path:`output/playwright/blue-${label}-slide-${i+1}.png`});
  }
  views.push({label,...v,slides:count});
 }
 const nativeContext=await page.context().browser().newContext({viewport:null});
 const nativePage=await nativeContext.newPage();await nativePage.goto(base);
 const native=await nativePage.evaluate(()=>{const b=document.querySelector('.slide.active').getBoundingClientRect();return {width:innerWidth,height:innerHeight,slideWidth:b.width,slideHeight:b.height,toolbarHidden:document.querySelector('#presentation-menu').hidden}});
 await nativePage.screenshot({path:'output/playwright/blue-native-clean-canvas.png'});await nativeContext.close();
 if(native.width!==native.slideWidth||native.height!==native.slideHeight||!native.toolbarHidden)problems.push({native});
 for(const [w,h] of [[1920,1080],[2400,1350]]){
  await page.setViewportSize({width:w,height:h});
  await inspect(`${w}x${h}-window`);
  await page.keyboard.press('f');if(!await page.evaluate(()=>Boolean(document.fullscreenElement)))throw Error('Fullscreen request failed');
  await inspect(`${w}x${h}-fullscreen`);
  await page.keyboard.press('?');
  const box=await page.locator('#presentation-menu').boundingBox();
  if(!box||box.x<0||box.y<0||box.x+box.width>w||box.y+box.height>h)problems.push({menuOverflow:box,w,h});
  await page.screenshot({path:`output/playwright/blue-menu-${w}.png`});
  await page.keyboard.press('Escape');if(!await page.locator('#presentation-menu').isHidden())throw Error('Escape close');
  await page.keyboard.press('f');
 }
 await page.locator('body').click({position:{x:3,y:3}});await page.goto(base+'#slide-1');await page.keyboard.press('Space');
 if(await page.locator('#jump').inputValue()!=='1')throw Error('Space navigation');
 await page.keyboard.press('ArrowLeft');if(await page.locator('#jump').inputValue()!=='0')throw Error('Arrow navigation');
 await page.keyboard.press('o');if(await page.locator('.slide:visible').count()!==21)throw Error('Overview');await page.keyboard.press('Escape');
 await page.locator('#controls-toggle').hover();if(await page.locator('#presentation-menu').isHidden())throw Error('Hover reveal');
 await page.mouse.move(100,100);if(!await page.locator('#presentation-menu').isHidden())throw Error('Hover dismiss');
 await page.keyboard.press('?');await page.locator('#jump').selectOption('20');
 await page.locator('#controls-close').click();if(await page.locator('#controls-toggle').getAttribute('aria-expanded')!=='false')throw Error('Disclosure aria');
 await page.locator('body').click({position:{x:3,y:3}});await page.keyboard.press('Tab');
 const keyboardFocus=await page.evaluate(()=>document.activeElement.id);
 // Explicit keyboard focus on disclosure, then Tab reaches the panel.
 await page.locator('#controls-toggle').focus();
 if(await page.locator('#presentation-menu').isHidden())throw Error('Keyboard focus reveal');
 await page.keyboard.press('Tab');if(!await page.evaluate(()=>document.querySelector('#presentation-menu').contains(document.activeElement)))throw Error('Keyboard access to panel');await page.keyboard.press('Escape');
 const touch=await page.context().browser().newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const mobile=await touch.newPage();await mobile.goto(base);
 const button=await mobile.locator('#controls-toggle').boundingBox();await mobile.touchscreen.tap(button.x+button.width/2,button.y+button.height/2);
 if(await mobile.locator('#presentation-menu').isHidden())throw Error('Touch reveal');
 await mobile.screenshot({path:'output/playwright/blue-touch-menu.png',fullPage:true});
 const close=await mobile.locator('#controls-close').boundingBox();await mobile.touchscreen.tap(close.x+close.width/2,close.y+close.height/2);
 if(!await mobile.locator('#presentation-menu').isHidden())throw Error('Touch dismiss');
 for(const i of [0,1,2,4,16,19,20]){
  await mobile.goto(`${base}#slide-${i+1}`);
  const dims=await mobile.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));if(dims.scroll>dims.w)problems.push({mobileSlide:i+1,horizontalOverflow:dims});
  await mobile.screenshot({path:`output/playwright/blue-mobile-slide-${i+1}.png`,fullPage:true});
 }
 await touch.close();
 return {nativeViewportNull:native,views,keyboardFocus,navigation:'Arrows / Space / F / O / ? / Escape passed',disclosure:'hover / keyboard focus / touch / aria / menu bounds passed',mobile:'390x844 / seven representative slides',problems};
}
