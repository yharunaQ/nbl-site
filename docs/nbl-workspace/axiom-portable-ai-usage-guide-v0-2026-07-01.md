# Axiom Portable AI Usage Guide v0

Date: 2026-07-01  
Lane: Falcon Lab  
Companion file: `docs/nbl-workspace/axiom-portable-expert-reasoning-skill-v0-2026-07-01.md`  
Status: usage guide / internal portable-skill operation / no external account mutation, publication, public approval, source/support validity, runtime movement, or learning update

## Purpose

This guide explains how to use the Axiom portable skill in ChatGPT, ChatGPT Projects, custom GPTs, Claude, Gemini, Grok, and API-style model calls.

The skill file is designed to work in three levels:

1. Plain chat paste or attachment
2. Persistent workspace knowledge such as ChatGPT Projects, Claude Projects, or Gemini Gems
3. Custom assistant setup such as GPTs or API system instructions

## Files To Use

Primary file:

- `axiom-portable-expert-reasoning-skill-v0-2026-07-01.md`

Optional working material:

- public copy draft
- briefing prompt
- source excerpt or memo
- article draft
- consultation-support scenario with no personally identifying information
- infographic or video concept draft

Do not upload raw sensitive data, `data/original_secure/`, individual medical details, diagnosis-linked personal cases, third-party personal information, or unreviewed private consultation material into consumer AI tools.

## Best Default Setup

For ordinary use, attach or paste the skill file and start with:

```text
Use the attached Axiom Portable Expert Reasoning Skill.
Task: [write your task]
Output mode: [briefing/report/critique/public_copy_review/infographic_structure/consultation_hypothesis_map]
Audience: [support professionals / employer / public reader / internal reviewer / founder]
Boundary: provisional reasoning only. Do not produce final medical, legal, HR, accommodation, source-validity, or public-approval judgment.
```

## ChatGPT: Ordinary Chat

Use this when you want fast one-off work.

Steps:

1. Start a new ChatGPT chat.
2. Attach the skill md file, or paste the "Short Version For Copy-Paste" from the skill file.
3. Add the task and desired output mode.
4. If the answer becomes generic, say:

```text
Re-run using the Axiom intermediate object first. Show source-lens map, interaction structure, counter-hypotheses, missing context, cannot-yet-say, and human-review route before the final output.
```

Good for:

- short briefing
- draft critique
- public-copy risk scan
- infographic structure
- concept translation

Less good for:

- repeated work across many threads
- large knowledge packets
- maintaining stable behavior over time

## ChatGPT Projects

Use this when Axiom work should continue across many chats.

OpenAI describes Projects as workspaces where chats, uploaded files, and project instructions stay together. Projects can include reference files and project-specific instructions.

Recommended setup:

1. Create a project named `Axiom Expert Reasoning` or `NBL Axiom Lab`.
2. Upload `axiom-portable-expert-reasoning-skill-v0-2026-07-01.md` as a project file.
3. Add project instructions:

```text
Always use the uploaded Axiom Portable Expert Reasoning Skill as the operating frame.
Before final output, separate observation, inference, counter-hypothesis, missing context, implementation actor conditions, source-lens status, actionability band, cannot-yet-say limits, and human-review route.
Use ICF as the primary interaction frame. Use ICD only for condition-label normalization and indexing.
Do not produce final medical, legal, HR, accommodation, source-validity, public-approval, or learning-update judgments.
If the user asks for current law, policy, statistics, or official claims, require current source verification and label it as fresh external research, not reviewed Axiom knowledge.
```

Use Projects for:

- repeated Axiom memo generation
- internal public-copy review
- concept translation for NBL/NBL-like public surfaces
- comparing many drafts against the same boundary

Avoid:

- mixing unrelated projects in the same Axiom project
- relying on memory alone for active boundary rules
- uploading raw sensitive datasets

## Custom GPTs

Use this when you want a reusable Axiom assistant inside ChatGPT.

Recommended GPT configuration:

- Name: `Axiom Expert Reasoning`
- Description: `Reviewable employment-support reasoning using Axiom source-lens, ICF interaction, counter-hypothesis, missing-context, and human-review boundaries.`
- Instructions: paste the "Short Version For Copy-Paste" plus the Project instructions above.
- Knowledge: upload the full skill md file as reference material.
- Capabilities: enable web search only if you want current external verification; otherwise leave it off for local/provisional reasoning behavior.

Important setup rule:

- Put behavior rules in GPT Instructions.
- Put the skill md as Knowledge.
- Do not rely only on Knowledge for behavior.

Starter prompts:

```text
Turn this draft into an Axiom-style briefing for employment-support professionals.
```

```text
Review this NBL public copy for disease-lookup risk, finality risk, source-currentness risk, and public-boundary risk.
```

```text
Build an infographic structure that shows biased shadow -> ICF/Axiom reconstruction -> work-condition design.
```

## Claude

Use ordinary Claude chat for one-off tasks. Attach or paste the skill file, then use the default setup prompt.

Use Claude Projects for repeated work. Claude Projects support a project knowledge base and project instructions. A good Claude Project setup is:

Project knowledge:

- upload the Axiom skill md
- add only non-sensitive public or internal-safe drafts

Project instructions:

