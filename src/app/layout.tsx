import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AlgoLens — Deconstruct LeetCode Problems',
  description:
    'Paste a LeetCode problem and get a structured blueprint: core pattern, step-by-step strategy, time/space complexity, and edge cases. A strategic study tool, not a code solver.',
  keywords: [
    'LeetCode',
    'algorithm',
    'data structures',
    'study tool',
    'coding interview',
    'problem solving',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
