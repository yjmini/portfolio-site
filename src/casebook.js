import field from './casebook/field.js'
import robotics from './casebook/robotics.js'
import perception from './casebook/perception.js'
import software from './casebook/software.js'
export const cases = {...field,...robotics,...perception,...software}
// Keep the historical project and the scoped replay distinct in the introduction.
const introductions = {
 'thing-robot-hand':'팀은 카메라에서 얻은 손 관절점 21개를 텐던 로봇 손의 7축 명령으로 바꿔 사람 손을 따라 움직이게 했습니다. 제어 쪽에서 맡은 일은 손가락을 움직이기 전에 명령을 보낸 주체와 시각을 확인하는 것이었습니다. SSAFY 공통프로젝트에서 팀 우수상(1등)을 받았습니다.',
 'hydraulic-robot-rl':'Isaac Lab에서 유압식 고하중 로봇의 전진 정책을 학습했습니다. 쉽게 넘어지지 않는 것과 원하는 방향으로 나아가는 것은 달랐습니다. 보상 설계와 자세를 살피고 실제 장비로 옮기기 전에 확인해야 할 명령 범위와 제어 주기를 정리했습니다.',
 'smart-assembly-transport':'음성 주문을 받으면 컨베이어가 부품을 옮기고 로봇팔이 조립한 뒤 이동 로봇이 배송하는 팀 프로젝트입니다. 장치마다 속도가 달라, 다음 단계로 넘어가도 되는지 한곳에서 판단하도록 공정 상태를 관리했습니다.',
 'go1-remote-inspection':'사람이 들어가기 어려운 곳을 사족 로봇으로 점검하는 졸업작품입니다. 현장의 RGB-D 카메라 영상과 3D 지도를 관제 화면에서 함께 보도록 연결했습니다. 팀은 졸업연구작품 우수상과 AI Festa 경진대회 우수상을 받았습니다.',
 'ros2-control-ui':'고하중 로봇의 운전자가 상태를 보고 명령을 보내는 ROS2 제어 화면을 다뤘습니다. 버튼을 눌렀다는 사실과 장비가 실제로 새 상태를 보내 왔다는 사실을 구분하는 것이 중요했습니다.',
}
for(const [slug,text] of Object.entries(introductions)) cases[slug]={...cases[slug],overview:text}
export const shortDescriptions = {
 'langchain-todo':'채팅 답변은 로컬 모델이, 할 일 변경은 브라우저가 처리하는 앱', 'langgraph-cuso':'사용자 질문과 타이머 종료 알림을 다른 경로로 처리하는 조리 도우미', 'yolo-head-tracking':'머리 상자와 코 키포인트로 화면 안의 얼굴 방향 표시', 'hazardous-process-automation':'실험실 로봇의 작업 계획과 실제 환경 조건 비교', 'robot-study':'Xacro 모델 전개부터 관절 구조 확인까지의 로봇 실습 기록',
}
export const caseCover = slug => slug === 'thing-robot-hand' ? {image:'assets/projects/thing/integrated-robot-hand.webp',alt:'실험대 위에 세운 THING 로봇 손'} : cases[slug]
