import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '삼성그룹 초기업 노동조합 삼성전자 지부 · 로컬 테스트',
  description: 'BrowserGuard 링크 이동 테스트를 위한 SELU 홈페이지 재현.',
  robots: { index: false, follow: false },
  icons: { icon: '/assets/selu_fvi.png' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
