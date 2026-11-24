const base = 'assets/kinderbot-case/'
const slug = 'kinderbot'
const title = 'KinderBot · 유치원 교사 보조 로봇'
const period = '2026년 SSAFY 특화프로젝트'
const role = 'Isaac Sim 교실·로봇 환경, 시연 데이터 변환, 교사용 웹 개발'
const stack = ['Isaac Sim', 'ROS2', 'LeRobot', 'Python', 'React', 'TypeScript']
const award = '삼성 청년 SW·AI 아카데미 특화프로젝트 우수상(1등)'
const teamResult = `팀은 ${award}을 받았습니다.`
const realDemoArchive = '팀이 보관한 실물 로봇팔 원격조작 시연은 중복을 제외하면 421회입니다. 총 306,875프레임으로, 초당 30프레임 기준 약 2.8시간입니다.'
const classroom = { src: `${base}classroom.webp`, alt: 'Isaac Sim 교실에 놓인 수납장과 활동 테이블', caption: '교구를 수집하고 배치하는 가상 교실' }
const arm = { src: `${base}sim-arm.webp`, alt: '노란색 모의 로봇팔 옆에 놓인 토마토와 생선 모양 교구', caption: 'Isaac Sim 로봇팔과 교구' }
const items = { src: `${base}item-status.webp`, alt: '토마토·생선·포도의 수집 수량과 배치 수량을 따로 표시한 교사용 화면', caption: '교구별 수집·배치 현황' }
const bench = { src: `${base}bench-arm.webp`, alt: '실험대의 흰색 로봇팔과 상자에 담긴 토마토·생선 교구', caption: '팀 실물 시연: 탁상 로봇팔의 집기·배치' }
const cases = [
  {
    title: '바퀴는 도는데 차체가 멈춘 이유',
    before: '가상 복도에서 주행 명령을 보내면 바퀴는 회전했지만 차체는 제자리에 머물렀습니다.',
    cause: '바퀴가 명령대로 회전해도 바닥과 제대로 접촉하지 않으면 차체가 움직이지 않았습니다.',
    action: '주행 코드 대신 바퀴와 바닥이 맞닿는 지점을 살피고 충돌 설정과 그 적용 시점을 바로잡았습니다.',
    after: '같은 복도에서 바퀴만 헛돌던 차체가 주행 명령에 따라 이동하는 것을 확인했습니다.',
  },
  {
    title: '마지막 교구를 집은 시점과 수업 준비가 끝난 시점',
    before: '선반에서 교구를 모두 집었더라도 테이블에 놓기 전에는 수업을 시작할 수 없었습니다.',
    cause: '수집 수량만으로는 교구가 로봇에 실려 있는지, 지정한 자리에 놓였는지 구분할 수 없었습니다.',
    action: '수집한 교구는 배치 대기로 표시하고, 전체 진행률은 테이블에 놓인 수량으로 계산했습니다.',
    after: '교사는 품목별 수집 수량과 배치 수량을 한 화면에서 보고 남은 준비 작업을 확인할 수 있습니다.',
  },
]

// Website: one entry for data.js → projects. `index` assumes append after 13.
export const kinderbotProject = {
  slug, title, period, role, stack, year: '2026', index: '14', shortTitle: 'KinderBot',
  tagline: '선반에서 집은 교구가 수업 테이블에 놓이기까지',
  summary: '교사가 놀이와 준비물을 고르면 로봇이 교구를 모아 테이블에 놓는 팀 프로젝트입니다. 가상 교실과 로봇의 물리 환경을 만들고, 교사가 품목별 준비 상태를 확인하는 웹 화면을 개발했습니다.',
  image: arm.src, imagePosition: 'center', printImage: arm.src,
  printGallery: [arm, classroom, items, bench], evidence: [classroom, items, bench],
  status: 'SSAFY 6인 팀 프로젝트', featured: true, private: true, links: [],
  metrics: [{ value: 'Isaac Sim', label: '교실 주행·배치' }, { value: '1등', label: '특화프로젝트 팀 수상' }],
  problem: '교사가 알고 싶은 것은 로봇이 몇 개를 집었는지가 아니라 수업을 시작해도 되는지였습니다. 선반에서 마지막 교구를 집은 뒤에도 테이블까지의 이동과 배치가 남았습니다.',
  decision: cases[1].action,
  result: `팀은 전체 수집·배치 과정을 시뮬레이션에서, 상자에서 교구를 집어 놓는 동작을 실물 로봇팔로 시연했습니다. ${realDemoArchive} ${teamResult}`,
  highlights: ['바퀴·바닥 충돌 설정을 고쳐 가상 복도 주행 복구', '원격 조작으로 기록한 시연을 LeRobot 데이터 형식으로 변환', '시간표 기반 AI 제안은 교사가 확인한 뒤에만 작업으로 전환'],
}

// PrintPortfolio.jsx consumes this via portfolioEditorial.js → editorialProjects.
export const kinderbotEditorial = {
  slug, title, period, role, stack, team: '6인 팀 · 시뮬레이션, 자율주행, 모방학습, 시스템 통합',
  background: '수업 준비에는 교구를 찾는 일과 제자리에 가져다 놓는 일이 모두 필요합니다. 팀은 교사가 놀이를 고르면 이 두 작업을 이어서 수행하는 로봇을 만들었습니다.',
  goal: '가상 교실에서 수집부터 배치까지 시험하고 교사가 웹에서 남은 작업을 확인할 수 있도록 했습니다.',
  features: ['시간표에 맞춘 준비물 제안과 교사 확인', '가상 교실에서 선반 순회와 교구 배치', '품목별 준비 상태 확인'],
  flow: ['준비물 선택', '교사 확인', '교구 수집', '테이블 배치', '결과 확인'],
  contributions: [
    { title: '교실 물리 환경과 시연 데이터 수집', body: '교실과 로봇의 충돌 조건을 설정하고 LiDAR를 ROS2에 연결했습니다. 원격 조작으로 기록한 로봇팔 시연을 LeRobot 데이터 형식으로 변환했습니다.', proof: realDemoArchive },
    { title: '교사가 확인하고 시작하는 준비 요청', body: '시간표에서 대상 수업을 고르는 일은 코드에, 준비물 제안과 수량 수정은 AI에 맡겼습니다. 교사가 목록을 확인한 뒤 작업을 시작하고 품목별 결과를 볼 수 있게 했습니다.', proof: `그림 「${items.caption}」: 교구마다 집은 수량과 놓은 수량을 따로 표시합니다.` },
  ],
  cases,
  outcome: `전체 이동과 배치는 가상 교실에서, 실물 팔의 집기와 배치는 실험대에서 시연했습니다. ${teamResult}`,
  reflection: '준비가 끝났다는 기준은 로봇과 교사에게 달랐습니다. 교구가 놓인 시점을 기준으로 삼자 화면이 알려줘야 할 상태도 분명해졌습니다.',
  nextStep: '실제 교실에서는 교사가 이 화면만 보고 준비가 덜 된 교구를 바로 찾을 수 있는지 확인하고 싶습니다.',
  gallery: [{ ...classroom, contributionIndex: 0 }, { ...items, contributionIndex: 1 }], links: [],
}
