// Print-route content; normal website data is intentionally independent.
export const editorialProjects = [
  {
    slug: 'hydraulic-robot-rl',
    title: '유압식 고하중 로봇 PPO 제어',
    period: '2025.08 — 2025.12',
    team: 'KAERI 인턴 개인 과제',
    role: '학습 환경 구성, 보상 설계, 로그 분석과 ROS2 배포 노드 구현',
    background: '유압식 로봇의 전진 동작을 강화학습으로 만들고 실제 장비에서도 적용할 수 있는지 확인하는 과제였습니다. 시뮬레이션의 보상 증가와 실기체의 움직임을 구분해 살폈습니다.',
    goal: '팔을 이용한 전진 정책을 학습하고, 실제 유압 응답과 명령 전달 조건을 맞춰 적용 가능성을 확인했습니다.',
    features: ['Isaac Lab 기반 PPO 정책 학습', '보상 항목과 실패 영상 비교', '센서 상태를 정책 입력으로 변환하는 ROS2 배포 노드'],
    stack: ['Isaac Lab', 'Isaac Sim', 'PPO', 'PyTorch', 'ROS2', 'Python'],
    flow: ['물리 모델 점검', '관측값과 행동 정의', 'PPO 학습', '로그와 영상 비교', 'ROS2 실기 시험'],
    contributions: [
      {
        title: '학습 환경과 보상 항목 구성',
        body: 'Isaac Lab에서 관측값과 행동을 정의하고 전진, 자세, 관절 움직임 보상을 분리했습니다. 총보상만 보지 않고 로그와 실패 영상을 비교해 몸을 흔드는 행동을 분석했습니다.',
        proof: '그림 「병렬 학습 환경」: 로봇 모델의 시뮬레이션 구성을 보여줍니다.',
      },
      {
        title: '정책 출력을 실제 제어 명령으로 연결',
        body: '센서 상태를 관측값으로 바꾸고 정책 출력을 제어 명령으로 전달하는 배포 노드를 작성했습니다. 실기 시험에서 명령 크기와 주기, 관절 매핑을 점검하며 채터링에 대응했습니다.',
        proof: '그림 「정책 적용 대상 실기체」: 실제 시험에 사용한 로봇입니다.',
      },
    ],
    cases: [
      {
        title: '학습 전에 바퀴와 충돌 설정부터 수정',
        before: '초기 학습에서는 바퀴가 구르지 않았고 한쪽 팔이 몸체를 관통해, 전진 정책 자체를 평가하기 어려웠습니다.',
        cause: '자기 충돌이 비활성화되어 있었고 바퀴 관절의 Drive 설정이 자유 회전을 방해하고 있었습니다.',
        action: '자기 충돌을 켜고 바퀴 Drive를 제거했습니다. 바퀴 회전과 중력, 충돌 형상을 순서대로 확인했습니다.',
        after: '바퀴 회전과 중력 동작을 확인했습니다. 물리 모델 오류를 먼저 분리한 뒤 학습 행동을 비교할 수 있었습니다.',
      },
      {
        title: '실기체 채터링을 제어 전달 조건에서 추적',
        before: '시뮬레이션에서 이동하던 정책을 실기체에 적용하자 팔이 계속 떨리며 목표 움직임을 재현하지 못했습니다.',
        cause: '유압 응답보다 빠른 reference 변화를 의심했고, 제어 주기 차이와 관절 인덱스 매핑 오류도 확인했습니다.',
        action: '명령 크기와 안전 한계를 적용하고 주기를 맞췄습니다. 목표 속도를 낮춰 재학습하고 관절 매핑을 수정했습니다.',
        after: '조정 이후 실기체에서 시뮬레이션과 유사한 움직임을 관찰했습니다.',
      },
    ],
    outcome: '학습 환경 구성에서 실제 정책 적용 시험까지 연결해 Sim-to-Real 가능성을 확인했습니다. 실기체 움직임은 관찰했지만 반복 성공률과 오차는 정량화하지 않았습니다.',
    reflection: '총보상과 시연 영상만으로는 물리 설정 오류와 정책의 한계를 구분하기 어려웠습니다. 조건별 반복 측정까지 남기지 못한 점이 아쉽습니다.',
    nextStep: '다음 실험에서는 관절 매핑과 제어 주기 점검을 먼저 고정하고, 같은 조건의 반복 실행에서 명령과 관절 응답을 함께 기록하겠습니다.',
    gallery: [
      { src: 'assets/projects/isaac-sim.jpg', alt: '격자 바닥 위에 여러 로봇 모델을 배치한 시뮬레이션 화면', caption: '병렬 학습 환경', contributionIndex: 0 },
      { src: 'assets/projects/hydraulic-robot.jpg', alt: '강화학습 정책 적용을 시험한 유압식 로봇 실기체', caption: '정책 적용 대상 실기체', contributionIndex: 1 },
    ],
    links: [],
  },
  {
    slug: 'thing-robot-hand',
    title: 'THING — 7축 텐던 로봇 손',
    period: '2026.07 — 2026.08',
    team: '6인 팀: 하드웨어 2명, ROS 소프트웨어 3명, 웹 및 인프라 1명',
    role: 'ROS 소프트웨어 담당: 명령 중재, 입력 검사, 안전 상태 전이와 Motor Driver 통합',
    background: '사람의 손 자세를 텐던 로봇 손으로 모방하는 팀 프로젝트였습니다. 수동 조작과 원격 입력도 함께 다뤄야 해, 입력이 바뀌거나 끊겨도 모터 앞단에서 명령을 통제할 구조가 필요했습니다.',
    goal: '팀의 손 자세 인식 결과를 7축 구동으로 연결하고, 제어권과 정지 조건을 만족하는 명령만 전달하도록 구성했습니다.',
    features: ['21개 landmark 기반 손동작 모방', '수동 및 원격 명령의 제어권 중재', '통신 이상 감시와 정지 후 명시적 복구'],
    stack: ['ROS2 Humble', 'Python', 'C++', 'DYNAMIXEL', 'Jetson Orin Nano', 'Raspberry Pi 5'],
    flow: ['손 자세 인식', '7축 명령 변환', 'Command Manager', 'Command Guard', 'Motor Driver'],
    contributions: [
      {
        title: '제어권 중재와 명령 검사',
        body: 'Command Manager에서 입력별 제어권과 lease를 중재하고 Guard에서 시각, 순서, 범위와 변화율을 검사했습니다. 조건을 벗어난 명령은 모터에 전달하지 않도록 구성했습니다.',
        proof: '그림 「손동작 모방 통합 시연」: 팀의 인식 결과와 본인 제어 계층을 연결한 모습입니다. 인식 모델과 하드웨어는 팀 공동 결과입니다.',
      },
      {
        title: '정지와 복구 경계 구현',
        body: '안전 상태 전이와 heartbeat 감시, 수동 실행과 GPIO E-Stop을 구현했습니다. STOP 뒤 이전 명령이 재개되지 않도록 Motor Driver와 통합했습니다.',
        proof: '그림 「텐던 손과 구동부 통합」: 제어 계층을 연결한 실장비입니다. 정지 경합과 복구 조건은 별도의 제어 테스트로 확인했습니다.',
      },
    ],
    cases: [
      {
        title: 'STOP과 제어권 교대가 겹치는 경합',
        before: '정지와 새 제어권 획득이 겹치면 이전 대기열이나 늦게 도착한 명령이 다시 실행될 위험이 있었습니다.',
        cause: '서로 다른 DDS topic의 수신 순서를 mutex만으로 보장할 수 없어, 이전 실행의 명령을 구분해야 했습니다.',
        action: '실행 세대와 제어권 기준으로 이전 명령을 폐기하고, STOP barrier 응답 전에는 새 실행을 차단했습니다.',
        after: '정지와 제어권 획득을 겹치게 하는 통합 테스트에서 이전 명령이 다시 실행되지 않는 경계를 확인했습니다.',
      },
      {
        title: '입력 검사와 안전 상태 전이의 책임 분리',
        before: '오래된 명령과 재전송, 비정상 수치, heartbeat 단절을 함께 다루면서 각 계층의 차단 조건을 정해야 했습니다.',
        cause: '명령의 유효성을 판단하는 일과 로봇 전체의 정지 및 복구 상태를 결정하는 일은 서로 다른 책임이었습니다.',
        action: 'Guard는 명령 검사를 맡고 Safety Manager는 상태 전이를 맡도록 나눴습니다. 출력 차단과 reset 조건도 고정했습니다.',
        after: '비정상 입력과 timeout 경로를 테스트했습니다. SAFE, FAULT, ESTOP은 정상 입력이 돌아와도 명시적 reset 전에는 재동작하지 않도록 했습니다.',
      },
    ],
    outcome: '직접 구현한 제어 및 안전 노드를 Motor Driver 앞단에 연결했습니다. 팀은 손동작 모방과 파지를 시연했고, 본인은 STOP 경합과 복구 조건을 테스트했습니다.',
    reflection: '실제 입력 범위와 제어 계층의 가정이 다르면 정상 동작도 막힐 수 있었습니다. 통합 전에 출력 주기와 허용 변화량을 더 일찍 합의했어야 했습니다.',
    nextStep: '다음 통합에서는 입력 범위와 주기를 인터페이스 표로 먼저 합의하고, 정상 손동작과 비정상 급변 입력을 같은 회귀 테스트에 넣겠습니다.',
    gallery: [
      { src: 'assets/projects/thing/live-mimic-poster.webp', alt: '사람의 손동작을 텐던 로봇 손으로 연결한 팀 통합 시연', caption: '손동작 모방 통합 시연', contributionIndex: 0 },
      { src: 'assets/projects/thing/integrated-robot-hand.webp', alt: '텐던과 액추에이터가 연결된 로봇 손 통합 시제품', caption: '텐던 손과 구동부 통합', contributionIndex: 1 },
    ],
    links: [],
  },
  {
    slug: 'go1-remote-inspection',
    title: 'Unitree Go1 원격 점검 시스템',
    period: '2025.01 — 2025.05',
    team: '5인 졸업작품 팀',
    role: '원격 ROS 통신, SLAM 및 객체 인식 연동, Jetson과 GCS 연산 분리',
    background: '접근이 제한된 환경을 로봇으로 점검하기 위해 영상뿐 아니라 주변의 3D 지도와 객체 정보를 원격 조작자에게 전달하는 시스템을 만들었습니다.',
    goal: 'Go1의 센서 입력부터 원격 GCS 시각화까지 연결하고, 네트워크와 인식 장애를 단계별로 찾을 수 있게 했습니다.',
    features: ['RealSense RGB-D 기반 3D 지도', 'YOLOv10 객체 탐지 결과 전달', 'OpenVPN 원격 ROS 통신과 RViz 시각화'],
    stack: ['ROS Noetic', 'Jetson Orin NX', 'RealSense', 'RTAB-Map', 'YOLOv10', 'OpenVPN'],
    flow: ['RGB-D 센서', 'SLAM 및 객체 인식', '온보드와 GCS 연산 분리', '원격 ROS 통신', 'RViz 지도와 탐지 확인'],
    contributions: [
      {
        title: '온보드와 원격 시스템의 통신 연결',
        body: 'OpenVPN 기반 원격 ROS 통신을 구성하고 Go1 내부 네트워크를 점검했습니다. ping부터 터널, topic 수신, RViz 순서로 확인해 연결 장애를 발생 계층별로 분리했습니다.',
        proof: '그림 「Go1 실기체와 원격 GCS」: 로봇과 원격 시각화의 통합 구성입니다.',
      },
      {
        title: '지도와 탐지 결과의 ROS 파이프라인',
        body: 'RealSense 입력을 RTAB-Map과 YOLOv10에 연결하고 지도와 탐지 결과를 GCS로 전달했습니다. Jetson과 GCS의 연산 역할을 나눠 원격 시각화까지 이어지는 흐름을 구성했습니다.',
        proof: '그림 「원격 조종과 3D 지도 화면」 및 공개 yolov10_ros 저장소: 이미지 입력과 탐지 결과를 ROS topic으로 연결한 구현입니다.',
      },
    ],
    cases: [
      {
        title: 'Raspberry Pi 뒤의 Jetson 외부망 연결',
        before: 'Wi-Fi에 연결된 Raspberry Pi에서는 인터넷이 됐지만 내부 Ethernet의 Jetson에서는 외부망에 접속하지 못했습니다.',
        cause: 'Jetson에서 Wi-Fi 쪽으로 패킷을 전달할 NAT와 포워딩 경로가 Go1 내부 네트워크에 없었습니다.',
        action: 'Raspberry Pi에 NAT와 인터페이스 간 전달 규칙을 설정하고 IPv4 forwarding을 켠 뒤 Jetson에서 ping을 확인했습니다.',
        after: 'Jetson의 외부망 연결을 확인해 패키지 설치를 진행했습니다. 재부팅 후 네트워크 설정을 유지하는 작업은 남았습니다.',
      },
      {
        title: 'RTAB-Map 설치를 막은 OpenCV 패키지 충돌',
        before: 'Jetson에서 RTAB-Map 의존성을 설치하던 중 dpkg 오류가 발생해 SLAM 실행 환경 준비가 중단됐습니다.',
        cause: '기존 opencv-dev와 새 libopencv-dev가 같은 실행 파일을 설치하려 하면서 파일 소유권이 충돌했습니다.',
        action: '충돌한 기존 패키지를 제거하고 OpenCV를 다시 설치했습니다. 버전 확인 후 RTAB-Map 의존성 설치를 재실행했습니다.',
        after: 'OpenCV 버전과 의존성 설치 완료를 확인했습니다. SLAM 소스 수정이 아닌 패키지 환경 정리로 준비를 재개했습니다.',
      },
    ],
    outcome: '실기체의 RGB-D 입력, 지도, 객체 탐지와 원격 시각화를 통합했습니다. 팀 결과물로 졸업연구작품 우수상과 AI Festa 경진대회 우수상을 받았습니다.',
    reflection: '연결 성공과 운영 준비 완료는 달랐습니다. 수동 복구에 의존한 설정이 남았고, 재부팅 뒤 상태까지 확인하는 절차가 부족했습니다.',
    nextStep: '다음 원격 시스템에서는 네트워크 설정 복원과 시작 전 점검을 스크립트로 만들고, 재부팅 및 통신 단절 후 복구까지 확인하겠습니다.',
    gallery: [
      { src: 'assets/projects/go1-remote.png', alt: 'Unitree Go1 실기체와 원격 GCS의 지도 화면', caption: 'Go1 실기체와 원격 GCS', contributionIndex: 0 },
      { src: 'assets/projects/go1-demo.jpg', alt: '원격 조종 화면과 3D 지도 결과를 함께 표시한 데모', caption: '원격 조종과 3D 지도 화면', contributionIndex: 1 },
    ],
    links: [{ label: '객체 인식 ROS 패키지', href: 'https://github.com/yjmini/yolov10_ros' }],
  },
]

