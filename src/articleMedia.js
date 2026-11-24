import {cases} from './casebook.js'
const add=(image,caption)=>({image,alt:caption,caption})
const insert={
 'thing-robot-hand':[add('assets/projects/thing-highlights.webp','THING 팀 시연 하이라이트')],
 'hydraulic-robot-rl':[add('assets/projects/isaac-sim.jpg','Isaac Sim에 로봇 모델들을 배치한 병렬 학습 환경')],
 'smart-assembly-transport':[add('assets/projects/smart-assembly.svg','장치와 관제 프로그램이 연결되는 조립·운송 공정 설명도')],
 kinderbot:[add('assets/case-ui/collect.webp','교사용 앱 · 수집이 끝난 품목과 아직 찾는 중인 품목을 구분합니다.')],
 cadflow:[add('assets/cadflow-case/overlay-example.svg','설명도 · 합성 패드를 겹쳐 위치 차이를 읽는 예시입니다.')]
}
export function articleMedia(p){const c=cases[p.slug];const items=[...(p.printGallery||[]).map(x=>({...x,image:x.src})),...(insert[p.slug]||[]),c,...(c.extra||[])];return [...new Map(items.map(i=>[i.image,i])).values()]}
export function splitMedia(p){const all=articleMedia(p),c=cases[p.slug];let hero=p.heroVideo?null:p.slug==='go1-remote-inspection'?c:all[0];let rest=all.filter(i=>i.image!==hero?.image);const evidence=rest.find(i=>i.image===c.image);if(evidence)rest=rest.filter(i=>i!==evidence);return {hero,evidence,rest}}
