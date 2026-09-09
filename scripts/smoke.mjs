import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getConfig } from '../lib/local-config.mjs';

const config = getConfig();
const response = await fetch(config.siteOrigin, {
  signal: AbortSignal.timeout(30000),
});
assert.equal(response.status, 200, 'Main page must respond successfully.');
const html = await response.text();
const eventAnchor = html.match(/<a\b[^>]*data-testid="event-link"[^>]*>/)?.[0];
assert.ok(eventAnchor, 'Event anchor must appear in server-rendered HTML.');
assert.ok(
  eventAnchor.includes(`href="${config.eventUrl}"`),
  'Event href must point to the mock origin.',
);
assert.ok(
  html.includes('53,270') &&
    html.includes('공지사항') &&
    html.includes('이벤트 바로가기'),
);
assert.equal(
  new URL(eventAnchor.match(/href="([^"]+)"/)[1]).origin,
  config.targetOrigin,
);
const target = await fetch(config.eventUrl);
assert.equal(target.status, 200);
assert.match(await target.text(), /mock-malicious-page/);
const manifest = JSON.parse(
  (
    await readFile(new URL('../ASSET_SOURCES.json', import.meta.url), 'utf8')
  ).replace(/^\uFEFF/, ''),
);
await Promise.all(
  manifest.assets.map(async ({ file, bytes }) => {
    const asset = await fetch(`${config.siteOrigin}/assets/${file}`);
    assert.equal(asset.status, 200, `${file} must load.`);
    assert.equal(
      (await asset.arrayBuffer()).byteLength,
      bytes,
      `${file} must match the bundled asset.`,
    );
  }),
);
const resourceUrls = [
  ...html.matchAll(
    /<(?:img|script|source|link)\b[^>]*(?:src|srcset|href)="([^"]+)"/g,
  ),
].map((match) => match[1]);
for (const url of resourceUrls)
  assert.equal(
    new URL(url, config.siteOrigin).origin,
    config.siteOrigin,
    `Resource must be local: ${url}`,
  );
console.log(
  `Smoke check passed: homepage → ${config.eventUrl}; ${manifest.assets.length} local assets verified.`,
);
