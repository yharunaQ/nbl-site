# Axiom Next NBL Public Candidate Visual Direction v0

Date: 2026-06-24  
Lane: Falcon Lab / Axiom delivery-layer visual design pass  
Status: internal candidate visual direction, not public approval

## Goal

次期NBLサイト公開候補の全体印象を、初期の内部レビュー画面由来の仮置きCSSから、公開に耐える編集プロダクトの見え方へ寄せる。

このパスは本文やAxiom知識内容を変えない。9ページ全体の背景、ナビ、カード、Hero、ボタン、色、影、余白の印象を整える。

## Design Judgment

現行の `slate / teal / cream` は信頼感がある一方で、内部管理画面・研究メモ・説明資料の印象が残りやすい。

次期NBLの公開候補としては、次の方向に寄せる。

- public trust: 公共性と信頼感がある。
- warm intelligence: 冷たい専門家ではなく、人間の働きづらさを受け止める温度がある。
- AI-native but not sci-fi: AIらしさを出しすぎず、複雑な関係を読める新しい専門性として見せる。
- image-first support: Image-2.0図解が主役になり、HTML/CSSは図解を邪魔しない。
- editorial product: 教科書や内部資料ではなく、記事・ガイド・素材棚を持つ上質な編集プロダクトとして見える。

## Implemented Visual System

The public-candidate shell now carries the `axiom-public-candidate` class.

Global CSS under `styles/globals.css` defines:

- warm off-white base with subtle jade, coral, and blue atmosphere;
- darker but softer internal-candidate bar;
- glass-like sticky header with pill navigation;
- refined card/figure borders and shadows;
- restrained button treatment;
- shared color variables for ink, muted text, paper, jade, blue, coral, and line color;
- headline text balancing and Japanese-friendly font stack.

## Why This Is Now

Beta 2 concluded that the site is no longer in broad construction. The remaining work is public-candidate QA and final polish. That makes this the right timing for a professional visual pass: late enough that page roles are stable, early enough that screenshots, image alignment, and final review can still use the improved visual frame.

## Not Now

- no public approval
- no publication execution
- no actual public navigation change
- no runtime / model / provider / DB / schema movement
- no source/support validity decision
- no individual consultation or case judgment
- no learning update