export const supportProjects = [
  {
    slug: 'smart-assembly-transport',
    title: '스마트 조립·무인 운송 시스템',
    period: '2026.05 — 2026.06',
    role: 'ROS2 FSM 설계, 로봇과 웹 통합, Mock 실행 구조 구성',
    background: '음성 작업 지시부터 조립, 검사, 배송까지 여러 장비가 협업해야 했습니다. 장비가 모두 준비되지 않아도 전체 상태 흐름을 점검할 방법이 필요했습니다.',
    contributions: [
      { title: '장비 상태와 웹 관제를 연결', body: 'ROS2 FSM으로 작업 단계를 연결하고 Django API, WebSocket, Vue 화면에서 작업 상태를 확인하도록 구성했습니다.', proof: '그림 「조립 공정 관제 화면」: 로봇 작업 상태를 웹에서 확인하는 화면입니다.' },
      { title: '실제 장비와 Mock의 교체 경계', body: '장비별 구현을 같은 인터페이스의 Mock으로 대체해, 하드웨어 없이 상태 전이와 실패 분기를 실행할 수 있게 했습니다.', proof: '공개 저장소 README.md의 Local Mock Quick Start와 mission_orchestrator.mock_runner 실행 경로에서 Mock 공정을 확인할 수 있습니다.' },
    ],
    cases: [
      {
        title: '장비 준비와 전체 흐름 테스트를 분리',
        before: '카메라나 로봇 중 하나를 사용할 수 없으면 조립에서 배송으로 이어지는 전체 상태 전이 확인이 막혔습니다.',
        cause: '장치의 실제 연결 여부에 통합 실행이 의존하면, 장비 문제와 작업 순서 오류를 나눠서 확인하기 어려웠습니다.',
        action: '장치별 응답을 같은 인터페이스의 Mock으로 바꾸고, FSM에서 실제 구현과 교체해 실행할 수 있게 구성했습니다.',
        after: '장비 없이 Mock 공정과 웹 상태를 반복 확인할 수 있었습니다. 실제 장비의 구동 시험과는 범위를 나눠 다뤘습니다.',
      },
    ],
    outcome: '음성 지시에서 조립, 검사, 배송으로 이어지는 Mock 공정과 웹 관제 흐름을 연결했습니다. 실장비 투입 전에 상태 전이를 확인할 수 있게 했습니다.',
    reflection: 'Mock 실행 성공만으로 실제 장치의 타이밍과 정지 동작을 설명할 수는 없었습니다. 두 환경의 시험 범위를 명확히 나눠야 했습니다.',
    nextStep: '장치별로 Mock과 실장비가 같은 이벤트를 내는지 비교하고, 지연과 정지 요청을 넣는 통합 시험을 보강하겠습니다.',
    gallery: [{ src: 'assets/projects/smart-assembly/control-dashboard.webp', alt: '작업 상태와 로봇 이벤트를 보여주는 통합 관제 대시보드', caption: '조립 공정 관제 화면', contributionIndex: 0 }],
    links: [{ label: 'GitHub', href: 'https://github.com/yjmini/smart-assembly-transport' }],
  },
  {
    slug: 'hazardous-process-automation',
    title: '고위험 작업 로봇 공정 자동화',
    period: '2025.07 — 2025.10',
    role: '공정 분해, MoveIt 경로 검토, SolidWorks 가이드 설계',
    background: '반복되는 위험 작업을 로봇 동작으로 바꾸기 위해 접근 경로뿐 아니라 작업물의 정렬과 고정 조건을 함께 검토했습니다.',
    contributions: [
      { title: '경로와 전용 가이드를 함께 검토', body: '공정을 동작 단위로 나누고 MoveIt 경로와 실물 접근 조건을 비교했습니다. 전용 가이드의 간섭 부위를 수정하며 결합과 분리 동작을 시험했습니다.', proof: '그림 「공정 자동화 대상 로봇」: 경로와 장착 조건을 검토한 실기체입니다.' },
    ],
    cases: [
      {
        title: '가이드 안에서 회전하지 못하는 작업물',
        before: '작업물을 전용 가이드에 넣을 수는 있었지만 외곽 돌출부가 걸려, 필요한 회전 동작을 수행하지 못했습니다.',
        cause: '대표 외경을 중심으로 내경을 설계하면서 하단 돌출 형상과 회전 중 필요한 여유를 충분히 반영하지 못했습니다.',
        action: '실물 간섭 부위를 추가 가공하고 내부 완충재를 조정했습니다. 삽입과 고정 상태의 결합 및 분리를 다시 시험했습니다.',
        after: '작업물 삽입과 결합 및 분리의 가능성을 확인했습니다. 공정 전체의 자동화나 반복성 완성을 의미하지는 않습니다.',
      },
    ],
    outcome: '코드만 수정하는 대신 경로와 기구 조건을 함께 조정해 일부 공정 동작의 실물 가능성을 확인했습니다.',
    reflection: '대표 치수만 맞추는 설계로는 실제 움직임을 보장할 수 없었습니다. 회전 여유와 간섭을 초기 모델에서 더 자세히 살피지 못했습니다.',
    nextStep: '다음 가이드 설계에서는 삽입, 회전, 분리 자세를 나눠 간섭을 확인하고 반복 시험 조건을 먼저 정하겠습니다.',
    gallery: [{ src: 'assets/projects/process-automation.png', alt: '경로와 작업물 접근 조건을 검토한 자동화 대상 로봇', caption: '공정 자동화 대상 로봇', contributionIndex: 0 }],
    links: [],
  },
  {
    slug: 'ros2-control-ui',
    title: 'ROS2 고하중 로봇 제어 UI',
    period: '2025.07',
    role: 'PyQt5 UI 구조 분석, ROS2 상태 연동, 버튼 활성 조건 수정',
    background: '로봇 전원과 연결 상태가 달라져도 화면에 이전 상태가 남으면 사용자가 조작 가능 여부를 오해할 수 있었습니다.',
    contributions: [
      { title: '수신 상태에 맞춘 표시와 조작 조건', body: '상태 구독과 명령 발행을 분리해 살피고 전원 및 초기화 조건에 따라 버튼을 활성화했습니다. 연결 변화 시 이전 완료 표시가 남는 로직을 수정했습니다.', proof: '그림 「로봇 상태 중심 제어 화면」: 상태 표시와 조작 버튼의 배치입니다. 전원 전환 전후의 변화는 별도 동작 시험으로 확인했습니다.' },
    ],
    cases: [
      {
        title: '전원 OFF 뒤에도 남는 초기화 완료 표시',
        before: '로봇 전원을 끄거나 초기화 중 연결이 끊긴 뒤에도 화면에 초기화 완료와 이전 진행률이 남아 있었습니다.',
        cause: '상태 정보가 없을 때 timer callback이 바로 반환하면서, 화면에 남아 있던 동기화 상태를 초기화하지 않았습니다.',
        action: '전원과 연결 상태가 바뀌면 초기화 표시를 재설정했습니다. 전원 OFF에서도 받을 수 있는 상태 정보는 계속 갱신했습니다.',
        after: '재시작과 전원 OFF, 비가동 연결 상태에서 잘못된 완료 표시가 사라지는 것을 확인해 화면과 상태를 맞췄습니다.',
      },
    ],
    outcome: '전원 및 연결 변화에 따른 잘못된 완료 표시를 수정하고, 실제 상태를 기준으로 조작 가능 조건을 정리했습니다.',
    reflection: '새 데이터가 없다는 이유로 화면을 유지하면 이전 상태를 현재 상태로 오해하게 됩니다. 정상 연결 외의 상태를 먼저 고려하지 못했습니다.',
    nextStep: '앞으로는 상태 수신 중단과 재연결, 장비 전환을 기본 테스트에 넣고 표시 초기값과 조작 차단 조건을 함께 확인하겠습니다.',
    gallery: [{ src: 'assets/projects/robot-ui.png', alt: '로봇 상태와 조작 버튼이 배치된 PyQt5 제어 화면', caption: '로봇 상태 중심 제어 화면', contributionIndex: 0 }],
    links: [],
  },
]

