# 윤정민 · Robot Software Engineer Portfolio

로봇 소프트웨어, 강화학습, 시뮬레이션, 비전·센서 통합 경험을 보여 주는 공개 포트폴리오 사이트입니다.

- Content: 윤정민의 실제 프로젝트·경력·공개 GitHub 저장소
- Deployment target: GitHub Pages
- Privacy: 공개본에는 전화번호와 상세 주소를 포함하지 않음

## 주요 페이지

- **Home** — 포지셔닝, 대표 작업, 현재 활동
- **Projects** — 연구/로봇/비전/웹/AI 프로젝트 13개
- **Project detail** — 문제, 결정, 결과, 담당 범위, 기술 스택
- **Work** — KAERI, SSAFY, 졸업 프로젝트, 교육/수상/자격
- **About** — 작업 방식과 기술 도구
- **Résumé** — 공개용 A4 1페이지 PDF 다운로드/미리보기
- **PDF Portfolio** — A4 10페이지 제출용 포트폴리오 미리보기/즉시 인쇄
- **Contact** — 입력 검증 후 로컬 메일 앱으로 연결

## 기술 구성

- React 19 + Vite 6
- Geist / Geist Mono / Hanken Grotesk variable fonts
- Lucide icons
- Hash routing (`#/projects`) — GitHub Pages에서 별도 rewrite 없이 동작
- IntersectionObserver reveal + 1.2초 표시 fallback
- Command palette (Search / Ctrl+K)
- Custom cursor on fine pointers
- Reduced-motion, focus, skip-link, ARIA 지원

## 로컬 실행

```bash
npm install
npm run dev
```

기본 개발 주소: `http://localhost:5173`

## 검증

```bash
npm run lint
npm run build
npm run preview
```

현재 검증 결과:

- ESLint 통과
- Vite production build 통과
- 데스크톱 1280×720 확인
- 모바일 390×844 확인
- 홈/Projects/Project detail/Contact route 확인
- Command palette 필터/이동 확인
- 폼 오류 표시 및 첫 오류 필드 focus 확인
- 공개 이력서 A4 1페이지 생성 확인
- 제출용 포트폴리오 A4 10페이지, 페이지별 강제 분리와 인쇄 툴바 확인

## 제출용 포트폴리오 인쇄

사이트의 `Résumé → 제출용 포트폴리오` 또는 아래 hash route에서 열 수 있습니다.

```text
#/portfolio-pdf
```

오른쪽 위 **PDF로 인쇄** 버튼을 누른 뒤 다음 설정을 사용합니다.

- 용지: A4
- 여백: 없음
- 배율: 100%
- 배경 그래픽: 켜기

화면용 인쇄 툴바는 PDF 출력에서 자동으로 제외됩니다. 각 `.portfolio-sheet`는 `210mm × 297mm`로 고정되고 `@page { size: A4; margin: 0; }`과 강제 page break를 사용합니다.

## GitHub Pages 배포

1. GitHub에서 빈 저장소를 만듭니다. 권장 이름: `portfolio-site`
2. 이 폴더에서 remote를 연결하고 push합니다.

```bash
git remote add origin https://github.com/yjmini/portfolio-site.git
git push -u origin main
```

3. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. `.github/workflows/deploy.yml`이 `main` push마다 빌드 후 Pages에 배포합니다.

Hash routing을 사용하므로 프로젝트 저장소 Pages 주소(`https://yjmini.github.io/portfolio-site/`)에서도 새로고침 404가 발생하지 않습니다.

## Kinetic Playground — 인터랙티브 포트폴리오

