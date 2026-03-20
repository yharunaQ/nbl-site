# Publish Checklist

内部 draft / 2026-03-20 release review

## Status As Of 2026-03-19

- public scope:
  - `/`
  - `/what-we-do`
  - `/for-enterprise`
  - `/jac-foundations`
  - `/contact`
  - `/resources`
  - `/videos`
- public top policy:
  - `/` は temporary public-safe home を維持する
  - `relaunch public home` は `/review/relaunch-public-home` で内部確認を続ける
- internal hold:
  - songs campaign lane
  - pricing / open trial promise
  - guidebook checkout の前面化
  - JAC 個別相談 wording
- checks passed on 2026-03-19:
  - `npm run typecheck`
  - `npx jest __tests__/home.test.tsx __tests__/resources.test.tsx --runInBand`
  - `npm run build`

## Tonight 2026-03-19

- トップページで `合理的配慮 = 職場設計` が自然に読めるかを最終確認する
- article reader にとって `続きがある` 感じがするかを `/` -> `/for-enterprise` -> `/jac-foundations` の順で見る
- `補足ページが主役に見えない` ことを確認する
- JAC が sales-first に見えないことを確認する
- songs は内部整理のままにし、main public lane に混ぜない

## Publish Morning 2026-03-20

- `npm run release:public:preflight`
- `npm run release:public:surface-check`
- `/`、`/for-enterprise`、`/jac-foundations`、`/resources`、`/videos` をざっと目視する
- `/contact` で Founder / NBL の背景と相談境界が読めることを確認する
- `/review/relaunch-public-home` は内部確認面のままで、public root に出ていないことを確認する
- `public/robots.txt` と `public/sitemap.xml` がそのまま使える状態か確認する
- 問い合わせ導線が `/contact` -> `info@nextbeinglab.org` になっていることを確認する

## After Publish

- 新聞経由の初訪問者がまずどこに入るかを見る
- 問い合わせが来たら `contact-reply-template.md` を起点に返す
- songs への関心が出ても、すぐに public top へは混ぜず campaign lane として別管理する

## Quick Review Questions

- `不気味に狙われている感じ` はないか
- `追加の情報がある` 感じがするか
- `まだ見せない理由` が過剰に defensive でないか
- `連絡前の安心材料` があるか
- `連絡してもよい` と感じるか
