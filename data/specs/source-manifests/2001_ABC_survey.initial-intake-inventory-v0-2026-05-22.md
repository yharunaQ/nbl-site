# 2001 ABC Survey Initial Intake Inventory

作成日: 2026-05-22
Lane: Falcon Lab
状態: source inventory / 未レビュー / 昇格なし / 統合なし / runtime未承認
本文引用: なし
row-level回答本文の外部化: なし

## Positioning

`2001_ABC_survey`は、障害者雇用事業所を起点に、人事労務担当者、職場上司、障害者本人の三者視点を紐付けられる可能性がある歴史的調査データである。

最初の扱いは、`historical_linked_triangular_source_family` とする。いきなりFalcon core knowledgeへ統合しない。まず、調査構造、回答単位、リンク品質、時代限界、自由記述/診断名の機微性を確認する。

## Files Observed

| file | role | structure observed |
|---|---|---|
| `ABC_schime.pdf` | 調査依頼・配布回収スキーム | 1 page. 事業所が最大3名の障害者を選び、A/B/Cを配布・回収する設計。 |
| `A_Employer_Questionaire.pdf` / `A_data.xlsx` | 事業所・人事労務担当者回答 | data sheet `A全て`: 1582 rows after header, 102 columns. dictionary sheetあり。 |
| `B_Superviser_Questionaire.pdf` / `B_data.xlsx` | 職場上司による個々の障害者状況 | data sheet `B全て`: 3875 rows after header, 146 columns. dictionary sheetあり。 |
| `C_Employee_Questionaire.pdf` / `C_data.xlsx` | 障害者本人または補助/代理回答 | data sheet `C全て`: 3891 rows after header, 106 columns. dictionary sheetあり。 |
| `README.md` | local source note | 障害者番号での紐付けは必ずしも確実でなく、再確認が必要と明記。 |

The current workbook counts differ from the remembered figures for A/B. Treat these as file-level observed counts until the questionnaire history and any supplemental records are reconciled.

## Linkage Snapshot

| check | observed count |
|---|---:|
| A unique establishment IDs | 1582 |
| B unique establishment-target pairs | 3875 |
| C unique establishment-target pairs | 3891 |
| A establishments with B | 1500 |
| A establishments with C | 1404 |
| B/C overlapping establishment-target pairs | 3400 |
| full A+B+C triad pairs | 3318 |
| B pairs without C | 475 |
| C pairs without B | 491 |
| B establishments not found in A | 43 |
| C establishments not found in A | 45 |
| C rows missing target ID | 1 |

Initial read: the linkage is strong enough to be worth preparing, but not clean enough for immediate triad analysis. The first real work should be linkage QA, not FCHMA interpretation.

## Content Value

### A: Establishment / HR-Labor Perspective

A contains establishment industry/size, disability employment status, perceived burden of workplace/environmental accommodations, reasons for employing disabled workers, employment challenges, and use of external professional advice.

Falcon value:

- Sets the organization-level context around worksite design and perceived implementation burden.
- Helps distinguish individual work-function issues from establishment capacity, support access, and accommodation burden.
- Useful for `C03-support-connection`, `C05-worksite-contact`, and institutional/environmental conditions.

Limit:

- It is establishment-level, not individual outcome evidence.
- It can show burden perception, but cannot decide whether a support was valid or appropriate.

### B: Supervisor Perspective On Individual Worker

B contains individual worker attributes as perceived/recorded by workplace side, disability type/severity, work form, assistive devices, job class, actual work content, accommodations performed or considered needed, external support agencies, task/work performance problems, and occupational life restrictions/problems.

Falcon value:

- Strongest table for worksite-level structure: job design, work procedures, communication, mobility, commuting, health/self-care, interpersonal relations, emergency preparedness, and life outside work.
- Strong for comparing `support performed`, `support needed`, `problem resolved`, `problem unresolved`, and `not a work requirement`.
- Useful for `C01-health-time`, `C03-support-continuity`, `C04-information-participation`, `C05-worksite-contact`, and `C07-quality-participation`.

Limit:

- Supervisor view can understate or overstate the worker's experienced need.
- It is not a final judgment of worker functioning, accommodation adequacy, or employment quality.

### C: Disabled Worker Perspective

C contains answer method, current work situation, disability type/severity, detailed impairment indicators, age at disability onset, optional diagnosis/health-condition text, job content, perceived need/usefulness of accommodations/supports, assistive device use, job satisfaction, and free text.

Falcon value:

- Directly tests whether supervisor-side accommodations match worker-side need/usefulness.
- Allows perspective-gap analysis for support, worksite contact, communication, health management, commuting, interpersonal relations, and job satisfaction.
- Useful for `C04-information-participation`, `C05-worksite-contact`, `C07-quality-participation`, and limited `C01-health-time`.

