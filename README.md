# SELU 로컬 테스트 사이트

[selunion.co.kr](https://selunion.co.kr/)의 메인 화면을 재현한 BrowserGuard 테스트 픽스처입니다. 원본 로고, PC/모바일 배너 5종, 게시판 6개, 푸터를 2026-09-09 기준으로 담았습니다. 이미지와 한국어 폰트는 저장소에 포함되어 실행 시 원본 사이트나 CDN을 호출하지 않습니다.

## 실행

Node.js 22.13 이상이 필요합니다. Node.js 24에서 검증했습니다.

```bash
npm ci
npm run dev
```

한 명령으로 두 서버가 실행됩니다.

| 용도             | 주소                        |
| ---------------- | --------------------------- |
| SELU 메인 화면   | http://127.0.0.1:4173/      |
| 모의 악성 사이트 | http://127.0.0.1:4174/event |

메인 화면의 **이벤트 바로가기**, 배너 이미지, 공지사항의 이벤트 항목은 모의 악성 사이트로 이동합니다. 일반 `<a href>`를 사용하므로 확장 프로그램이 이동 대상을 검사할 수 있습니다. 다른 메뉴와 게시판 항목은 외관만 재현했으며 로그인/회원가입은 구현하지 않았습니다.

`Ctrl+C`로 두 서버를 함께 종료합니다. 포트가 이미 사용 중이면 다른 포트로 자동 전환하지 않고 오류로 종료합니다.

빌드 결과로 실행하려면:

```bash
npm run build
npm start
```

## BrowserGuard 연결

모의 목적지는 실제 악성 코드를 실행하거나 입력 정보를 수집하지 않는 별도 origin입니다. 이 사이트를 실행하는 것만으로 BrowserGuard 정책이 변경되지는 않습니다.

링크 차단(GF-P01)을 테스트하려면 BrowserGuard 실행 설정의 `knownBlockedOrigins`에 다음 origin을 추가합니다.

```json
{
  "knownBlockedOrigins": ["http://127.0.0.1:4174"]
}
```

경고(GF-P08) 시나리오는 위 차단 목록에서 해당 origin을 빼고 `cautionOrigins`에 넣습니다. 차단 규칙이 경고 규칙보다 먼저 적용됩니다. 설정값은 URL 경로 `/event`를 제외한 origin이며 `localhost`와 `127.0.0.1`은 다른 origin입니다.

메인 페이지를 열고 이벤트 버튼을 누릅니다. 정책이 적용되면 BrowserGuard가 이동을 차단하거나 경고해야 합니다. 정책을 적용하지 않았다면 목적지에 도착했다는 안내가 표시됩니다. 기존 HiSecurityThanks 프로젝트 코드는 수정하지 않습니다.

## 포트 변경

기존 프로젝트의 8081–8084 포트와 충돌하지 않도록 기본 포트를 4173/4174로 분리했습니다.

Bash / WSL:

```bash
SITE_PORT=4310 TARGET_PORT=4311 npm run dev
```

PowerShell:

```powershell
$env:SITE_PORT = '4310'
$env:TARGET_PORT = '4311'
npm run dev
```

변경 시 BrowserGuard 정책의 목적지 origin도 동일하게 바꿉니다. 두 서버는 `127.0.0.1`에만 바인딩됩니다. Docker/격리 브라우저 내부의 loopback은 호스트와 다르므로 이 기본 설정으로는 컨테이너에서 직접 접근할 수 없습니다.

## 검증

```bash
npm test
npm run typecheck
npm run lint
npm run build
# npm run dev 또는 npm start가 실행 중인 별도 터미널에서:
npm run test:smoke
```

`npm test`는 포트 설정, origin 분리, 모의 페이지 응답, POST 거부, HEAD/404 처리를 검사합니다. `test:smoke`는 실행 중인 메인 화면의 이벤트 링크, 목적지 응답, 로컬 자산 응답을 확인합니다. 브라우저의 실제 클릭/확장 프로그램 차단 결과는 BrowserGuard를 실행해 확인해야 합니다.

## 구조

- `app/home-page.tsx`: 메인 화면, 배너 전환, 이벤트 링크
- `app/globals.css`: 원본의 레이아웃, 폰트, 반응형 스타일
- `app/boards.json`: 캡처 시점의 게시판 제목과 날짜
- `lib/local-config.mjs`: 포트와 origin 설정
- `lib/target-server.mjs`: 모의 악성 목적지
- `scripts/run-local.mjs`: 두 서버 시작/종료
- `public/assets/`: 원본 이미지와 로컬 폰트
- `ASSET_SOURCES.json`: 이미지 및 폰트의 출처

Sites/Vinext의 React 스타터로 구성했습니다. 호스팅 등록이나 배포는 하지 않으며, `.openai/hosting.json`에는 스타터의 빈 바인딩만 있습니다. `components/ui/`, `hooks/use-mobile.ts`는 수정하지 않은 스타터 코드로, 프로젝트 lint 대상에서 제외합니다.

이 저장소는 로컬 보안 테스트용이며 SELU 공식 사이트가 아닙니다. 로고·배너·게시물의 권리는 원 권리자에게 있습니다. Noto Sans KR은 `public/assets/NotoSansKR-OFL.txt`의 SIL Open Font License를 따릅니다.
