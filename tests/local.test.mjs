import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { getConfig } from '../lib/local-config.mjs';
import { createTargetServer } from '../lib/target-server.mjs';

test('event destination has a different origin and both ports are configurable', () => {
  const config = getConfig({ SITE_PORT: '4310', TARGET_PORT: '4311' });
  assert.equal(config.siteOrigin, 'http://127.0.0.1:4310');
  assert.equal(config.eventUrl, 'http://127.0.0.1:4311/event');
  assert.notEqual(new URL(config.eventUrl).origin, config.siteOrigin);
  for (const value of ['0', '-1', '65536', 'hello', '4173.5', '']) {
    assert.throws(() => getConfig({ TARGET_PORT: value }));
  }
  assert.throws(() => getConfig({ SITE_PORT: '4173', TARGET_PORT: '4173' }));
});

test('mock destination serves the landing page, accepts no submissions, and handles HEAD/404', async (t) => {
  const server = createTargetServer(getConfig({}));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const landing = await fetch(`${origin}/event`);
  assert.equal(landing.status, 200);
  assert.equal(
    landing.headers.get('x-browserguard-test-fixture'),
    'simulated-malicious',
  );
  assert.match(await landing.text(), /mock-malicious-page/);
  const post = await fetch(`${origin}/event`, {
    method: 'POST',
    body: 'synthetic=test',
  });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
  assert.equal((await fetch(`${origin}/missing`)).status, 404);
  assert.deepEqual(await (await fetch(`${origin}/health`)).json(), {
    status: 'ok',
    fixture: 'simulated-malicious',
  });
  assert.equal(
    await (await fetch(`${origin}/event`, { method: 'HEAD' })).text(),
    '',
  );
});
