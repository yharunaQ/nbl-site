// pages/_app.tsx
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { Noto_Sans_JP } from 'next/font/google';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlayerProvider } from '@/components/songs/PlayerProvider';
import MiniPlayer from '@/components/songs/MiniPlayer';

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

function scrollToDocumentTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
}

function findHashTarget(hash: string) {
  const decodedHash = decodeURIComponent(hash);

  return (
    document.getElementById(decodedHash) ??
    (document.getElementsByName(decodedHash)[0] as HTMLElement | undefined) ??
    null
  );
}

function applyRouteScroll(url: string) {
  const hashIndex = url.indexOf('#');
  const hash = hashIndex >= 0 ? url.slice(hashIndex + 1) : '';

  if (hash) {
    findHashTarget(hash)?.scrollIntoView({ block: 'start' });
    return;
  }

  scrollToDocumentTop();
}

function RouteScrollRestoration() {
  const router = useRouter();

  useEffect(() => {
    const events = router.events;

    if (!events?.on || !events?.off || typeof window === 'undefined') {
      return undefined;
    }

    const originalScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const handleRouteChangeComplete = (url: string) => {
      applyRouteScroll(url);
      window.requestAnimationFrame(() => applyRouteScroll(url));
    };

    events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      events.off('routeChangeComplete', handleRouteChangeComplete);
      window.history.scrollRestoration = originalScrollRestoration;
    };
  }, [router.events]);

  return null;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <main className={noto.className}>
        <RouteScrollRestoration />
        <Component {...pageProps} />
        <MiniPlayer />
      </main>
    </PlayerProvider>
  );
}
