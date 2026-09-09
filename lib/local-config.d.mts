export function getConfig(env?: Record<string, string | undefined>): {
  sitePort: number;
  targetPort: number;
  siteOrigin: string;
  targetOrigin: string;
  eventUrl: string;
};
