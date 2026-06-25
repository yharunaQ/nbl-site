// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="ja" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f3d36" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