export const coreSkills = [
  { name: 'ROS2', level: '구현', evidence: '명령 중재와 안전 상태 전이를 노드로 구현하고 Motor Driver와 연결했습니다.', project: 'thing-robot-hand', icon: 'Network' },
  { name: 'Python', level: '구현', evidence: '센서 입력을 관측값으로 바꾸고 정책 출력을 전달하는 배포 노드를 작성했습니다.', project: 'hydraulic-robot-rl', icon: 'Code2' },
  { name: 'Isaac Lab', level: '구현', evidence: '관측값과 행동, 보상 항목을 구성하고 PPO 학습 결과를 비교했습니다.', project: 'hydraulic-robot-rl', icon: 'Boxes' },
  { name: 'PyTorch', level: '활용', evidence: '기존 학습 라이브러리로 정책을 학습하고 추론을 실행했습니다.', project: 'hydraulic-robot-rl', icon: 'BrainCircuit' },
  { name: 'RTAB-Map', level: '활용', evidence: 'RealSense RGB-D 입력과 원격 RViz 지도 시각화 흐름을 연결했습니다.', project: 'go1-remote-inspection', icon: 'Map' },
  { name: 'YOLOv10', level: '활용', evidence: '기존 모델의 추론을 ROS 이미지 입력과 탐지 결과 발행 파이프라인에 연결했습니다.', project: 'go1-remote-inspection', icon: 'ScanEye' },
  { name: 'PyQt5', level: '구현', evidence: '로봇 상태에 따른 화면 갱신과 버튼 활성 조건을 수정했습니다.', project: 'ros2-control-ui', icon: 'PanelsTopLeft' },
]

export const supportSkills = ['Git', 'Jira', 'Linux', 'Docker', 'W&B', 'TensorBoard', 'SolidWorks', 'MoveIt', 'Django', 'Vue']
