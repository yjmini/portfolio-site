import { useEffect } from 'react'
import { ArrowLeft, ExternalLink, Github, Mail, Printer } from 'lucide-react'
import { awards, certifications, experience, profile, projects, toolGroups } from './data'
import './print-portfolio.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const detailBlueprints = [
  {
    slug: 'hydraulic-robot-rl',
    eyebrow: 'ROBOT INTELLIGENCE · KAERI',
    type: '개인 과제',
    flow: ['로봇 모델·환경 구성', 'PPO 정책 학습', 'reward·영상 분석', '정책 export 검토', '실로봇 제약 점검'],
    contribution: [
      'Isaac Lab에서 observation/action space와 전진·자세·관절 움직임 reward를 나누어 학습 환경을 구성했습니다.',
      'W&B·TensorBoard 로그와 rollout 영상을 함께 보며 정책이 실제로 어떤 행동으로 보상을 얻는지 확인했습니다.',
      '정책 export 이후 command limit, 추론 지연, 제어 주기, 유압 응답과 안전 조건을 실제 적용 체크 항목으로 정리했습니다.',
    ],
    evidence: ['학습 로그', 'rollout 영상', '정책 export 흐름', 'ROS2 적용 제약 검토'],
    troubleshooting: [
      {
        title: '전진 대신 제자리 흔들림으로 보상을 얻는 reward cheating',
        problem: '총 reward는 증가했지만 로봇의 전진 변위가 거의 없었습니다.',
        action: '전진 속도·자세 안정성·관절 움직임 penalty를 분리해 로그와 영상을 비교하고, 불필요한 관절 움직임의 우선순위를 조정했습니다.',
        result: '실패 유형을 수치와 행동으로 구분하고, 목표를 “전진 변위가 발생하는 최소 정책”으로 다시 정의했습니다.',
      },
      {
        title: '시뮬레이션과 유압식 실기체 사이의 응답 차이',
        problem: '유압 응답 지연과 비선형성 때문에 시뮬레이션 성능을 그대로 적용하기 어려웠습니다.',
        action: 'domain randomization뿐 아니라 실제 command 범위, 제어 주기, 추론 지연, 안전 정지 조건을 deploy 검토에 포함했습니다.',
        result: 'RL policy를 단독 제어기가 아니라 실기체 제약을 통과해야 하는 명령 생성기로 다루는 검증 기준을 세웠습니다.',
      },
    ],
  },
  {
    slug: 'go1-remote-inspection',
    eyebrow: 'ROBOT SYSTEM · GRADUATION PROJECT',
    type: '5인 팀 프로젝트',
    flow: ['RealSense RGB-D', 'RTAB-Map·YOLO', 'Jetson/GCS 연산 분산', 'OpenVPN·ROS', 'RViz 원격 시각화'],
    contribution: [
      'OpenVPN 기반 원격 ROS 통신을 구성하고, 네트워크부터 topic과 RViz까지 단계별 확인 절차를 만들었습니다.',
      'RealSense·RTAB-Map의 3D 지도와 YOLOv10 탐지 결과가 원격 GCS에 전달되는 파이프라인을 통합했습니다.',
      'Jetson과 GCS의 연산 역할을 나누어 온보드 자원, 네트워크 전송, 시각화 부하를 함께 고려했습니다.',
    ],
    evidence: ['Unitree Go1 실기체', '3D Pointcloud Map', 'YOLO 탐지 화면', '우수상 2회'],
    troubleshooting: [
      {
        title: 'LTE/OpenVPN 환경에서 ROS 데이터가 보이지 않는 문제',
        problem: 'VPN 터널, IP 대역, ROS 환경변수, topic discovery 중 한 계층만 어긋나도 GCS 화면이 멈췄습니다.',
        action: 'ping → VPN tunnel → ROS topic list/echo → RViz 순서로 점검 단계를 고정했습니다.',
        result: '장애 원인을 네트워크·ROS discovery·시각화 계층으로 빠르게 좁힐 수 있는 재현 가능한 루틴을 남겼습니다.',
      },
      {
        title: 'SLAM·객체 인식·원격 시각화의 동시 부하',
        problem: 'Jetson에서 센서 입력, 지도 생성, 추론과 전송을 함께 처리하면 병목 위치가 불명확했습니다.',
        action: '로봇에서 반드시 처리할 데이터와 GCS로 옮길 고부하 연산을 구분해 기능을 분산했습니다.',
        result: '정확도뿐 아니라 지연, 대역폭, 온보드 연산 자원의 균형을 시스템 성능 기준으로 적용했습니다.',
      },
    ],
  },
  {
    slug: 'smart-assembly-transport',
    eyebrow: 'ROS2 INTEGRATION · SSAFY',
    type: '팀 프로젝트 · 통합 담당',
    flow: ['음성 작업 지시', 'ROS2 FSM', '조립·비전 검사', 'Nav2 무인 배송', 'Django·Vue 관제'],
    contribution: [
      'STT, 컨베이어, Dobot, YOLO/OpenCV 검사, TurtleBot/Nav2 배송을 ROS2 FSM의 상태 전이로 연결했습니다.',
      'Django API·WebSocket·Vue 관제 화면에서 작업 상태와 로봇 이벤트를 확인하도록 로봇/웹 경계를 설계했습니다.',
      '실장비가 없거나 일부 장치가 끊겨도 검증할 수 있도록 실제 구현과 같은 인터페이스의 Mock을 먼저 구성했습니다.',
    ],
    evidence: ['공개 GitHub 저장소', 'Mock 기반 E2E 흐름', 'ROS2 상태 전이', '컨베이어 실장비 진단'],
    troubleshooting: [
      {
        title: '장비 가용성과 네트워크 상태가 전체 테스트를 막는 문제',
        problem: '한 장비만 사용할 수 없어도 음성 명령부터 배송까지 전체 흐름을 반복 검증하기 어려웠습니다.',
        action: '카메라·컨베이어·Dobot·TurtleBot 경계를 동일 인터페이스의 Mock으로 분리하고 FSM에서 실제/Mock을 교체 가능하게 했습니다.',
        result: '장비 준비 상태와 무관하게 상태 전이, 실패 분기, 웹 관제까지 먼저 반복 실행할 수 있게 했습니다.',
      },
      {
        title: '구동 중 컨베이어를 즉시 중단해야 하는 안전 요구',
        problem: '동기식 스테퍼 펄스 루프가 실행되는 동안 stop·emergency-stop 명령을 처리할 수 없었습니다.',
        action: '펄스 루프가 협력적 중지 요청을 주기적으로 확인하도록 바꾸고, active-low enable과 방향 제어를 실장비에서 각각 진단했습니다.',
        result: '정·역회전과 구동 중 stop·emergency-stop 중단이 실제 컨베이어에서 동작함을 확인했습니다.',
      },
    ],
  },
  {
    slug: 'hazardous-process-automation',
    eyebrow: 'ROBOT AUTOMATION · KAERI',
    type: '개인 과제',
    flow: ['수작업 공정 분석', '로봇 동작 분해', '작업물 정렬 조건', 'MoveIt 경로 검토', '가이드 구조 보정'],
    contribution: [
      '반복적이고 위험한 수작업을 접근·정렬·결합·후퇴의 로봇 동작 단위로 분해했습니다.',
      'MoveIt 경로와 end-effector 접근 방향, 작업물 기준 위치를 비교해 반복 실행 조건을 정리했습니다.',
      'SolidWorks로 전용 가이드 구조를 설계·보정하며 제어 코드와 기구 오차를 함께 다뤘습니다.',
    ],
    evidence: ['MoveIt 경로 검토', '자동화 시퀀스', 'SolidWorks 가이드', '데모 영상'],
    troubleshooting: [
      {
        title: '계획 경로와 실제 작업 위치의 불일치',
        problem: '같은 경로 명령을 사용해도 좌표계, 작업물 고정, 가이드 구조 오차 때문에 반복성이 떨어졌습니다.',
        action: '경로 코드만 수정하지 않고 접근 방향, 작업물 기준 위치, 가이드 형상을 함께 보정했습니다.',
        result: 'SW 명령과 기구 기준이 함께 맞아야 반복 가능한 자동화가 된다는 조건을 도출했습니다.',
      },
      {
        title: '공개 범위를 지키면서 기술 기여를 설명해야 하는 문제',
        problem: '세부 품목과 공정 조건은 외부에 그대로 공개할 수 없었습니다.',
        action: '내부 명칭 대신 고위험 작업, 정밀 정렬, 전용 가이드처럼 엔지니어링 문제와 수행 범위 중심으로 일반화했습니다.',
        result: '민감정보를 제외하면서도 공정 분해, 경로 검토, SW·기구 통합 경험을 확인할 수 있게 정리했습니다.',
      },
    ],
  },
  {
    slug: 'ros2-control-ui',
    eyebrow: 'CONTROL SOFTWARE · KAERI',
    type: '개인 과제',
    flow: ['robot_to_ui 수신', '상태 표시', '조작 조건 확인', 'ui_action 발행', '상태 재확인'],
    contribution: [
      'PyQt5/Qt Designer 기반 UI에서 ROS2 상태 구독과 명령 발행 흐름을 분석했습니다.',
      'hold·preset·master mode와 로봇 연결 상태에 따라 버튼이 활성화되는 안전 조작 조건을 정리했습니다.',
      'GUI 이벤트와 ROS2 callback을 분리하고, 명령 전후 실제 상태를 다시 확인하도록 동작 흐름을 개선했습니다.',
    ],
    evidence: ['ROS2 topic 흐름', 'PyQt5 제어 화면', '상태 기반 버튼 로직', '실행 데모'],
    troubleshooting: [
      {
        title: '화면의 버튼 상태와 실제 로봇 상태가 어긋날 가능성',
        problem: 'GUI 이벤트와 ROS2 callback의 타이밍이 다르면 사용자가 보는 상태와 실기체 상태가 달라질 수 있었습니다.',
        action: '상태 수신과 명령 발행을 분리하고, 실제 robot_to_ui 값으로 조작 가능 조건을 결정했습니다.',
        result: 'UI를 단순 조작판이 아니라 비정상 명령을 차단하는 제어 소프트웨어 구성 요소로 개선했습니다.',
      },
      {
        title: 'Qt 이벤트 루프와 ROS2 spin의 동시 실행',
        problem: '두 이벤트 처리 흐름을 순차 실행하면 화면 갱신이나 topic callback 한쪽이 지연될 수 있었습니다.',
        action: 'UI thread와 ROS2 callback 처리를 분리하고 상태 변화 로그로 명령 전후를 확인했습니다.',
        result: '화면 반응성과 ROS2 상태 동기화를 함께 유지하는 실행 구조를 정리했습니다.',
      },
    ],
  },
]

