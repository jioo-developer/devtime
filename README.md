# Dev Time 2

개발 시간 기록·관리 웹 애플리케이션입니다. 타이머, 대시보드, 랭킹, 마이페이지 등 기능을 제공합니다.

## 스크린샷

**타이머 (홈)**

![타이머 화면](./docs/screenshots/timer.png)

**회원가입**

![회원가입 화면](./docs/screenshots/signup.png)

## 기술 스택

| 구분             | 기술                                  |
| ---------------- | ------------------------------------- |
| **프레임워크**   | Next.js 14 (App Router)               |
| **언어**         | TypeScript                            |
| **상태 관리**    | Zustand, TanStack React Query         |
| **폼**           | React Hook Form                       |
| **HTTP**         | Axios                                 |
| **스타일**       | CSS Modules, clsx                     |
| **테스트**       | Vitest (단위·스토리북), Cypress (E2E) |
| **문서/UI 개발** | Storybook                             |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── Home/               # 홈·타이머
│   ├── dashboard/          # 대시보드 (통계, 히트맵, 기록)
│   ├── ranking/            # 랭킹
│   ├── mypage/             # 마이페이지
│   ├── profile/            # 프로필 생성
│   ├── login/              # 로그인
│   └── auth/               # 인증 콜백 등
├── components/             # 공통 컴포넌트
│   ├── atoms/              # 기본 UI (CommonInput, CommonModal 등)
│   └── modules/            # 복합 컴포넌트 (Header, TodoList, CommonTable 등)
├── config/                 # API 설정, 인증 유틸
├── constant/               # 쿼리 키, 상수
├── store/                  # Zustand 스토어 (타이머, 모달)
├── types/                  # API 타입 (OpenAPI 생성 포함)
├── utils/                  # 공통 유틸
└── provider/               # React Query 등 프로바이더
```

## 스크립트

| 명령어                    | 설명                                           |
| ------------------------- | ---------------------------------------------- |
| `npm run dev`             | 개발 서버 실행                                 |
| `npm run build`           | 프로덕션 빌드                                  |
| `npm start`               | 빌드된 앱 실행                                 |
| `npm run lint`            | ESLint 실행                                    |
| `npm run test`            | Vitest 워치 모드 (단위 + 스토리북 테스트)      |
| `npm run cypress:open`    | Cypress IDE 실행                               |
| `npm run cypress:run`     | Cypress E2E 헤드리스 실행                      |
| `npm run e2e`             | 3000 포트 정리 후 dev 서버 띄우고 Cypress 실행 |
| `npm run storybook`       | Storybook 개발 서버 (포트 6006)                |
| `npm run build-storybook` | Storybook 정적 빌드                            |
| `npm run generate:types`  | OpenAPI 스펙으로 API 타입 생성                 |

## 테스트

- **단위/컴포넌트**: Vitest + Testing Library (`src/**/*.test.{ts,tsx}`)
- **스토리북**: Vitest 브라우저 모드 + `@vitest/browser-preview` (Chromium)
- **E2E**: Cypress (`npm run e2e`)

API 타입은 `generate:types`로 백엔드 OpenAPI 문서(`https://devtime.prokit.app/docs/json`)에서 생성하며, 결과는 `src/types/api/generated.ts`에 저장됩니다.

## 코드 품질

- **Husky**로 커밋 전 훅 실행
- **lint-staged**로 스테이징된 `.js`, `.ts`, `.tsx`에 대해 ESLint + Prettier 자동 실행
