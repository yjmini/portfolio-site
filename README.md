# 윤정민 · Robot Software Engineer Portfolio

로봇 소프트웨어, 강화학습, 시뮬레이션, 비전·센서 통합 경험을 보여 주는 공개 포트폴리오 사이트입니다.

- Content: 윤정민의 실제 프로젝트·경력·공개 GitHub 저장소
- Deployment target: GitHub Pages
- Privacy: 공개본에는 전화번호와 상세 주소를 포함하지 않음

## 주요 페이지

- **Home** — 포지셔닝, 대표 작업, 현재 활동
- **Projects** — 연구/로봇/비전/웹/AI 프로젝트 12개
- **Project detail** — 문제, 결정, 결과, 담당 범위, 기술 스택
- **Work** — KAERI, SSAFY, 졸업 프로젝트, 교육/수상/자격
- **About** — 작업 방식과 기술 도구
- **Résumé** — 공개용 A4 1페이지 PDF 다운로드/미리보기
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
