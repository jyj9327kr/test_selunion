import { createServer } from 'node:http';

export function createTargetServer(config) {
  const page = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>모의 악성 사이트 · 로컬 테스트</title><style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f5f5fb;color:#222;font:16px/1.7 system-ui,sans-serif}main{max-width:640px;width:100%;padding:40px;background:white;border:1px solid #ddd;border-top:5px solid #b72c3a}small{color:#b72c3a;font-weight:700}h1{font-size:28px;line-height:1.4;margin:12px 0 20px}p{color:#555}code{overflow-wrap:anywhere}a{display:inline-block;background:#242f73;color:white;text-decoration:none;padding:12px 22px;margin-top:20px;border-radius:4px}a:focus-visible{outline:3px solid #3676e8;outline-offset:4px}
  </style></head><body><main data-testid="mock-malicious-page"><small>BrowserGuard · LOCAL TEST</small><h1>모의 악성 사이트에 도착했습니다.</h1><p>SELU 재현 페이지의 이벤트 링크로 다른 출처(origin)에 이동한 상태입니다. 링크 차단 및 경고 동작을 확인하는 테스트용 페이지입니다.</p><p>현재 테스트 출처<br><code>${config.targetOrigin}</code></p><p>이 페이지는 악성 코드 실행이나 개인정보 수집 기능을 포함하지 않습니다.</p><a href="${config.siteOrigin}">메인 페이지로 돌아가기</a></main></body></html>`;
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
