import { ArrowLeft, ArrowUpRight, Maximize2 } from 'lucide-react'
import { resolvePublicAsset } from './publicAsset'
import './field-case.css'
import CaseMeasurements from './CaseMeasurements'

const asset = path => resolvePublicAsset(import.meta.env.BASE_URL, path)
const screens = [
  ['select', '준비 요청', '교사가 토마토, 생선, 포도를 두 개씩 선택합니다.'],
  ['collect', '수집 중', '토마토는 완료, 생선은 수집 중, 포도는 대기 중입니다.'],
  ['missing', '작업 결과', '생선 한 개를 찾지 못했습니다. 전체 작업이 끝나도 부족한 품목과 수량은 남습니다.'],
]

function Plate({ src, alt, eager = false }) {
  return <a className="fc-plate" href={asset(src)} aria-label={`${alt} · 원본 보기`}>
    <img src={asset(src)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"/>
    <span className="fc-enlarge"><Maximize2 size={15} aria-hidden="true"/>원본 보기</span>
  </a>
}

function SupplySequence() {
  return <section className="fc-section">
    <h2>시장놀이를 준비하는 교사의 화면</h2>
    <p>같은 준비 요청을 세 장면으로 따라가면, 완료 표시 하나로는 알 수 없는 차이가 보입니다.</p>
    <div className="fc-strip">{screens.map(([file, title, detail], index) => <figure key={file}>
      <Plate src={`assets/case-ui/${file}.webp`} alt={`${title}: ${detail}`}/>
      <figcaption><small>0{index + 1}</small><b>{title}</b><span>{detail}</span></figcaption>
    </figure>)}</div>
    <small className="fc-credit">KinderBot 앱 시나리오 캡처 · 준비 및 일부 누락 화면 발췌</small>
  </section>
}

export default function FieldCase({ project, next }) {
  const isCad = /cadflow/i.test(project.title)
  const gallery = project.printGallery || []
  const main = gallery[0] || { src: project.image, alt: project.title, caption: project.shortTitle }
  return <main id="main-content" tabIndex="-1" className="detail-page page-enter field-case"><div className="container">
    <a className="back-link" href="#/projects"><ArrowLeft size={15}/> 프로젝트 목록</a>
    <header className="fc-heading"><p>{project.period} <span>/</span> {project.status}</p><h1>{project.title}</h1><p className="fc-deck">{project.tagline}</p></header>
    <div className="fc-opening">
      <figure className="fc-hero"><Plate src={main.src} alt={main.alt} eager/><figcaption>{main.caption}</figcaption></figure>
      <aside><h2>맡은 일</h2><p>{project.role}</p><div>{project.stack.join(' · ')}</div></aside>
    </div>
    <CaseMeasurements slug={project.slug}/>
    {!isCad && <SupplySequence/>}
    <section className="fc-section fc-story"><h2>{isCad ? '도면을 읽는 일과 좌표를 계산하는 일' : '어느 시점에 준비가 끝났다고 볼까'}</h2><div><p>{project.problem}</p>{isCad && <p>데이터시트에서 핀 번호와 치수를 읽는 일은 모델에 맡기고, 반복되는 패드의 좌표는 Python으로 계산했습니다. 치수를 하나 고칠 때마다 그림을 다시 해석하지 않아도 됩니다.</p>}<p>{project.decision}</p></div></section>
    {gallery.length > 1 && <div className="fc-evidence">{gallery.slice(1).map(g => <figure key={g.src}>
      <Plate src={g.src} alt={g.alt}/><figcaption>{g.caption}</figcaption>
    </figure>)}</div>}
    <section className="fc-section fc-story"><h2>{isCad ? '생성 뒤에 남는 일' : '어디까지 확인했나'}</h2><div><p>{project.result}</p>{isCad && <p>발표 시연에서 두 라이브러리를 겹쳐 보니 핀 패드는 일치했지만 다른 도형에는 차이가 남았습니다. 파일을 생성한 뒤에도 사람이 확인할 부분입니다.</p>}</div></section>
    {!isCad && <a href={asset('assets/kinderbot-case/NOTICE.txt')} className="fc-credit">KinderBot 사진·화면 출처와 이용 안내</a>}
    <a href={`#/projects/${next.slug}`} className="next-project"><span>다음 프로젝트</span><strong>{next.title}</strong><ArrowUpRight/></a>
  </div></main>
}
