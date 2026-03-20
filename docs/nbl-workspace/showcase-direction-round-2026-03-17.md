# Showcase Direction Round

更新日: 2026-03-17
Status: multi-agent synthesis / hidden review guidance

## Why this round exists

Founder feedback と current relaunch draft review から、NBL サイトは内容自体よりも `showcase としての質感` に弱さがあると分かった。

問題は単純な visual polish 不足ではなく、`AI-native な運営機構`、`artifact の蓄積`、`障害就労を旗艦領域として扱う理由` が、訪問体験として十分に知覚できていないことにある。

そのため、今回は実際に複数 subagent を並列で走らせ、visual、content system、AI-native experience、delivery sequencing を別々に検討した。

## Inputs from subagents

- Visual Systems Director
  - current draft は polished Tailwind landing page に見え、civic systems futurism ではなく friendly AI SaaS へ寄りすぎている
- Content Systems Director
  - IA は基本的に正しいが、social OS の変換機構と stream taxonomy が draft 間で揺れている
- AI-Native Experience Director
  - `AI-native` は主張されているが、loop、artifact、boundary、review status が visible でないため証拠性が弱い
- Showcase Delivery Director
  - safest fast path は、Home を orchestration shell として強くし、その後 shared shell を各 stream に広げること

## Integrated diagnosis

1. 現行案は `均一なカード列` が強く、主張・proof・boundary・entry path の密度差が見えにくい
2. `social OS` が説明されているが、`concern -> framing -> trial -> reusable artifact` の鎖が visible ではない
3. 障害就労が、旗艦領域というより `1 section` に見えやすい
4. hidden review の staging language が visible surface に漏れると authority が下がる

## Working conclusion

NBL の Home は、`きれいなAIサイト` を目指すより、`研究・実装・運営の機構が感じられる入口` を目指すべき。

visual direction は `friendly AI SaaS` ではなく `civic systems futurism`。
ただし、それを gimmick や未来演出で作るのではなく、次の3点を visible にすることでつくる。

1. mechanism
2. artifacts
3. boundaries

加えて、`人間超え` を神秘化でなく運用能力として見せるなら、`visible improvement` も必要になる。
つまり、`昨日より今日の方がよい`、`なぜ変わったかが追える`、`速さより境界が守られている` の3点が感じられる必要がある。

## Safe design and content direction

### Keep stable

- Home = position + routing
- What We Do = offers + journey
- Methods = JAC / frameworks
- Resources = public collections
- Vision = mission / participation design
- Operating Model = loops / boundary / governance

`Next Horizon` は raw public nav の peer stream にはまだしない。
future vision は Vision 配下で扱う。

### Add to Home now

- `How NBL works in 3 moves`
- `What accumulates`
- `How the site improves`
- `Why this domain reveals the larger design problem`
- `Public-safe operating note`
- `Start with your question`

### Keep off Home for now

- revenue stack
- partner discovery internals
- raw incubation materials
- full loop mechanics and stop conditions
- detailed JAC product surface split

## Disability/work content guardrail

NBL の旗艦領域の説明は、診断や category から始めない。
最低でも次の lenses を visible に置く。

- Person
- Job
- Environment
- Support
- Time
- Institution

これは、障害就労を `配慮の話` に閉じず、仕事設計と参加設計の問題として扱うための public-safe な読み方でもある。

## Rollout path

### Phase 0

taxonomy と public promise を固定する

### Phase 1

Home を evidence-first の orchestration shell へ更新する

### Phase 2

shared shell を What We Do / Methods / Resources / Vision へ広げる

### Phase 3

operating evidence、learning trail、boundary label を軽く public に出す

## Immediate implementation

今回の第一段実装では、`components/RelaunchPublicHome.tsx` に次を反映する。

- hero を `thesis + operating evidence artifact` にする
- `3 moves` を visible にする
- `artifact layer` を追加する
- 障害就労を `six-lens` で読む analytical section に変える
- `stream map` を `What We Do / Methods / Resources / Vision / Operating Model` にそろえる
- question-led router を最後に置く
