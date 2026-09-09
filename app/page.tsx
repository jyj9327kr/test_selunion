import HomePage from './home-page';
import { getConfig } from '../lib/local-config.mjs';
export default function Home() {
  return <HomePage eventUrl={getConfig().eventUrl} />;
}