- **Full-screen hero**: 대형 타이포와 GPU 입자 조형. 포인터 위치에서 다른 타이포가 드러나고, 입자는 밀려나며 클릭하면 충격파가 전파됩니다.
- **Orbit / Wave / Grid**: 실제 입자 형태 전환. 모션을 꺼도 정적인 형태 선택은 가능합니다.
- **Scroll choreography**: 화면이 고정된 동안 제목·입자·카메라가 함께 전환됩니다. 기본 브라우저 스크롤을 사용하며 스크롤을 강제 가로채지 않습니다.
- **Selected work**: 실제 프로젝트 자료를 큰 카드로 표시하며, 드래그·스와이프·좌우 버튼·방향키·Home/End로 탐색합니다.
- **Playground**: 기술 키워드를 직접 드래그하거나 방향키로 이동하고 초기화할 수 있습니다.
- **Contact**: 포인터를 따라가는 눈, 자석 링크, 이메일 복사.
- **Accessibility/performance**: 모션 끄기, OS reduced-motion, 키보드 대안, 화면 밖 렌더링 정지, WebGL 실패 대체 화면 및 비활성 컨트롤, route 이탈 시 GPU context 해제.
- 조형은 인터랙티브 시각 디자인이며 실제 로봇 CAD·실시간 하드웨어 데이터가 아닙니다.
- 원본 프로젝트 데이터·상세 경로·이력서·10페이지 인쇄 소스는 유지합니다.

### 구현 파일

- `src/kinetic/ImmersiveHome.jsx`, `immersive-home.css`: 페이지 구성, Anime.js 타이포, Motion 스크롤/드래그/자석 효과
- `src/kinetic/ParticleStage.jsx`, `particleStage.js`, `particle-stage.css`: 지연 로드하는 Three.js 입자 조형
- `src/kinetic/KineticProjects.jsx`, `kinetic-projects.css`: 가로 드래그 프로젝트 갤러리
- `src/InteractiveHome.jsx`의 ProjectsExplorer: 전체 프로젝트 검색·분야 필터
- 이전 RobotLab 및 관련 검증 스크립트는 보존되어 있지만 현재 홈에서는 사용하지 않습니다.

### 참고 자료와 비용

- MotionSites의 **Pricing → Free**에서 `Interactive Discovery`, `3D Portfolio`의 인터랙션 방향을 확인했습니다. 외부 프로젝트 이미지나 유료 템플릿을 복사하지 않았습니다.
- [Motion](https://motion.dev/) 14 및 [Anime.js](https://animejs.com/) 4 기본 라이브러리는 MIT. 라이선스 원문은 `public/assets/interactive/`와 Copyright 페이지에서 제공합니다.
- [OriginKit](https://www.originkit.dev/)은 무료/유료 혼합이며 자체 라이선스입니다. 무료 인터랙션 방향만 조사했고, 다운로드·소스 재사용은 하지 않았습니다.

### 브라우저 회귀 검사

```bash
npm ci
npx playwright install chromium
npm run dev -- --host 127.0.0.1 --port 4187 --strictPort
# 별도 터미널
npm run test:browser
```

실제 배포 하위 경로를 검사할 때:

```bash
PORTFOLIO_URL=http://127.0.0.1:4188/portfolio-site/ npm run test:browser
```

`verify-kinetic.mjs`, `verify-kinetic-interactions.mjs`, `verify-kinetic-failures.mjs`가 실제 화면 변화, sticky 위치, 마우스 드래그, 모바일 터치, 키보드, clipboard, reduced-motion, WebGL 실패/해제, 기존 경로와 접근성을 검사합니다. 캡처·보고서 기본 경로는 `/tmp/portfolio-kinetic-qa/`, 변경은 `QA_OUTPUT`입니다.

## 콘텐츠 수정

프로젝트·경력·기술 데이터는 `src/data.js`에 모여 있습니다.

- 새 프로젝트: `projects` 배열에 항목 추가
- 대표 프로젝트: `featured: true`
- GitHub 링크: `links` 배열
- 경력: `experience` 배열
- 기술: `toolGroups` 배열

이미지는 `public/assets/`에 저장합니다. 프로젝트 이미지는 16:10 프레임에서 표시됩니다.

## 공개 이력서 갱신

원본 HTML:

```text
public/resume/resume-public.html
```

Chrome으로 PDF를 다시 생성하는 예:

```bash
google-chrome --headless --no-sandbox \
  --print-to-pdf=public/resume/yoon-jeongmin-resume-public.pdf \
  --no-pdf-header-footer \
  file://$PWD/public/resume/resume-public.html
```
