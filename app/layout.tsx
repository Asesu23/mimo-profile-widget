import type { Metadata } from 'next';
import '@app/styles/globals.css';

export const metadata: Metadata = {
  title: 'Mimo Profile Widget',
  description: 'Generate a live SVG widget of your Mimo streak, coins and XP for your GitHub README.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
