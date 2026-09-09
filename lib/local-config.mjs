export function getConfig(env = process.env) {
  const port = (key, fallback) => {
    const value = Number(env[key] ?? fallback);
    if (!Number.isInteger(value) || value < 1024 || value > 65535)
      throw new Error(`${key} must be an integer between 1024 and 65535.`);
    return value;
  };
  const sitePort = port('SITE_PORT', 4173);
  const targetPort = port('TARGET_PORT', 4174);
  if (sitePort === targetPort)
    throw new Error('SITE_PORT and TARGET_PORT must be different.');
  const siteOrigin = `http://127.0.0.1:${sitePort}`;
  const targetOrigin = `http://127.0.0.1:${targetPort}`;
  return {
    sitePort,
    targetPort,
    siteOrigin,
    targetOrigin,
    eventUrl: `${targetOrigin}/event`,
  };
}
