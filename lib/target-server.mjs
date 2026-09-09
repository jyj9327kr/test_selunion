import { createServer } from 'node:http';

export function createTargetServer(config) {
  const page = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#070000">
  <title>긴급 보안 경고 · 로컬 테스트</title>
  <style>
    :root{color-scheme:dark;font-family:"Pretendard","Noto Sans KR",system-ui,sans-serif}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;overflow:hidden;color:#fff;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.025) 4px),radial-gradient(circle at center,#3b0000 0,#0c0000 42%,#020000 82%)}
    main{position:relative;isolation:isolate;min-height:100vh;display:grid;place-items:center;padding:32px;text-align:center;animation:impact .3s both}
    main:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,transparent,rgba(255,0,0,.17),transparent);transform:translateX(-100%);animation:scan 2.3s linear infinite}
    .frame{position:fixed;inset:14px;border:3px solid #ff1d1d;box-shadow:inset 0 0 45px rgba(255,0,0,.35),0 0 35px rgba(255,0,0,.32);pointer-events:none}
    .panel{width:min(940px,100%)}
    .eyebrow{display:inline-flex;align-items:center;gap:9px;margin-bottom:18px;padding:7px 12px;border:1px solid #ff4a4a;color:#ff8989;font:800 .82rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em}
    .dot{width:9px;aspect-ratio:1;border-radius:50%;background:#ff1c1c;box-shadow:0 0 12px #ff1c1c;animation:blink .65s steps(1) infinite}
    .glitch{position:relative;margin:0;font-size:clamp(3rem,12vw,9rem);font-weight:1000;letter-spacing:-.08em;line-height:.9;text-shadow:0 0 12px #f00,0 0 46px rgba(255,0,0,.78);animation:shake .16s infinite alternate}
    .glitch:before,.glitch:after{content:attr(data-text);position:absolute;inset:0;pointer-events:none}
    .glitch:before{color:#ff0019;transform:translate(-4px,2px);clip-path:inset(18% 0 54%)}
    .glitch:after{color:#12eaff;transform:translate(4px,-2px);clip-path:inset(60% 0 13%);opacity:.7}
    .subhead{margin:22px auto 26px;max-width:680px;color:#ffc0c0;font-size:clamp(1rem,2.4vw,1.35rem);font-weight:750;line-height:1.55}
    .terminal{width:min(680px,100%);margin:0 auto;border:1px solid #701515;background:rgba(0,0,0,.72);padding:16px 18px;text-align:left;color:#ff6666;font:700 clamp(.75rem,2vw,.92rem)/1.8 ui-monospace,SFMono-Regular,Menlo,monospace;box-shadow:0 15px 40px rgba(0,0,0,.55)}
    .terminal span{display:block;opacity:0;animation:reveal .15s forwards}.terminal span:nth-child(2){animation-delay:.35s}.terminal span:nth-child(3){animation-delay:.7s}.terminal span:nth-child(4){animation-delay:1.05s}
    .origin{margin:14px auto 0;color:#b98787;font:600 .78rem/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}
    .simulation{margin:15px 0 0;color:#a88686;font-size:.8rem;letter-spacing:.06em}
    a{display:inline-block;margin-top:18px;padding:10px 18px;border:1px solid #944;color:#ffd0d0;text-decoration:none;font-weight:800;background:rgba(90,0,0,.35)}
    a:hover{background:rgba(160,0,0,.45)}a:focus-visible{outline:3px solid #fff;outline-offset:4px}
    @keyframes impact{from{filter:brightness(5);transform:scale(1.12)}to{filter:brightness(1);transform:scale(1)}}
    @keyframes scan{to{transform:translateX(100%)}}@keyframes blink{50%{opacity:.2}}@keyframes reveal{to{opacity:1}}@keyframes shake{from{transform:translate(-1px,1px)}to{transform:translate(1px,-1px)}}
    @media(prefers-reduced-motion:reduce){*,:before,:after{animation-duration:.01ms!important;animation-iteration-count:1!important}}
  </style>
</head>
<body>
  <main data-testid="mock-malicious-page">
    <div class="frame"></div>
    <div class="panel">
      <div class="eyebrow"><span class="dot"></span> CRITICAL SECURITY ALERT</div>
      <h1 class="glitch" data-text="해킹당했습니다">해킹당했습니다</h1>
      <p class="subhead">비정상적인 접근이 감지되었습니다.<br>현재 시스템 보안이 심각하게 위협받고 있습니다.</p>
      <div class="terminal" aria-label="가상 보안 경고 로그">
        <span>&gt; UNAUTHORIZED_ACCESS ........ DETECTED</span>
        <span>&gt; SECURITY_LAYER ............. COMPROMISED</span>
        <span>&gt; SESSION_STATUS .............. EXPOSED</span>
        <span>&gt; THREAT_LEVEL ................ CRITICAL</span>
      </div>
      <p class="origin">TEST ORIGIN · ${config.targetOrigin}</p>
      <p class="simulation">BROWSERGUARD LOCAL TEST · 실제 해킹이나 정보 전송은 발생하지 않았습니다.</p>
      <a href="${config.siteOrigin}">메인 페이지로 돌아가기</a>
    </div>
  </main>
</body>
</html>`;
  return createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    );
    response.setHeader('X-BrowserGuard-Test-Fixture', 'simulated-malicious');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }
    const path = new URL(request.url, config.targetOrigin).pathname;
    if (path === '/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        request.method === 'HEAD'
          ? undefined
          : JSON.stringify({ status: 'ok', fixture: 'simulated-malicious' }),
      );
    } else if (path === '/' || path === '/event') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : page);
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : 'Not found');
    }
  });
}
