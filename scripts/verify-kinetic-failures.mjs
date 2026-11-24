import { chromium, expect } from '@playwright/test'
const base=process.env.PORTFOLIO_URL || 'http://127.0.0.1:4187/'
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']})
try {
 const page=await browser.newPage({viewport:{width:1280,height:900}})
 await page.addInitScript(()=>{
  window.__gl=[]
  const get=HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext=function(type,...args){const c=get.call(this,type,...args);if(c&&type.includes('webgl')&&!window.__gl.includes(c))window.__gl.push(c);return c}
 })
 await page.goto(`${base}#/lab-archive`)
 await expect(page.locator('.particle-stage')).toHaveAttribute('data-state','ready')
 for(let i=0;i<3;i++) {
  await page.evaluate(()=>{location.hash='/about'})
  await expect(page.locator('.particle-stage')).toHaveCount(0)
  await page.waitForTimeout(100)
  expect(await page.evaluate(()=>window.__gl.filter(c=>!c.isContextLost()).length)).toBe(0)
  await page.evaluate(()=>{location.hash='/lab-archive'})
  await expect(page.locator('.particle-stage')).toHaveAttribute('data-state','ready')
  await expect(page.locator('.particle-stage canvas')).toHaveCount(1)
 }
 console.log('PASS route remount releases contexts; exactly one canvas remains')
 await page.close()
 const blocked=await browser.newPage()
 await blocked.route(/\/(?:src\/kinetic\/particleStage\.js|assets\/particleStage-[^/]+\.js)(?:\?.*)?$/,r=>r.abort('failed'))
 await blocked.goto(`${base}#/lab-archive`)
 await expect(blocked.locator('.particle-stage')).toHaveAttribute('data-state','fallback')
 await expect(blocked.getByRole('heading',{level:1})).toBeVisible()
 await expect(blocked.getByRole('button',{name:'Wave',exact:true})).toBeDisabled()
 await blocked.getByRole('button',{name:'프로젝트 바로 보기'}).click()
 await expect(blocked.locator('#kinetic-projects')).toBeInViewport()
 console.log('PASS lazy scene import failure preserves content and disables unavailable controls')
 await blocked.close()
 const faulty=await browser.newPage()
 await faulty.addInitScript(()=>{
  window.__gl=[]
  const get=HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext=function(type,...args){const c=get.call(this,type,...args);if(c&&type.includes('webgl')&&!window.__gl.includes(c))window.__gl.push(c);return c}
  WebGL2RenderingContext.prototype.drawArrays=function(){throw new Error('QA injected draw failure')}
  WebGL2RenderingContext.prototype.drawElements=function(){throw new Error('QA injected draw failure')}
 })
 await faulty.goto(`${base}#/lab-archive`)
 await expect(faulty.locator('.particle-stage')).toHaveAttribute('data-state','fallback')
 await expect(faulty.getByRole('button',{name:'Grid',exact:true})).toBeDisabled()
 expect(await faulty.evaluate(()=>window.__gl.filter(c=>!c.isContextLost()).length)).toBe(0)
 console.log('PASS render exception returns static preview and releases GPU context')
 await faulty.close()
 const unavailable=await browser.newPage()
 await unavailable.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:get.call(this,type,...args)}})
 await unavailable.goto(`${base}#/lab-archive`)
 await expect(unavailable.locator('.particle-stage')).toHaveAttribute('data-state','fallback')
 await expect(unavailable.locator('.particle-stage__fallback')).toBeVisible()
 await expect(unavailable.getByRole('heading',{level:1})).toBeVisible()
 console.log('PASS no WebGL retains static sculpture and full portfolio')
} finally {await browser.close()}