const detailProjects = detailBlueprints.map((blueprint) => ({
  ...projects.find((project) => project.slug === blueprint.slug),
  ...blueprint,
}))

function PageFooter({ page }) {
  return <footer className="portfolio-page-footer">
    <span>YOON JEONGMIN · ROBOT SOFTWARE PORTFOLIO</span>
    <span>{String(page).padStart(2, '0')} / {String(detailProjects.length + 2).padStart(2, '0')}</span>
  </footer>
}

function SkillGroup({ name, tools }) {
  return <div className="portfolio-skill-group"><strong>{name}</strong><p>{tools.join(' · ')}</p></div>
}

function CoverPage() {
  return <section className="portfolio-sheet portfolio-cover" aria-label="프로필, 기술, 경험">
    <div className="cover-mark">ROBOT SOFTWARE<br/>PORTFOLIO / 2026</div>
    <header className="cover-header">
      <img src={asset('assets/profile/yoon-jeongmin.png')} alt="윤정민 프로필" />
      <div>
        <p className="portfolio-kicker">PHYSICAL AI · ROBOT SYSTEMS</p>
        <h1>윤정민 <small>Yoon Jeongmin</small></h1>
        <h2>로봇 지능을 실제 시스템까지 연결하고 검증합니다.</h2>
      </div>
    </header>
    <p className="cover-summary">Isaac Lab/PPO 정책 학습, ROS2 제어, RGB-D 비전·SLAM, 실제 하드웨어 통합을 수행했습니다. 모델 성능만 제시하기보다 <b>입력–상태–출력, 실패 조건, 반복 가능한 확인 절차</b>를 함께 남깁니다.</p>
    <div className="cover-contact">
      <span><Mail size={15} />{profile.email}</span>
      <a href={profile.github}><Github size={15} />github.com/yjmini</a>
      <span>{profile.location}</span>
    </div>

    <div className="cover-columns">
      <div>
        <div className="portfolio-section-title"><span>01</span><h3>Technical Skills</h3></div>
        <div className="portfolio-skill-list">
          {toolGroups.map((group) => <SkillGroup key={group.name} {...group} />)}
        </div>
      </div>
      <div>
        <div className="portfolio-section-title"><span>02</span><h3>Experience & Education</h3></div>
        <div className="cover-timeline">
          {experience.slice(0, 3).map((item) => <article key={item.period}>
            <time>{item.period}</time>
            <h4>{item.role}</h4>
            <p>{item.place}</p>
            <ul>{item.bullets.slice(0, 2).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </div>
    <div className="cover-recognition">
      <div><strong>Recognition</strong><p>{awards.map(([name]) => name).join(' · ')}</p></div>
      <div><strong>Certification</strong><p>{certifications.map(([name]) => name).join(' · ')}</p></div>
    </div>
    <PageFooter page={1} />
  </section>
}

function SummaryPage() {
  return <section className="portfolio-sheet portfolio-summary" aria-label="프로젝트 요약">
    <header className="portfolio-page-header">
      <div><p className="portfolio-kicker">PROJECT INDEX</p><h2>Projects Summary</h2></div>
      <p>강화학습·시뮬레이션에서 ROS2 시스템 통합과 실장비 제어까지, 제가 직접 맡은 범위와 검증 근거를 기준으로 정리했습니다.</p>
    </header>
    <div className="summary-list">
      {detailProjects.map((project, index) => <article key={project.slug} className="summary-project">
        <div className="summary-number">{String(index + 1).padStart(2, '0')}</div>
        <div className="summary-main">
          <div className="summary-title"><h3>{project.title}</h3><span>p.{index + 3}</span></div>
          <dl>
            <div><dt>기간</dt><dd>{project.period}</dd></div>
            <div><dt>참여</dt><dd>{project.type}</dd></div>
            <div className="wide"><dt>개요</dt><dd>{project.tagline}</dd></div>
            <div className="wide"><dt>기술 환경</dt><dd>{project.stack.join(', ')}</dd></div>
            <div className="wide"><dt>담당 역할</dt><dd>{project.role}</dd></div>
          </dl>
        </div>
      </article>)}
    </div>
    <PageFooter page={2} />
  </section>
}

function Flow({ items }) {
  return <div className="project-flow" aria-label="시스템 흐름">
    {items.map((item, index) => <div key={item}><span>{item}</span>{index < items.length - 1 && <b aria-hidden="true">→</b>}</div>)}
  </div>
}

function DetailPage({ project, page }) {
  return <section className="portfolio-sheet portfolio-detail" aria-label={`${project.title} 프로젝트 상세`}>
    <header className="detail-header">
      <p className="portfolio-kicker">{project.eyebrow}</p>
      <h2>{project.title}</h2>
      <div className="detail-meta"><strong>{project.tagline}</strong><span>{project.type}</span><span>{project.period}</span></div>
    </header>

    <div className="detail-visual">
      <img src={asset(project.image)} alt={`${project.title} 프로젝트 이미지`} style={{ objectPosition: project.imagePosition || 'center' }} />
      <div className="visual-caption"><b>{project.index}</b><span>{project.stack.slice(0, 4).join(' / ')}</span></div>
    </div>

    <div className="detail-overview">
      <div><h3>개요</h3><p>{project.summary}</p></div>
      <div><h3>담당 범위</h3><p>{project.role}</p></div>
    </div>

    <Flow items={project.flow} />

    <div className="detail-body">
      <div>
        <h3>기여한 부분 및 성과</h3>
        <ul className="contribution-list">{project.contribution.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="evidence-box"><strong>검증 근거</strong><p>{project.evidence.join(' · ')}</p></div>
      </div>
      <div>
        <h3>트러블슈팅 <small>문제 → 조치 → 결과</small></h3>
        <div className="troubleshooting-list">{project.troubleshooting.map((item, index) => <article key={item.title}>
          <h4>{index + 1}. {item.title}</h4>
          <p><b>문제</b>{item.problem}</p>
          <p><b>조치</b>{item.action}</p>
          <p><b>결과</b>{item.result}</p>
        </article>)}</div>
      </div>
    </div>

    <div className="detail-stack"><strong>사용 기술</strong>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
    {project.links?.[0] && <a className="detail-repo" href={project.links[0].href}><Github size={14}/>{project.links[0].href.replace('https://', '')}<ExternalLink size={12}/></a>}
    <PageFooter page={page} />
  </section>
}

export default function PrintPortfolio() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = '윤정민 로봇 소프트웨어 포트폴리오'
    document.body.classList.add('print-portfolio-active')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('print-portfolio-active')
    }
  }, [])

  return <div className="print-portfolio-page">
    <div className="portfolio-toolbar" role="region" aria-label="포트폴리오 인쇄 도구">
      <a href="#/resume"><ArrowLeft size={17}/>포트폴리오 사이트</a>
      <div className="print-guidance"><strong>A4 · {detailProjects.length + 2}페이지</strong><span>배경 그래픽 켜기 · 여백 없음 · 배율 100%</span></div>
      <button type="button" onClick={() => window.print()}><Printer size={17}/>PDF로 인쇄</button>
    </div>
    <main className="portfolio-document">
      <CoverPage />
      <SummaryPage />
      {detailProjects.map((project, index) => <DetailPage key={project.slug} project={project} page={index + 3} />)}
    </main>
  </div>
}
