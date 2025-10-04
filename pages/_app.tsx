// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { Noto_Sans_JP } from 'next/font/google';

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400','500','700'],
  display: 'swap'
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={noto.className}>
      <Component {...pageProps} />
    </main>
  );
}