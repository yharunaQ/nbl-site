// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { Noto_Sans_JP } from 'next/font/google';
import { PlayerProvider } from '@/components/songs/PlayerProvider';
import MiniPlayer from '@/components/songs/MiniPlayer';

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400','500','700'],
  display: 'swap'
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <main className={noto.className}>
        <Component {...pageProps} />
        <MiniPlayer />
      </main>
    </PlayerProvider>
  );
}