Limit:

- Includes diagnosis text and free text; row-level text is sensitive and cannot be externalized.
- C is employed-worker data; it is weak for prework/non-employed participation unless using onset/work-history fields very cautiously.

## High-Value Falcon Questions

This source can answer structural questions that current respondent-centered Stage 1 sources cannot fully answer:

1. Same support item, different viewpoint: when does the supervisor say support is present or not needed while the worker says it is necessary or useful?
2. Same worksite contact point, different outcome state: which task/contact problems are resolved, unresolved, or not required?
3. Establishment capacity plus individual experience: when do A-level burden/advice-use patterns align with B/C pair-level support gaps?
4. Disability category as condition window: do physical, sensory, internal, intellectual, and historically limited mental-disability windows show the same worksite-contact structures in different forms?
5. Participation quality: how do job satisfaction, work restrictions, support usefulness, and job/task design relate without reducing the issue to satisfaction or individual ability?

## Early Aggregate Signals

These are non-text aggregate checks only.

- B/C pair overlap is 3400, with 3318 full A+B+C triad pairs.
- B/C main-disability codes are comparable for 3317 overlapping pairs; 366 pairs have different main-disability codes. This may be data error, perspective/coding difference, or linkage issue and requires QA before interpretation.
- C has 622 rows marked with the intellectual-disability special questionnaire flag.
- C job satisfaction distribution is present and analyzable, but must be treated as one participation-quality signal, not as proof of job quality.
- C includes 1973 non-empty diagnosis-name entries and 965 non-empty free-text entries; these require strict redaction/anonymization handling.
- B includes 2203 non-empty actual-work-content entries and 345 free-text entries.
- A includes 293 free-text entries plus additional establishment background text fields.

## SCIMA/FCHMA Usefulness Assessment

| axis | expected usefulness | reason |
|---|---|---|
| `C01-health-time` | medium | B/C include health management, work hours, treatment/medication convenience, and restriction/problem items, but the 2001 data is weaker for fluctuating rare-disease health time. |
| `C02-disclosure-translation` | low to medium | Direct disclosure boundary is limited, but B/C perspective mismatch and optional diagnosis text can reveal translation boundaries if handled safely. |
| `C03-support-continuity` | high | A includes external advice use; B includes external support agency and support implementation; C includes support need/usefulness. |
| `C04-information-participation` | high | B/C both include communication/information support items and work participation consequences. |
| `C05-worksite-contact` | very high | The questionnaire explicitly covers work equipment, work procedures, mobility, safety, tools, posture, operation, and environmental contact points. |
| `C06-life-security` | low to medium | B has outside-work daily living support and A has establishment support context, but income/life-security sequencing is not the central design. |
| `C07-quality-participation` | high | B restrictions/problems plus C satisfaction and support usefulness can test participation quality without relying only on job continuation. |
| `C08-prework-participation` | low | The sample is employed workers selected through establishments; use only as historical/work-entry context, not prework population evidence. |
| `SG-06-minority-window-revival` | high | Sensory, mobility, internal, intellectual, and small-category windows can reveal different forms of the same worksite-contact structures. |

## Hard Limits

- Historical context: 2001 data should not be used as present-day policy/current-practice proof.
- Coverage: rich for physical and intellectual disability; no rare disease data; mental disability context is from pre-employment-obligation era.
- Selection: establishments selected up to three workers, generally by heavier disability degree and diversity of disability/job if needed.
- Linkage: `事業所番号` + `調査対象者番号` is promising but must be tested before triad-level claims.
- Sensitive fields: diagnosis text and free text must not be quoted or exported.
- Method boundary: this source can generate structural hypotheses, not final support validity or accommodation adequacy judgments.

## Recommended Next Slice

Build a `2001_ABC_survey` response-type and linkage-QA map before any SCIMA/FCHMA interpretation:

1. Create variable-level response-type map for A/B/C from the `データ一覧` sheets.
2. Classify variables into identifier, establishment context, disability/impairment condition window, job/work content, support/accommodation, task/contact problem, participation quality, satisfaction/outcome, free text, and sensitive diagnosis text.
3. Build linkage QA: A-only, B-only, C-only, B+C, A+B+C, missing key, and mismatch diagnostics.
4. Create a no-row-text aggregate profile by disability window, questionnaire type, and link availability.
5. Only after this, prepare redaction/anonymization rules for free text and diagnosis-text fields.

This keeps the dataset useful without letting it add noise or prematurely overwrite the newer Stage 1 network.
