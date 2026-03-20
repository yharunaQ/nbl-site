# March 20 Public Release Ready

更新日: 2026-03-19

## Purpose

2026-03-20 朝の公開に向けて、今夜の内部整理と明朝の preflight を一枚にまとめる。

## Public Scope For 2026-03-20

- `/`
- `/what-we-do`
- `/for-enterprise`
- `/jac-foundations`
- `/resources`
- `/videos`

## Internal Scope Only

- songs campaign lane
- pricing
- open trial promise
- guidebook checkout の前面化
- JAC 個別相談 wording
- DAO / lab / experiment surfaces

## Ready State As Of 2026-03-19

- public top は temporary public-safe home を使い、relaunch public home は internal review に残す
- `for-enterprise`、`jac-foundations`、`resources`、`videos` は public-safe な導線として成立している
- songs は内部整理が進み、tracker、infographic map、video overlap map がそろった
- crossmedia rule は `song = 情景`、`infographic = 概念固定`、`video = 説明骨格` に整理済み

## Commands Confirmed On 2026-03-19

- `npm run typecheck`
- `npx jest __tests__/home.test.tsx __tests__/resources.test.tsx --runInBand`
- `npm run build`
- `npm run songs:refresh`

## Tonight Checklist

- Founder は `この面なら 2026-03-20 朝に public に出せる` かだけ判断する
- public main lane に songs を混ぜない
- もし最後に迷う場合は `/`、`/for-enterprise`、`/jac-foundations` の順で再確認する

## Morning Checklist

1. `npm run release:public:preflight`
2. `npm run release:public:surface-check`
3. `/`、`/for-enterprise`、`/jac-foundations`、`/resources`、`/videos` を目視確認する
4. `/review/relaunch-public-home` が internal review 面のまま維持されていることを確認する
5. `public/robots.txt` と `public/sitemap.xml` を再生成不要か確認する
6. 問い合わせ導線と `info@nextbeinglab.org` を確認する

## Release Reading

- 2026-03-20 は `全部完成の日` ではない
- `いったんここまでなら public に出せる` 面を固める日
- songs は明日の main CTA ではなく、次ラウンドの campaign lane として温存する

## Founder Boundary

- Yes / No:
  - `この面で朝に出す`
- Keep / Hold:
  - songs を public top に混ぜるかは hold
- If inbound increases:
  - まずは `for-enterprise`、`resources`、`contact reply template` で受ける
