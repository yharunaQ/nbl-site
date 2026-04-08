# 次期公開版 スナップショット

作成日: 2026-04-07
ステータス: プレフライト通過・公開判断待ち（創業者ゲート）

---

## 次期公開版で公開されるルート

### コア機能

| ルート | 内容 | 状態 |
|---|---|---|
| `/jac` | はたらく相談室トップ（説明・使い方・入口） | 実装済み |
| `/jac/next` | はたらく相談室 AI対話（メイン機能） | 実装済み・最新 |
| `/guide` | 27フレーム仕事設計ガイドブック トップ | 実装済み |
| `/guide/[frame-id]` | 各フレーム個別ページ（27枚） | 実装済み |
| `/guide/download` | PDF/HTMLダウンロード | 実装済み |

### 知識セクション

| ルート | 内容 | 状態 |
|---|---|---|
| `/knowledge` | 実践知識 トップ | 実装済み |
| `/knowledge/evidence` | 71.9%問題・地域最大6倍格差エビデンス | 実装済み |
| `/knowledge/practice` | Q1/Q2の違い・実践知識の積み方 | 実装済み |
| `/knowledge/network` | 地域連携ナビ（機関ネットワーク×転換率） | 実装済み |

### 組織セクション

| ルート | 内容 | 状態 |
|---|---|---|
| `/organizations` | 職場・組織設計 トップ | 実装済み |
| `/organizations/design` | IPS/SE 8原則の日本データ再検証 | 実装済み |
| `/organizations/diagnosis` | 組織診断ツール | 準備中（近日公開予定） |

### NBLについて

| ルート | 内容 | 状態 |
|---|---|---|
| `/about` | NBLについて | 実装済み |
| `/about/knowledge-base` | 知識ネットワークの構造 | 実装済み |
| `/about/data` | データ基盤・調査概要 | 実装済み |

### 既存継続ページ（旧公開版から継続）

| ルート | 内容 |
|---|---|
| `/` | ホームページ（4スタット版） |
| `/what-we-do` | What We Do |
| `/for-enterprise` | 企業向け |
| `/jac-foundations` | 仕事設計の見取り図（旧世代） |
| `/contact` | お問い合わせ |
| `/resources` | リソース |
| `/videos` | 動画 |
| `/operating-model` | Operating Model |

---

## 次期版の主要変更点（旧公開版からの差分）

### 新規追加
- `/jac/next` — はたらく相談室 AI対話（FCHMAアセスメント）
- `/jac` — はたらく相談室トップ
- `/guide/*` — 27フレームガイドブック Web版
- `/knowledge/*` — 実践知識セクション（3ページ）
- `/organizations/*` — 職場・組織設計セクション
- `/about/knowledge-base`, `/about/data` — Aboutサブページ
- `SiteNav` — 新ナビゲーション（相談する・フレームを使う・実践知識を学ぶ・職場・組織を変える）

### 更新
- `/about` — 旧複合ページ（Founder Profile・複数セクション）→ シンプル知識プラットフォーム説明ページ
- `/jac/next` ナビバー追加（NBLロゴリンク・相談室トップリンク）

### 内部変更（UIには非表示）
- はたらく相談室の知識ベース: toku18内部用語除去・参照名を適切な日本語に統一
- AIシステムプロンプト: IPS/SE再検証・実践転換の羅針盤・ワークショップ実例知識・Q13ネットワークデータ注入
- 効果カタログ: GLM係数ベース → ロジスティック回帰（Δ・OR）ベースに更新
- KB説明文: `システムプロンプト経由` 等の技術用語を利用者向け表現に変更
- URL自動付与: 参照アイテムのキーワードマッチ拡充

---

## ボツ・アーカイブ（コードは保持、次期版では非使用）

### 旧ホームコンポーネント群

これらのコンポーネントはコードベースに残存するが、次期ホームページ（`pages/index.tsx`）では使用しない。
削除タイミングは旧公開版との完全切り替え確認後。

| ファイル | 内容 | 最後に使用したバージョン |
|---|---|---|
| `components/LegacyPublicHome.tsx` | 旧ホーム（2026-03以前の初期公開版） | 初期公開 |
| `components/RelaunchPublicHome.tsx` | 再公開版ホーム（2026-03再公開） | 2026-03 再公開 |
| `components/TemporaryPublicHome.tsx` | 暫定公開版ホーム | 2026-03 再公開 |
| `components/Campaign.tsx` | キャンペーン訴求セクション | 初期公開 |
| `components/Hero.tsx` | 旧ヒーローセクション | 初期公開 |
| `components/Services.tsx` | 旧サービス説明セクション | 初期公開 |
| `components/ProductJac.tsx` | 旧 JAC プロダクト説明 | 初期公開 |
| `components/Footer.tsx` | 旧フッター | 初期公開 |
| `components/MarketVision.tsx` | マーケットビジョン説明 | 初期公開 |
| `components/Phase1.tsx` | フェーズ1説明 | 初期公開 |
| `components/Reports.tsx` | レポートセクション | 初期公開 |
| `components/TrustStrip.tsx` | 信頼性バー | 初期公開 |
| `components/Vision.tsx` | ビジョンセクション | 初期公開 |
| `components/VisionRocket.tsx` | ビジョン（ロケット） | 初期公開 |

### 旧 About ページコンテンツ

旧 About ページ（Founder Profile・複数セクション・多数のreview/aboutコンテンツ）は、
`lib/content/aboutReview.ts`・`lib/content/founderProfile.ts` に内容が保持されている。

### 旧ホームテスト（`__tests__/home.test.tsx`）

旧テストは `RelaunchPublicHome` コンポーネントを対象としていたため、次期版に合わせて更新済み。
旧テスト内容（「就労支援の整理を、もっと速く、確かに。」等）は git 履歴に保持。

---

## プレフライト結果（2026-04-07）

- Typecheck: **passed**
- Focused tests: **passed**（home / contact / resources）
- Production build: **passed**
- Public surface safety: **passed**
- Contact links: **全ページ通過**
- 創業者ゲート: **未通過**（公開 yes/no の判断は創業者）

プレフライト詳細: `docs/nbl-workspace/ops/public-release-preflights/2026-04-07.md`

---

## 公開後の残タスク

- `/organizations/diagnosis` — 組織診断ツール実装（Layer C、Q14データに基づく5軸）
- 地域格差可視化コンポーネント（B8）
- ナビゲーション・リダイレクト整理（B9）
- `JAC_PUBLIC_ENABLED=true` 確認・デプロイ

---

## アーカイブ・参照先

| 項目 | 場所 |
|---|---|
| 旧公開版コンポーネント | `components/Legacy*.tsx`, `components/Relaunch*.tsx`, `components/Temporary*.tsx` 等 |
| 旧ホームコンテンツ | `lib/content/relaunchHome.ts`, `lib/content/relaunchPublicHome.ts` |
| 旧 About コンテンツ | `lib/content/aboutReview.ts`, `lib/content/founderProfile.ts` |
| コンテンツ草稿（レビュー待ち） | `content-review/next-release/` |
| 旧レビューページ群 | `pages/review/` （内部アクセスのみ） |
| 実装計画 | `docs/nbl-workspace/nbl-implementation-plan-2026-04-04.md` |
| 設計思想 | `docs/nbl-workspace/nbl-site-design-philosophy-2026-04-04.md` |
| v3設計文書 | `docs/nbl-workspace/nbl-next-site-design-v3-2026-04-04.md` |
