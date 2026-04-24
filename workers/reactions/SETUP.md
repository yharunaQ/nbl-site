# NBL Song Reactions Worker — セットアップ手順

## 前提

- Cloudflare アカウント作成済み
- Node.js がインストール済み（このプロジェクトを動かしている環境ならOK）

---

## 初回セットアップ（この順番で実行）

### Step 1: このフォルダに移動

```bash
cd workers/reactions
```

### Step 2: 依存パッケージをインストール

```bash
npm install
```

### Step 3: Cloudflare にログイン

```bash
npx wrangler login
```

ブラウザが自動的に開きます。Cloudflare のログイン画面が表示されたら、
サインアップしたアカウントでログインして「Allow」を押してください。
ターミナルに「Successfully logged in.」と表示されたら完了です。

### Step 4: KV（データを保存する場所）を作成

```bash
npx wrangler kv namespace create REACTIONS_KV
```

このコマンドを実行すると、以下のような出力が出ます：

```
✅ Created namespace "nbl-song-reactions-REACTIONS_KV"
Add the following to your wrangler.toml:

[[kv_namespaces]]
binding = "REACTIONS_KV"
id = "abc123def456..."   ← ここの値をコピーする
```

`id = "..."` の値をコピーしておいてください（次のステップで使います）。

### Step 5: プレビュー用 KV も作成

```bash
npx wrangler kv namespace create REACTIONS_KV --preview
```

同様に `preview_id = "..."` の値をコピーします。

### Step 6: wrangler.toml を書き換える

`wrangler.toml` を開いて、Step 4・5 でコピーした ID を貼り付けます：

```toml
[[kv_namespaces]]
binding = "REACTIONS_KV"
id = "← Step 4 でコピーした id"
preview_id = "← Step 5 でコピーした preview_id"
```

また、本番サイトのドメインを設定します：

```toml
[vars]
ALLOWED_ORIGIN = "https://nextbeinglab.com"  ← 実際のドメインに変える
```

### Step 7: デプロイ

```bash
npx wrangler deploy
```

デプロイが成功すると：

```
✅ Deployed nbl-song-reactions
https://nbl-song-reactions.<あなたのサブドメイン>.workers.dev
```

この URL が API のベースになります。

---

## デプロイ後の確認

ブラウザで以下の URL を開いて `{"ok":true}` が返れば成功です：

```
https://nbl-song-reactions.<あなたのサブドメイン>.workers.dev/health
```

---

## 日常のデプロイ（コードを更新した後）

```bash
cd workers/reactions
npx wrangler deploy
```

---

## ローカルでのテスト（任意）

```bash
npx wrangler dev
```

ローカルで `http://localhost:8787` に立ち上がります。
curl でテストできます：

```bash
# ヘルスチェック
curl http://localhost:8787/health

# いいね（デプロイ後のテストにも使える）
curl -X POST http://localhost:8787/like \
  -H "Content-Type: application/json" \
  -d '{"slug":"dekiru-joken"}'

# カウント確認
curl "http://localhost:8787/get?slug=dekiru-joken"
```
