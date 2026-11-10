async (page) => {
  const base=page.url().split(/[?#]/)[0]; const checks=[];
  const assert=(ok,label)=>{if(!ok)throw Error(label);checks.push(label);};
  const playing=()=>page.locator('#playback').getAttribute('aria-pressed');
  const index=()=>page.locator('.swiper').evaluate(el=>el.swiper.activeIndex);
  const slide=()=>page.locator('#jump').inputValue();
  await page.clock.install();
  await page.goto(base); await page.clock.runFor(13000);
  assert(await slide()==='0'&&await playing()==='false','Default paused');
  await page.keyboard.press('p');await page.clock.runFor(12000);
  assert(await slide()==='1','P starts narrative playback');
  await page.keyboard.press('p');await page.clock.runFor(24000);
  assert(await slide()==='1','P pauses');
  await page.goto(base+'?autoplay=1&interval=3#slide-20');await page.clock.runFor(3000);
  assert(await slide()==='20'&&await index()===0,'Narrative enters gallery at first capture');
  await page.clock.runFor(3000);assert(await index()===1&&await slide()==='20','Timer advances capture, not deck');
  await page.clock.runFor(120000);assert(await index()===41,'Autoplay visits all 42 captures');
  await page.clock.runFor(3000);assert(await slide()==='0','After final capture loops to cover');
  await page.goto(base+'?autoplay=1&interval=3#slide-21');
  await page.keyboard.press('ArrowRight');await page.clock.runFor(15000);
  assert(await index()===1&&await playing()==='false','Keyboard browsing pauses autoplay');
  await page.keyboard.press('p');await page.clock.runFor(3000);
  assert(await index()===2,'P resumes capture playback');
  await page.locator('[data-workflow="5"]').click();await page.clock.runFor(15000);
  assert(await playing()==='false'&&await page.locator('.swiper-slide-active').getAttribute('data-group')==='5','Workflow click pauses');
  await page.keyboard.press('p');
  await page.locator('.swiper').focus();await page.clock.runFor(6000);
  assert(await playing()==='false','Keyboard focus pauses');
  await page.keyboard.press('p');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  const before=await index();await page.clock.runFor(9000);assert(await index()===before,'Hidden tab suspends timer');
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.clock.runFor(3000);assert(await index()===before+1,'Visible tab resumes with fresh interval');
  await page.keyboard.press('o');assert(await playing()==='false','Overview pauses');
  for(const [value,expected] of [['1','3'],['999','120'],['bad','12']]){
    await page.goto(base+'?autoplay=1&interval='+value+'#slide-21');
    assert(await page.locator('#interval').inputValue()===expected,'Interval normalization '+value);
  }
  assert(await page.locator('#presentation-menu').isHidden(),'Autoplay leaves corner controls hidden');
  return {checks};
}