```text
Use the Axiom Portable Expert Reasoning Skill as the project operating frame.
Do not answer as a generic disability-employment advisor.
Always reconstruct the issue through source lenses and Person / Job / Environment / Support / Time / Institution.
Separate provisional structure from final judgment.
Ask for missing context before strong recommendations.
```

Claude often does well with long-form synthesis. Ask it to keep the Axiom object visible if it becomes too polished:

```text
Keep the intermediate object visible. Do not collapse it into a polished essay yet.
```

## Gemini

Use ordinary Gemini chat for one-off tasks by attaching or pasting the skill md.

For persistent use, create a custom Gem. Google describes Gems as custom Gemini assistants with instructions and optional knowledge files.

Recommended Gem setup:

- Name: `Axiom Work-Condition Reasoning`
- Instructions: paste the short Axiom behavior rules and output contract
- Knowledge: add the full skill md file
- Preview prompt:

```text
Use Axiom to critique this public copy. Output public boundary position, risk findings, safer rewrite, and review required before use.
```

Gemini Gem instruction structure maps well to:

- Persona: Axiom-informed employment-support reasoning assistant
- Task: reconstruct fragmented material into reviewable interaction structure
- Context: NBL/Axiom boundaries, ICF primary, ICD secondary
- Format: use Axiom templates

## Grok

Use Grok chat as a plain chat or file-assisted session when the interface supports it.

Recommended ordinary use:

1. Paste the short Axiom behavior rules at the top of the chat, or attach the full md file if file upload is available.
2. Give a bounded task.
3. Ask Grok to output the Axiom intermediate object before commentary.

Prompt:

```text
Use this as a strict reasoning frame, not as a topic suggestion:
[paste Short Version For Copy-Paste]

Task: critique this post idea for NBL/Axiom public-boundary risk.
Output: public boundary position, risk findings, safer rewrite, review required before use.
```

For xAI API use, place the short Axiom behavior rules in the system message and the task in the user message.

Do not assume Grok has a stable public equivalent of ChatGPT custom GPTs, ChatGPT Projects, Claude Projects, or Gemini Gems unless your current Grok interface exposes one. If there is no persistent project/assistant feature, keep the md file outside Grok and paste or attach it per session.

## API-Style Use

Use this pattern for OpenAI API, Anthropic API, Gemini API, or xAI API:

System/developer instruction:

```text
You are an Axiom-informed employment-support reasoning assistant.
Use the following Axiom Portable Expert Reasoning Skill as binding behavior:
[paste the Short Version For Copy-Paste, or a compact version of the skill]
```

User message:

```text
Task: [task]
Output mode: [mode]
Audience: [audience]
Source regime: [reviewed local / bootstrap prior / fresh external / user supplied / unknown]
Material:
[paste material]
```

For long tasks, pass the full md as a retrieval file or project knowledge, then keep the core behavior in the system/developer message.

## Platform Choice

Use ordinary chat when:

- the task is one-off
- the draft is short
- no continuing context is needed

Use ChatGPT Projects or Claude Projects when:

- you will do many related tasks
- you want stable instructions and uploaded reference files
- you want a running workbench for Axiom/NBL drafts

Use custom GPTs or Gemini Gems when:

- you want a reusable assistant entry point
- other collaborators will use the same behavior
- you need starter prompts and persistent assistant identity

Use API/system-message setup when:

- you want reproducible runs
- you want logging, evaluation, or controlled prompts
- you need to integrate with scripts or internal tools

## Quick Test Prompts

Test 1:

```text
Using Axiom, explain why "病名別に配慮を一覧化する" is weaker than work-condition reasoning. Output mode: briefing.
```

Pass condition:

- answer mentions ICF interaction, ICD-only indexing, source lenses, missing context, and disease-lookup risk

Test 2:

```text
Review this copy: "診断名を入れるだけで、あなたに最適な合理的配慮をAIが提案します。"
Output mode: public_copy_review.
```

Pass condition:

- answer blocks or revises the copy because it implies diagnosis lookup, AI finality, accommodation finality, and individual advice

Test 3:

```text
Build an infographic structure for Axiom: many biased shadows -> ICF/LLM reconstruction -> latent work-condition structure -> NBL public expression forms.
Output mode: infographic_structure.
```

Pass condition:

- answer distinguishes visualization from proof and includes boundary wording

## Update Rule

When Axiom repo artifacts change, update the skill file first, then update this usage guide only if platform setup or recommended prompts change.

## Source Notes For Platform Setup

Current platform behavior should be checked against official docs before public instructions are published.

- OpenAI Projects: OpenAI Help describes Projects as workspaces with chats, uploaded files, and project instructions: https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt
- OpenAI GPTs: OpenAI Help says GPT Instructions define behavior, while Knowledge files provide reference material: https://help.openai.com/en/articles/8554397-creating-a-gpt
- Claude Projects: Claude Help describes projects as self-contained workspaces with chat histories, knowledge bases, uploaded documents, and project instructions: https://support.claude.com/en/articles/9517075-what-are-projects
- Gemini Gems: Google Gemini Help describes custom Gems with instructions and optional uploaded files for more context: https://support.google.com/gemini/answer/15235603
- xAI/Grok API: xAI docs show system messages in Grok API examples and list Files & Collections / Chat with Files in the developer docs: https://docs.x.ai/overview
