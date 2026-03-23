// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="ja" data-scroll-behavior="smooth">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
