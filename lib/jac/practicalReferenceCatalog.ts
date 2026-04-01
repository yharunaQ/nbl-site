import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { EvidenceItem } from '@/lib/knowledge/agenticExecutor';
import { getKnowledgeSourceById } from '@/lib/knowledge/sourceRegistry';

type NormalizedRecord = {
  id: string;
  sourceId: string;
  filePath: string;
  text: string;
  interactionContext?: {
    sourceUrl?: string | null;
    finalUrl?: string | null;
    pageType?: string | null;
    evidenceScope?: string | null;
    accommodationFacets?: string[] | null;
    supportTypeHints?: string[] | null;
    practicalTitleJa?: string | null;
    practicalSummaryJa?: string | null;
    usageFocus?: string | null;
    applicabilityConditionsJa?: string | null;
    traceExcerptOriginal?: string | null;
  };
};

export type PracticalReferenceContext = {
  consultationText?: string;
  additionalConsultation?: string;
  selectedTags?: string[];
  followUpAnswers?: string[];
  selectedAccommodationTitles?: string[];
  selectedAccommodationStatements?: string[];
};

export type PracticalReferenceUseMode = 'dialogue' | 'trial' | 'review';

export type PracticalReferencePreviewItem = {
  id: string;
  title: string;
  summary: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string | null;
  category: 'case_example' | 'practical_guidance';
  categoryLabel: string;
  usageFocus: PracticalReferenceUseMode;
  usageFocusLabel: string;
  whyRelevant: string;
  pageType: string;
  evidenceScope: string;
  linkedAccommodationTitles?: string[];
};

type PracticalReferenceCandidate = {
  hit: EvidenceItem;
  record: NormalizedRecord;
  matchedConcepts: ContextConceptProfile[];
  score: number;
};

const NORMALIZED_RECORDS_PATH = path.join(
  process.cwd(),
  'references',
  'index',
  'normalized-records.jsonl',
);

const PRACTICAL_REFERENCE_SOURCE_IDS = new Set([
  'askjan_website',
  'askearn_employer_guidance',
  'jeed_reference',
  'australia_jobaccess_guidance',
  'uk_gov_disability_employment',
  'uk_headway_brain_injury_work',
  'canada_duty_to_accommodate',
  'eu_reasonable_accommodation',
]);

const EXCLUDED_PAGE_TYPES = new Set(['search_index', 'index', 'finder', 'resource_hub']);
const CASE_PAGE_TYPES = new Set(['case_detail', 'case_guide']);
const GUIDANCE_PAGE_TYPES = new Set([
  'employer_guidance_page',
  'employer_toolkit',
  'employer_publication',
  'policy_guide',
  'document',
]);
const PRACTICAL_ACTION_PATTERNS = [
  /written instructions?|task lists?|checklists?|labels?|reminders?/i,
  /adjust(?:ing)? work schedules?|flexible working(?: time| arrangements?)?/i,
  /change(?:s)? to work (?:methods|tasks|processes)|swapping tasks?/i,
  /new or different equipment|assistive|technology|screen reader/i,
  /lighting|noise|thermostat|breaks?\b/i,
  /communication|interpreter|captions?|sign language/i,
  /accommodation|adjustment|support|配慮|支援/i,
];
const CONCRETE_ADJUSTMENT_PATTERNS = [
  /(?:talk|meet|discuss|review|reassess|document|follow-?up|clarify|confirm|identify|gather)\b.{0,90}\b(?:employee|manager|barriers?|needs?|limitations?|restrictions?|adjustments?|solutions?|input|feedback|functional abilities)\b/i,
  /(?:provide|install|adjust|allow|change|swap|modify|schedule|set up|create|use)\b.{0,100}\b(?:written instructions?|task lists?|checklists?|labels?|reminders?|breaks?|lighting|noise|temperature|captions?|sign language|interpreter|screen reader|equipment|ergonomic|chair|desk|telework|workspace)\b/i,
  /\b(?:flexible working time|written instructions?|task lists?|checklists?|labels?|reminders?|rest breaks?|captions?|sign language|interpreter|screen reader|ergonomic|telework|functional abilities|restrictions|timely solutions)\b/i,
];
const DIALOGUE_USE_PATTERNS = [
  /talk to the employee|meet with your employee|discuss|talk with|ask(?:ed)? for input|gather relevant information|find timely solutions/i,
  /functional abilities|restrictions|limitations|barriers/i,
  /調整|面談|確認|合意|共有|すり合わせ/i,
];
const REVIEW_USE_PATTERNS = [
  /review accommodations?|reassess|follow-?up|monitor|evaluate|make continual improvements/i,
  /見直し|再評価|フォローアップ|効果確認|定期レビュー|振り返り/i,
];
const ABSTRACT_PROCESS_GUIDANCE_PATTERNS = [
  /\bsuccessful and scalable program\b/i,
  /\bstrategic mission\b/i,
  /\befficient and responsive accommodation process\b/i,
  /\bpolicy development questions to ask\b/i,
  /\bcontinuous user feedback\b.*\bprocess\b/i,
  /\bstreamlining,?\s*building in flexibility\b/i,
  /\bconducting training for in-house staff\b/i,
  /\btechnical ict accessibility standards\b|\bwcag\s*2\.0\b/i,
  /\bneeds assessments, feedback, and priorities\b/i,
  /\borganizations? of all sizes\b/i,
];
const WORK_CONTEXT_PATTERNS = [
  /employee|employer|workplace|job|task|work\b|staff|worker/i,
  /業務|職場|就労|勤務|仕事/i,
];
const LOW_VALUE_PREVIEW_PATTERNS = [
  /^maybe yes this page is useful no this page is not useful/i,
  /\breport a problem with this page\b/i,
  /\bnewsletter\b|\bwebinar\b|\broundtable\b/i,
  /^free events\b|^how to join an event\b/i,
  /\bcontact us\b|\bcontact form\b|\bkontakt\b/i,
  /\bfacebook\b|\binstagram\b|\blinkedin\b|\byoutube\b/i,
  /\bfollow us\b|\bfolgen sie uns auf\b/i,
  /\bprivacy\b|\bsite map\b|\babout earn\b/i,
  /^\s*frage\b|^\s*question\b/i,
  /^earn(?:['’]|&rsquo;)?s workplace mental health toolkit provides employers with the knowledge, skills, and resources/i,
  /^however, none of the strategies included in the disability@work framework/i,
  /^neurodivergent workers can contribute their talents, skills, and perspectives/i,
  /^for managers and organizations support your employees with the passport/i,
  /^learn more about mental health and substance use disorder at work/i,
  /^new research finds next-gen workers/i,
  /^learning center employers who want to hire and retain the best talent know the value of creating a workplace that welcomes all workers, including those with disabilities\.?$/i,
  /^benefits of a support plan\b/i,
  /^developing a support plan for your staff\b/i,
  /^make sure you know your obligations\b/i,
  /^save workplace adjustments made easy\b/i,
  /^if you(?:’|')re getting employment and support allowance\b/i,
  /^if you disagree with a decision\b/i,
  /^it normally involves using photo ID\b/i,
  /^you(?:’|')ll need a letter confirming your grant\b/i,
  /^what you need to claim\b/i,
  /^your disability, illness or health condition you must have\b/i,
  /^you can apply for access to work if you need extra help\b/i,
  /^in addition to the toolkit, earn offers this short course\b/i,
  /^learning center the purpose of this toolkit is to help small businesses\b/i,
  /^small business administration\b/i,
  /^reasonable accommodation is any change to a job or a work environment/i,
  /^the company retained a highly skilled it professional/i,
  /^examples of systemic measures\b/i,
  /^benefit for the employer\b/i,
  /^the diagram below assumes that the canada labour code\b/i,
  /^accommodation will normally involve the coordination of activities such as assessment and purchase of adaptive equipment\b/i,
  /^check your responsibilities when you take on someone with a different employment status/i,
  /^check who counts as an employee\b/i,
  /^the duty to accommodate is a legal obligation\b/i,
  /^accommodations that are not satisfactoryrequire adjustments and modifications\b/i,
  /^a bona fide occupational requirement is a requirement\b/i,
  /^förderung der ausbildung und beschäftigung persönliches budget bundesteilhabegesetz/i,
  /^february\s+20\d{2}\s+pressemitteilung\b/i,
  /^employers can use these practices to design and implement a successful and scalable program to recruit, hire, retain, advance and provide long-term support\b/i,
  /^this toolkit offers policy assessment information, actionable steps, sample policies, and resources to help leaders leverage disability as an integral part of their organization/i,
  /^an organization creates an efficient and responsive accommodation process through streamlining, building in flexibility, seeking feedback\b/i,
  /^policy development questions to ask develop policies that support an efficient and responsive accommodation process\b/i,
  /^with a streamlined, accessible accommodation process, people with disabilities can quickly get the tools they need to succeed\b/i,
  /^leveraging continuous user feedback to help eliminate unnecessary barriers throughout the process\b/i,
  /^needs assessments, feedback, and priorities considering all the ict used or offered\b/i,
  /^conducting training for in-house staff, including program managers, contracting and procurement officers\b/i,
  /^adopting specific technical ict accessibility standards and functional performance criteria\b/i,
  /^acing the basics developing an efficient and responsive accommodation process developing an effective accessibility program linking accessibility and accommodation policy tallying business benefits resources\b/i,
  /^if you(?:’|')re in northern ireland, find out about employment for people with disabilities or contact access to work\b/i,
  /^an effective process will also reduce employers(?:['’]|’)? exposure to legal risk and support compliance with equal opportunity laws and regulations\.?$/i,
  /^organizations may want to demonstrate that they welcome accommodation requests and consider them a way to enhance productivity\.?$/i,
  /^represented employees may consult with their union to explore the recourse mechanisms open to them\b/i,
  /^there(?:['’]|’)s more detail about employers(?:['’]|’)? obligations and how to meet them on the equality and human rights commission website\b/i,
  /^collective bargaining and social dialogue between employers and trade unions play an important role in negotiating and implementing measures for reasonable accommodation in the workplace for persons with disabilities\.?$/i,
  /^we acknowledge all traditional custodians\b/i,
  /^explore resources for service providers:/i,
  /^how your personal information is protected\b/i,
  /^save related pages\b/i,
  /^partnering with the national disability recruitment coordinator\b/i,
  /^resources find resources to further support employers\b/i,
  /^see all webinars\b/i,
  /^the job accommodation network \(jan\) is the leading source of free, expert, and confidential guidance\b/i,
  /^it(?:['’]|’)s important to focus on the individual\.?$/i,
  /^the department(?:['’]|’)s positive measure program applies to employees\b/i,
  /^"the goal of the government of canada is to have a sustainable workforce\b/i,
  /^for example, managers are not required to accept substandard performance or unpredictable attendance\.?$/i,
  /^this checklist summarizes some of the lessons learned from successful neurodiversity hiring programs\.?$/i,
  /^and don(?:['’]|’)t forget to follow earn on facebook\b/i,
  /^department of labor, nor does mention of trade names, commercial products, or organizations imply endorsement by the u\.s\.?$/i,
  /^start by subscribing to our monthly newsletter and eblasts\b/i,
  /^federal agencies also engage in self-identification efforts to meet obligations under section 501\b/i,
  /^the opinions expressed in this document do not necessarily reflect the views or policies of the u\.s\.?$/i,
  /^establishing a network of staff members responsible for implementation\b/i,
  /^for example, an organization might take a tiered approach to accommodations by:/i,
  /^maintaining effective channels of communication and feedback throughout the process\.?$/i,
  /^sample policy\b/i,
  /^23475od000002-01-00 with cornell university and no\.?$/i,
  /^if possible, it is helpful to identify a leader or leaders within your organization\b/i,
  /^many employees, both neurodivergent workers and others, find that strong encouragement can be helpful\b/i,
  /^however, these programs also ensure that their managers work within parameters\b/i,
  /^you can learn more from the job accommodation network \(jan\)/i,
  /^these sessions sometimes focus on employability or soft skills training\b/i,
  /^furthermore, jan(?:['’]|&rsquo;)?s statistics show that most employers report financial benefits\b/i,
  /^the ada, rehab act, and other disability-related laws require employers\b/i,
  /^acing the basics explore the basics\b/i,
  /^federal regulatory and policy materials\b/i,
  /^this list is not meant to be exhaustive\b/i,
  /^job accommodation network \(jan\) jan is the leading source of free, expert, and confidential guidance\b/i,
  /^for more information, visit the state policy page\b/i,
  /^supporting apprentice success:/i,
  /^although this checklist is not exhaustive\b/i,
  /^these include social and communication barriers, understanding job requirements\b/i,
  /^save your role in work health and safety find out about:/i,
  /^saved items are specific to your device\b/i,
  /^find out how jobaccess can help\.?$/i,
  /^save assistive technology for staff topics covered in this video:/i,
  /^site maintained by the department of social services back to top css updates\b/i,
  /^save inclusive language tips for employers\b/i,
  /^save workers compensation find out about:/i,
  /^you will not see items that were saved from a different device or browser\.?$/i,
  /^save dealing with discrimination at work find out about:/i,
  /^save making physical workplace adjustments topics covered in this video:/i,
  /^save flexible working arrangements find out about:/i,
  /^save advertising your vacancy find out about:/i,
  /^save share last updated:/i,
  /^they help organisations attract and keep good people, reduce stress, and improve staff confidence and productivity\.?$/i,
  /^talking about your disability at work when to talk about your disability at work/i,
  /^under this law: don(?:['’]|’)t treat a person with disability differently/i,
  /^your organisation may also get daaws if an employee becomes disabled during an apprenticeship\.?$/i,
  /^to pay for what you need to change\.?$/i,
  /^managers are encouraged to consult with their organization(?:['’]|’)s human resources functional specialists\b/i,
  /^the seven steps to building a disability management program are:/i,
  /^it is essential that you consult with your human resources department early and throughout the process\b/i,
  /^signs that might indicate that accommodation is needed include:/i,
  /^managers may have a duty to enquire in certain circumstances\b/i,
  /^disability management is most successful when it promotes respect and cooperation\b/i,
  /^it is important to ensure that all employees understand performance expectations\b/i,
  /^human resources and skills development canada is committed to enabling its employees\b/i,
  /^for support for recovery, important aspects are sick leave and injury-on-duty leave\b/i,
  /^it is a deliberate and coordinated effort by employers to reduce the occurrence and effect of illness and injury on workforce productivity\b/i,
  /^for example, for safety reasons, a certain level of vision or the wearing of protective equipment may be a bona fide occupational requirement\b/i,
  /^non-routine occupational health evaluations or ftwes are conducted\b/i,
  /^designing and implementing a disability management program makes good management sense\.?$/i,
  /^for accommodation, important aspects are accessibility standards, the duty to accommodate, and assistive technologies\.?$/i,
  /^how to use this tool this tool will allow you to proceed step by step\b/i,
  /^this situation must be resolved through proper mechanisms\b/i,
  /^keeping the lines of communication open during an employee(?:'|’)?s absence will help\b/i,
  /^employers must remove systemic barriers\b/i,
  /^with the employee, gather relevant information and supporting documentation\b/i,
  /^in the workplace, encouraging individuals with early symptoms to take remedial action\b/i,
  /^it is intended to provide guidance from the time a case is identified\b/i,
];
const LOW_VALUE_URL_PATTERNS = [
  /\/(?:about-earn|contact-us|earn-partners|earn-staff|subscribe|privacy|user-agreement|news-and-events)(?:$|[?#])/i,
  /\/(?:statistics-on-disability|federal-government-employment|recruit|build-a-pipeline-outreach-and-recruitment|lead-the-way-supportive-business-culture|why-hire-people-with-disabilities|small-business-toolkit|resources-on-mental-health-and-employment|neurodiversity-hiring-initiatives-and-partnerships|communicate-external-and-internal-communication-of-company-policies-and-practices)(?:$|[?#])/i,
  /\/page\/(?:mental-health-toolkit|disability-at-work-framework|small-business-guide-mh-sud|learning-guide-mental-well-being-of-gen-z-workers|accommodation-and-accessibility-benefits|learn-about-successful-programs|benefit-your-business-through-disability-employment|benefits-of-neurodiversity-in-the-workplace|employee-benefits-of-neurodiversity|organizational-benefits-of-neurodiversity|disability-employment-in-the-workplace|hire-and-keep-the-best-talent-acquisition-and-retention-processes|accessibility-program|measure-success-accountability|linking-accessibility-and-accommodation|create-a-mental-health-friendly-workplace|substance-use-disorder-in-the-workplace|about-the-issue|the-rehabilitation-act-of-1973-rehab-act|defining-neurodiversity-and-neurodivergence|neurodiversity-in-the-workplace)(?:$|[?#])/i,
  /\/page\/(?:disability-at-work-resources|accommodation-and-accessibility-resources|accommodation-and-accessibility-acing-the-basics|accommodation-and-accessibility-toolkit)(?:$|[?#])/i,
  /\/learning-center\/course\/mental-health-friendly-workplace(?:$|[?#])/i,
  /\/(?:free-events[^/?#]*|about-employer-toolkit)(?:$|[?#])/i,
  /\/access-to-work(?:$|[?#])/i,
  /\/access-to-work\/eligibility(?:$|[?#])/i,
  /\/access-to-work\/print(?:$|[?#])/i,
  /\/access-to-work\/(?:apply|after-you-apply|claiming-from-your-grant|renew)(?:$|[?#])/i,
  /\/guidance\/equality-act-2010-guidance(?:$|[?#])/i,
  /\/(?:diversity-inclusion-public-service\.html|disability-management\.html|working-government-canada-duty-accommodate-right-non-discrimination\.html|health-wellness-public-servants\.html|employee-wellness-resource\.html|fundamentals-duty-accommodate-roles-responsibilities\.html|duty-accommodate-general-process-managers\.html)(?:$|[?#])/i,
  /\/health-wellness-public-servants\/disability-management\/(?:how-to-build-disability-management-program|handling-disability-management-cases-tool|fundamentals)(?:\.html)?(?:$|[?#])/i,
  /government-canada-workplace-accessibility-passport(?:\.html)?(?:$|[?#]|\/)/i,
  /op\.europa\.eu\/webpub\/empl\/reasonable-accommodation-at-work\/(?!en\/)[a-z]{2}\/?$/i,
  /employment-social-affairs\.ec\.europa\.eu\/reasonable-accommodation-work-guidelines-and-good-practices_en(?:$|[?#])/i,
  /\/startseite\/startseite-node\.html/i,
  /\/gb_check\/|\/eg_check\//i,
  /antidiskriminierungsstelle\.de\/DE\/ueber-diskriminierung\//i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/(?:Formen-der-Hilfe-fuer-Menschen-mit-Behinderungen|Leistungen-nach-dem-SGB-IX|Beratungsleistungen)\//i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/(?:Behindertenrechtskonvention-der-Vereinten-Nationen|Politik-Menschen-Behinderungen|Assistenzhunde)\//i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/politik-fuer-menschen-mit-behinderungen\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Rehabilitation-und-Teilhabe\/Was-ist-Teilhabe-von-Menschen-mit-Behinderungen\/[^/?#]+\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Rehabilitation-und-Teilhabe\/rehabilitation-und-teilhabe\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Rehabilitation-und-Teilhabe\/Rehabilitation-Teilhabe\/rehabilitation-teilhabe\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/teilhabe-und-inklusion\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/Beschaeftigung-schwerbehinderter-Menschen\/[^/?#]+\.html(?:$|[?#])/i,
  /gesetze-im-internet\.de\/englisch_agg\/(?:englisch_agg\.html|index\.html|print_englisch_agg\.html)?(?:$|[?#])/i,
  /\/learn-benefits-hiring\/benefits-employing-disability(?:$|[?#])/i,
  /\/know-rights-responsibilities\/(?:guidelines-discrimination|privacy-staff-disability)(?:$|[?#])/i,
  /\/hire-someone-disability\/(?:help-recruit-and-hire-people|taking-apprentice-disability)(?:$|[?#])/i,
  /\/i-am-a-person-with-disability\/working-or-about-start-work\/your-rights-and-responsibilities(?:$|[?#])/i,
  /\/i-am-a-person-with-disability\/working-or-about-start-work\/getting-started-new-job(?:$|[?#])/i,
  /\/welfare-benefits\//i,
];

type ContextConceptProfile = {
  key: string;
  label: string;
  contextPatterns: RegExp[];
  recordPatterns: RegExp[];
  accommodationPatterns?: RegExp[];
  accommodationFacets?: string[];
  supportHints?: string[];
};

type SourceContextGate = {
  sourceId: string;
  requiredContextKeys: string[];
  patterns: RegExp[];
};

type PracticalReferenceContextProfile = {
  activeConcepts: ContextConceptProfile[];
};

const SOURCE_CONTEXT_GATES: SourceContextGate[] = [
  {
    sourceId: 'askearn_employer_guidance',
    requiredContextKeys: ['sensory_environment', 'cognitive_instruction', 'communication_social'],
    patterns: [
      /testing ict applications|automated accessibility testing tools|accessibility barriers not otherwise apparent/i,
      /accessibility team|information and communication technology|technical ict accessibility/i,
      /section 501|self-identification efforts|federal agencies/i,
    ],
  },
  {
    sourceId: 'askearn_employer_guidance',
    requiredContextKeys: ['coordination_process', 'adjustment_review'],
    patterns: [
      /sample policy\b/i,
      /leader or leaders within your organization|champion efforts/i,
      /re-assessing the process regularly for continuous improvement/i,
    ],
  },
  {
    sourceId: 'canada_duty_to_accommodate',
    requiredContextKeys: ['coordination_process', 'adjustment_review', 'schedule_pacing'],
    patterns: [
      /medical absence form/i,
      /human resources department early and throughout the process/i,
      /positive measure program applies to employees/i,
      /substandard performance|unpredictable attendance/i,
      /signs that might indicate that accommodation is needed/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    requiredContextKeys: ['communication_social'],
    patterns: [/deaf or hard of hearing|communicate with co-workers who are deaf or hard of hearing/i],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    requiredContextKeys: ['coordination_process', 'adjustment_review'],
    patterns: [/support plan template|national disability recruitment coordinator|employment support plan template/i],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    requiredContextKeys: ['mental_health'],
    patterns: [/mental health specialist|stress at work/i],
  },
];

const CONTEXT_CONCEPT_PROFILES: ContextConceptProfile[] = [
  {
    key: 'schedule_pacing',
    label: '勤務時間・疲労の調整',
    contextPatterns: [
      /勤務時間|勤務日数|フルタイム|短時間|シフト|夜勤|勤務時刻|残業|連続勤務/i,
      /休憩|疲労|倦怠|睡眠|通院|治療|生活リズム/i,
    ],
    recordPatterns: [
      /work schedules?|working time|flexible working|flexible schedule|shift|hours/i,
      /breaks?\b|rest\b|fatigue|energy levels?|treatment schedules?/i,
      /短時間|勤務時間|休憩|シフト|残業/i,
    ],
    accommodationPatterns: [
      /短時間勤務|勤務時間(?:の)?調整|休憩導線|リズム設計/i,
      /締切のバッファ|業務負荷の平準化|通院・治療スケジュール|時差出勤|在宅勤務/i,
    ],
    accommodationFacets: ['schedule_flexibility'],
  },
  {
    key: 'cognitive_instruction',
    label: '認知負荷と手順の明確化',
    contextPatterns: [
      /集中作業|思考作業|文章作成|読解|マルチタスク|切替|記憶保持/i,
      /注意集中|認知負荷|発達特性|知的特性|高次脳機能|理解速度|手順保持/i,
      /指示・連絡の明確さ|手順書|見本|確認/i,
    ],
    recordPatterns: [
      /written instructions?|task lists?|checklists?|labels?|reminders?/i,
      /memory|comprehension|structure|step\s+\d+|step-by-step|planning|organi[sz]e/i,
      /手順|指示|確認|段取り/i,
    ],
    accommodationPatterns: [
      /タスクの分割|優先順位の明確化|情報をスローダウンして共有/i,
      /手順|チェックリスト|段取り|要点サマリー|文字量の最適化/i,
    ],
    accommodationFacets: ['task_redesign', 'communication_support'],
    supportHints: ['task_redesign'],
  },
  {
    key: 'sensory_environment',
    label: '感覚・環境調整',
    contextPatterns: [
      /感覚過敏|視覚負荷|聴覚負荷|騒音|光|温度|空調|画面/i,
      /字幕|文字起こし|読み上げ|アクセシビリティ/i,
    ],
    recordPatterns: [
      /lighting|noise|temperature|thermostat|screen reader|captions?|text communication/i,
      /workspace|environment|visual|audio|acoustic/i,
      /照明|騒音|温度|字幕|読み上げ/i,
    ],
    accommodationPatterns: [
      /静音|視覚刺激|感覚過敏|ノイズキャンセル|遮光|通知制御/i,
      /静音席|読み上げ|字幕|環境(?:へ)?/i,
    ],
    accommodationFacets: ['environment_control', 'assistive_technology', 'communication_support'],
    supportHints: ['environment_control', 'assistive_technology'],
  },
  {
    key: 'physical_access',
    label: '身体負荷と物理アクセス',
    contextPatterns: [
      /移動|外出|現場|身体操作|実作業負荷|立位|運搬|手作業/i,
      /姿勢|椅子|机|通勤負荷|段差|エレベータ|トイレ|物理アクセス/i,
      /痛み|内部障害/i,
    ],
    recordPatterns: [
      /physical changes?|workspace|equipment|ergonomic|chair|desk|lifting|standing|mobility/i,
      /access|accessible|physical|transport/i,
      /姿勢|椅子|机|動線|物理/i,
    ],
    accommodationPatterns: [
      /エルゴノミクス|椅子|机|姿勢|動線|身体負荷/i,
      /通勤負荷の軽減|テレワーク|在宅勤務/i,
    ],
    accommodationFacets: ['environment_control', 'assistive_technology', 'task_redesign'],
  },
  {
    key: 'communication_social',
    label: '会議・対話の支援',
    contextPatterns: [
      /会議|対話|接客|電話|窓口対応|対人調整|感情労働|同席人数/i,
      /聴覚負荷|字幕・文字起こし・テキスト連絡導線/i,
    ],
    recordPatterns: [
      /communication|interpreter|meeting|phone|customer|deaf|hard of hearing/i,
      /captions?|text communication|sign language|written follow-up/i,
      /会議|対話|電話|字幕|手話/i,
    ],
    accommodationPatterns: [
      /会議を短時間化|事前資料を共有|コミュニケーションの非同期化/i,
      /レスポンス時間の合意|チャットでの合意|文字ベース|字幕|手話/i,
    ],
    accommodationFacets: ['communication_support'],
    supportHints: ['communication_support'],
  },
  {
    key: 'safety_emergency',
    label: '安全と急変リスク',
    contextPatterns: [/安全|危険業務|緊急対応|発作|急変リスク/i],
    recordPatterns: [
      /safety|emergency|risk|safe at work|health and safety/i,
      /危険|安全|急変/i,
    ],
    accommodationFacets: ['policy_and_training', 'task_redesign'],
    supportHints: ['policy_and_training'],
  },
  {
    key: 'adjustment_review',
    label: '調整後の見直し',
    contextPatterns: [/見直し|再評価|フォローアップ|効果確認|運用後|定期レビュー|試行後/i],
    recordPatterns: [
      /review accommodations?|reassess|follow-?up|monitor|evaluate|make continual improvements/i,
      /見直し|再評価|フォローアップ|効果確認/i,
    ],
    accommodationPatterns: [
      /見直し|再評価|段階調整|週次レビュー|フォローアップ/i,
      /効果確認|振り返り/i,
    ],
    accommodationFacets: ['communication_support', 'policy_and_training'],
  },
  {
    key: 'coordination_process',
    label: '本人と職場の調整プロセス',
    contextPatterns: [
      /個別調整|配慮依頼|職場との相談|上司との相談|説明|共有|合意|見直し|試行|フィードバック/i,
      /面談|確認事項|追加確認|すり合わせ/i,
    ],
    recordPatterns: [
      /talk to the employee|meet with your employee|find timely solutions|ask(?:ed)? for input|seek(?:ing)? feedback/i,
      /functional abilities|restrictions|limitations|review accommodations?|reassess|follow-?up|document/i,
      /調整|見直し|確認|合意|面談/i,
    ],
    accommodationPatterns: [
      /本人の裁量を保ちながら段階調整|タスク二重化|代替担当の合意/i,
      /すり合わせ|合意|共有|非同期化|試行/i,
    ],
    accommodationFacets: ['communication_support', 'policy_and_training'],
    supportHints: ['communication_support'],
  },
  {
    key: 'mental_health',
    label: 'メンタル負荷と心理的安全性',
    contextPatterns: [/不安|緊張|メンタル負荷|精神症状|mental health|ptsd|substance/i],
    recordPatterns: [
      /mental health|well-being|psychological|stress|anxiety|supportive workplace/i,
      /心理|不安|緊張|メンタル/i,
    ],
    accommodationPatterns: [/メンタル負荷|心理的安全性|不安|緊張/i],
    accommodationFacets: ['policy_and_training', 'communication_support'],
  },
];

let recordsByIdPromise: Promise<Map<string, NormalizedRecord>> | null = null;

function normalizeText(value: string): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => normalizeText(value || '')).filter(Boolean))];
}

function normalizeLookup(value: string | null | undefined): string {
  return normalizeText(value || '').toLowerCase();
}

function normalizeUsageFocus(
  value: string | null | undefined,
): PracticalReferenceUseMode | null {
  const normalized = normalizeText(value || '');
  if (normalized === 'dialogue' || normalized === 'trial' || normalized === 'review') {
    return normalized;
  }
  return null;
}

const TITLE_NAVIGATION_MARKERS = [
  /\bclose menu close\b/i,
  /\bfor employers\b/i,
  /\bfor individuals\b/i,
  /\bemployer live chat home\b/i,
  /\bcontact us\b/i,
  /\bmyjan\b/i,
  /\bprint this page\b/i,
  /\bnewsletter\b/i,
  /\bsituations?\s*&\s*solutions finder\b/i,
];

const GENERIC_URL_TITLE_SEGMENTS = new Set([
  'de',
  'en',
  'es',
  'fr',
  'finder',
  'index',
  'limitations',
  'print',
  'resource-hub',
  'resources',
  'sitsol',
  'topics',
]);

const GENERIC_PRACTICAL_TITLE_PATTERNS = [
  /^make informed decision$/i,
  /^gather relevant information assess needs$/i,
  /^guidelines? on reasonable adjustments?$/i,
  /^developing support plan$/i,
  /^helping staff return to work after injury or illness$/i,
  /^flexible working arrangements$/i,
  /^changing (?:your )?work area and tasks$/i,
];

function splitSentences(value: string): string[] {
  return normalizeText(value)
    .split(/(?<=[。.!?！？])\s+|\s+(?=[A-Z][a-z]+\s+\d{4}:)|\n+/)
    .map((segment) => normalizeText(segment))
    .filter(Boolean);
}

function summarize(value: string, maxChars = 180): string {
  const compact = normalizeText(value);
  if (compact.length <= maxChars) return compact;
  return `${compact.slice(0, maxChars - 1).trim()}…`;
}

function buildContextProfile(
  context?: PracticalReferenceContext,
): PracticalReferenceContextProfile {
  const accommodationText = uniqueStrings([
    ...(context?.selectedAccommodationTitles || []),
    ...(context?.selectedAccommodationStatements || []),
  ]).join(' ');
  const contextText = uniqueStrings([
    context?.consultationText,
    context?.additionalConsultation,
    ...(context?.selectedTags || []),
    ...(context?.followUpAnswers || []),
    ...(context?.selectedAccommodationTitles || []),
    ...(context?.selectedAccommodationStatements || []),
  ]).join(' ');

  const activeConcepts = CONTEXT_CONCEPT_PROFILES.filter((concept) =>
    concept.contextPatterns.some((pattern) => pattern.test(contextText)) ||
    (concept.accommodationPatterns || []).some((pattern) => pattern.test(accommodationText)),
  );

  return {
    activeConcepts,
  };
}

function activeContextKeySet(contextProfile: PracticalReferenceContextProfile): Set<string> {
  return new Set((contextProfile.activeConcepts || []).map((concept) => concept.key));
}

function blockedBySourceContextGate(
  sourceId: string,
  text: string,
  activeContextKeys: Set<string>,
): boolean {
  const normalized = normalizeText(text);
  if (!normalized || !sourceId) return false;

  return SOURCE_CONTEXT_GATES.some((gate) => {
    if (gate.sourceId !== sourceId) return false;
    if (!gate.patterns.some((pattern) => pattern.test(normalized))) return false;
    return !gate.requiredContextKeys.some((key) => activeContextKeys.has(key));
  });
}

function pageTypeLabel(pageType: string): string {
  if (CASE_PAGE_TYPES.has(pageType)) return '類似事例';
  if (pageType === 'employer_guidance_page') return '実践ガイダンス';
  if (pageType === 'employer_toolkit') return 'ツールキット';
  if (pageType === 'employer_publication') return '公開資料';
  if (pageType === 'policy_guide') return '運用ガイド';
  if (pageType === 'document') return '参考ページ';
  return '参考資料';
}

function isNoiseSegment(value: string): boolean {
  return (
    /^(skip to|本文へ|toggle navigation|home|employer live chat home|askearn|job access|canada\.ca|閉じる|copyright|site map)/i.test(
      value,
    ) ||
    isLowValuePreviewText(value)
  );
}

function conceptTitlePhrase(concept: ContextConceptProfile | undefined): string {
  if (!concept) return '';
  if (concept.key === 'schedule_pacing') return '勤務時間・休憩・治療スケジュール';
  if (concept.key === 'cognitive_instruction') return '手順・優先順位・確認方法';
  if (concept.key === 'sensory_environment') return '感覚環境・字幕・読み上げ';
  if (concept.key === 'physical_access') return '姿勢・机・椅子・動線';
  if (concept.key === 'communication_social') return '会議・字幕・テキスト確認';
  if (concept.key === 'safety_emergency') return '安全・急変時対応';
  if (concept.key === 'adjustment_review') return '調整後の見直し・フォローアップ';
  if (concept.key === 'coordination_process') return '相談・合意・見直し';
  if (concept.key === 'mental_health') return 'メンタル負荷と心理的安全性';
  return concept.label;
}

function cutTitleAtNavigation(value: string): string {
  const normalized = normalizeText(value);
  if (!normalized) return '';

  let cutIndex = normalized.length;
  for (const pattern of TITLE_NAVIGATION_MARKERS) {
    const match = pattern.exec(normalized);
    if (match && typeof match.index === 'number' && match.index > 0) {
      cutIndex = Math.min(cutIndex, match.index);
    }
  }

  return normalizeText(normalized.slice(0, cutIndex));
}

function humanizeUrlTitleSegment(value: string): string {
  return normalizeText(
    value
      .replace(/\.(?:cfm|html?)$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' '),
  );
}

function extractTitleFromUrl(value: string | null | undefined): string | null {
  const raw = normalizeText(value || '');
  if (!raw) return null;

  let pathname = '';
  try {
    pathname = new URL(raw).pathname;
  } catch {
    return null;
  }

  const segments = pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const segment = humanizeUrlTitleSegment(decodeURIComponent(segments[index] || ''));
    if (!segment) continue;
    if (GENERIC_URL_TITLE_SEGMENTS.has(segment.toLowerCase())) continue;
    if (segment.length < 3 || segment.length > 100) continue;
    if (isNoiseSegment(segment)) continue;
    return segment;
  }

  return null;
}

function hasPracticalActionSignal(value: string): boolean {
  const normalized = normalizeText(value);
  return PRACTICAL_ACTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasConcreteAdjustmentSignal(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  return CONCRETE_ADJUSTMENT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasWorkContextSignal(value: string): boolean {
  const normalized = normalizeText(value);
  return WORK_CONTEXT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isAbstractProcessGuidance(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  return ABSTRACT_PROCESS_GUIDANCE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function determineUsageFocus(value: string): PracticalReferenceUseMode {
  const normalized = normalizeText(value);
  if (!normalized) return 'trial';
  if (DIALOGUE_USE_PATTERNS.some((pattern) => pattern.test(normalized))) return 'dialogue';
  if (REVIEW_USE_PATTERNS.some((pattern) => pattern.test(normalized))) return 'review';
  return 'trial';
}

function usageFocusLabel(mode: PracticalReferenceUseMode): string {
  if (mode === 'dialogue') return '対話の軸';
  if (mode === 'review') return '見直しの軸';
  return '試行候補';
}

function rewritePracticalSummaryToJapanese(
  value: string,
  mode?: PracticalReferenceUseMode,
): string | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  if (DIALOGUE_USE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。';
  }
  if (REVIEW_USE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return '見直しの観点: 導入後に負担軽減や実施しやすさを確認し、調整内容を見直す。';
  }
  if (
    /work schedules?|working time|flexible working|flexible schedule|shift|hours|breaks?\b|rest\b|fatigue|energy levels?|treatment schedules?|短時間|勤務時間|休憩|シフト|残業/i.test(
      normalized,
    )
  ) {
    return '試し方の例: 勤務時間や休憩を、疲労や治療スケジュールに合わせて調整する。';
  }
  if (
    /written instructions?|task lists?|checklists?|labels?|reminders?|memory|comprehension|structure|step\s+\d+|step-by-step|planning|organi[sz]e|手順|指示|段取り/i.test(
      normalized,
    )
  ) {
    return '試し方の例: 手順を文書化し、タスクを分けて確認しやすくする。';
  }
  if (
    /lighting|noise|temperature|thermostat|screen reader|captions?|text communication|workspace|environment|visual|audio|acoustic|照明|騒音|温度|字幕|読み上げ/i.test(
      normalized,
    )
  ) {
    return '試し方の例: 照明・音・温度を個別に調整し、感覚負荷を下げる。';
  }
  if (
    /communication|interpreter|meeting|phone|customer|deaf|hard of hearing|sign language|written follow-up|会議|対話|電話|手話/i.test(
      normalized,
    )
  ) {
    return '試し方の例: 会議や連絡を字幕・手話・文字ベースに切り替える。';
  }
  if (
    /physical changes?|ergonomic|chair|desk|lifting|standing|mobility|access|accessible|transport|姿勢|椅子|机|動線|物理/i.test(
      normalized,
    )
  ) {
    return '試し方の例: 椅子・机・動線・補助具を見直し、身体負荷を下げる。';
  }
  if (/safety|emergency|risk|safe at work|health and safety|危険|安全|急変/i.test(normalized)) {
    return '試し方の例: 危険場面や急変時の対応を先に決め、安全面の負担を下げる。';
  }
  if (
    /mental health|well-being|psychological|stress|anxiety|supportive workplace|心理|不安|緊張|メンタル/i.test(
      normalized,
    )
  ) {
    return '試し方の例: メンタル負荷が高い場面を特定し、支え方や連絡導線を具体化する。';
  }

  const fallbackMode = mode || determineUsageFocus(normalized);
  if (fallbackMode === 'dialogue') {
    return '対話で確認: 本人と職場で、必要な配慮と実施条件をすり合わせる。';
  }
  if (fallbackMode === 'review') {
    return '見直しの観点: 調整後に効果と負担を確認し、運用を見直す。';
  }
  return '試し方の例: 今回の状況で小さく試せる調整候補を広げる。';
}

function isLowValuePreviewText(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  return LOW_VALUE_PREVIEW_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isLowValuePreviewUrl(value: string | null | undefined): boolean {
  const normalized = normalizeText(value || '').toLowerCase();
  if (!normalized) return false;
  return LOW_VALUE_URL_PATTERNS.some((pattern) => pattern.test(normalized));
}

function sentenceMatchesConcept(value: string, concept: ContextConceptProfile): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  return concept.recordPatterns.some((pattern) => pattern.test(normalized));
}

function scoreSummaryCandidate(
  value: string,
  contextProfile?: PracticalReferenceContextProfile,
): number {
  const normalized = normalizeText(value);
  if (!normalized) return Number.NEGATIVE_INFINITY;
  if (isLowValuePreviewText(normalized)) return -100;

  let score = 0;
  if (hasConcreteAdjustmentSignal(normalized)) score += 14;
  else if (hasPracticalActionSignal(normalized)) score += 10;
  if (hasWorkContextSignal(normalized)) score += 4;
  if (isAbstractProcessGuidance(normalized) && !hasConcreteAdjustmentSignal(normalized)) {
    score -= 8;
  }
  if (/(for example|include:|might include:|could include:|step\s+\d+:)/i.test(normalized)) {
    score += 3;
  }

  const length = normalized.length;
  if (length >= 36 && length <= 220) score += 3;
  else if (length >= 20 && length <= 260) score += 1;
  else score -= 2;

  for (const concept of contextProfile?.activeConcepts || []) {
    if (sentenceMatchesConcept(normalized, concept)) score += 6;
  }

  return score;
}

function selectSummaryText(
  hitExcerpt: string,
  recordText: string,
  contextProfile?: PracticalReferenceContextProfile,
): string {
  const bestCandidate = pickBestSummaryCandidate(hitExcerpt, recordText, contextProfile);

  if (bestCandidate && bestCandidate.score > -20) {
    return summarize(
      rewritePracticalSummaryToJapanese(
        bestCandidate.candidate,
        determineUsageFocus(bestCandidate.candidate),
      ) || bestCandidate.candidate,
    );
  }

  return summarize(normalizeText(hitExcerpt || recordText));
}

function pickBestSummaryCandidate(
  hitExcerpt: string,
  recordText: string,
  contextProfile?: PracticalReferenceContextProfile,
): { candidate: string; score: number } | null {
  const candidatePool = [...splitSentences(hitExcerpt), ...splitSentences(recordText)];
  const uniqueCandidates = [...new Set(candidatePool)].map((candidate) => ({
    candidate,
    score: scoreSummaryCandidate(candidate, contextProfile),
  }));
  const concreteCandidates = uniqueCandidates.filter((item) =>
    hasConcreteAdjustmentSignal(item.candidate),
  );
  return (concreteCandidates.length > 0 ? concreteCandidates : uniqueCandidates)
    .map((candidate) => ({
      candidate: candidate.candidate,
      score: candidate.score,
    }))
    .sort((a, b) => b.score - a.score)[0] || null;
}

function matchedContextConcepts(
  record: NormalizedRecord,
  combinedText: string,
  contextProfile: PracticalReferenceContextProfile,
): ContextConceptProfile[] {
  const normalizedText = normalizeText(combinedText);
  const normalizedUrl = normalizeText(
    record.interactionContext?.finalUrl || record.interactionContext?.sourceUrl || '',
  );
  const accommodationFacets = new Set(record.interactionContext?.accommodationFacets || []);
  const supportHints = new Set(record.interactionContext?.supportTypeHints || []);

  return (contextProfile.activeConcepts || []).filter((concept) => {
    if (concept.recordPatterns.some((pattern) => pattern.test(normalizedText))) return true;
    if (normalizedUrl && concept.recordPatterns.some((pattern) => pattern.test(normalizedUrl))) {
      return true;
    }
    if ((concept.accommodationFacets || []).some((facet) => accommodationFacets.has(facet))) {
      return true;
    }
    if ((concept.supportHints || []).some((hint) => supportHints.has(hint))) {
      return true;
    }
    return false;
  });
}

function extractTitleCandidate(value: string): string | null {
  const firstLine = normalizeText(String(value || '').split('\n')[0] || '');
  if (!firstLine) return null;

  const trimmedFirstLine = cutTitleAtNavigation(firstLine);
  if (
    trimmedFirstLine &&
    trimmedFirstLine.length >= 3 &&
    trimmedFirstLine.length <= 100 &&
    !isNoiseSegment(trimmedFirstLine)
  ) {
    return trimmedFirstLine;
  }

  const segments = firstLine
    .split(/[|｜]/)
    .map((segment) => normalizeText(segment))
    .filter((segment) => segment.length >= 4 && segment.length <= 100 && !isNoiseSegment(segment));

  if (segments.length > 0) return segments[0];
  if (firstLine.length >= 4 && firstLine.length <= 100 && !isNoiseSegment(firstLine)) {
    return firstLine;
  }
  return null;
}

function resolveCategory(
  record: NormalizedRecord,
): PracticalReferencePreviewItem['category'] {
  const pageType = String(record.interactionContext?.pageType || '').trim();
  const evidenceScope = String(record.interactionContext?.evidenceScope || '').trim();
  if (evidenceScope === 'specific_case' || CASE_PAGE_TYPES.has(pageType)) {
    return 'case_example';
  }
  return 'practical_guidance';
}

function whyRelevant(
  usageFocus: PracticalReferenceUseMode,
  category: PracticalReferencePreviewItem['category'],
  matchedConcepts: ContextConceptProfile[],
): string {
  const baseMessage =
    usageFocus === 'dialogue'
      ? category === 'case_example'
        ? '合意文書に書いた配慮を実施する前に、本人と職場で何を確認しながら調整を進めたかを見る参考になります。'
        : '合意文書に書いた配慮を実施する前に、本人と職場で何を確認するか整理する参考になります。'
      : usageFocus === 'review'
        ? category === 'case_example'
          ? '合意した配慮や支援を実施した後に、何を見直したかを見る参考になります。'
          : '合意した配慮や支援を実施した後に、何を再確認・見直しするか整理する参考になります。'
        : category === 'case_example'
          ? '合意文書に書いた配慮を現場でどう試したかを見る参考になります。'
          : '合意文書に書いた個別調整や支援の具体的な実施方法を広げる参考になります。';

  if (matchedConcepts.length > 0) {
    const focus = matchedConcepts
      .slice(0, 2)
      .map((concept) => concept.label)
      .join('、');

    return `今回の「${focus}」について、${baseMessage}`;
  }

  return baseMessage;
}

function rewritePreviewTitle(
  rawTitle: string,
  record: NormalizedRecord,
  usageFocus: PracticalReferenceUseMode,
  category: PracticalReferencePreviewItem['category'],
  matchedConcepts: ContextConceptProfile[],
): string {
  const normalizedTitle = normalizeText(rawTitle);
  if (!normalizedTitle) return rawTitle;
  const focusPhrase = conceptTitlePhrase(matchedConcepts[0]);

  if (
    record.sourceId === 'askjan_website' &&
    category === 'case_example' &&
    matchedConcepts.length > 0
  ) {
    return `${focusPhrase}の類似事例`;
  }

  if (
    matchedConcepts.length > 0 &&
    (GENERIC_PRACTICAL_TITLE_PATTERNS.some((pattern) => pattern.test(normalizedTitle)) ||
      /including neurodivergent workers:\s*evaluation$/i.test(normalizedTitle))
  ) {
    if (usageFocus === 'dialogue') return `${focusPhrase}を整理する対話ガイド`;
    if (usageFocus === 'review') return `${focusPhrase}の見直しガイド`;
    return `${focusPhrase}の実践ガイド`;
  }

  return rawTitle;
}

function isPracticalReferenceRecord(record: NormalizedRecord | undefined): record is NormalizedRecord {
  if (!record) return false;
  if (!record.filePath.includes(`${path.sep}web-cache${path.sep}`)) return false;
  if (!PRACTICAL_REFERENCE_SOURCE_IDS.has(record.sourceId)) return false;

  const pageType = String(record.interactionContext?.pageType || '').trim();
  if (EXCLUDED_PAGE_TYPES.has(pageType)) return false;
  const sourceUrl = record.interactionContext?.finalUrl || record.interactionContext?.sourceUrl || null;
  if (isLowValuePreviewUrl(sourceUrl)) return false;

  const evidenceScope = String(record.interactionContext?.evidenceScope || '').trim();
  const bodyText = normalizeText(record.text);
  if (isLowValuePreviewText(bodyText) && !hasPracticalActionSignal(bodyText)) return false;

  if (evidenceScope === 'specific_case') return true;
  if (CASE_PAGE_TYPES.has(pageType)) return true;
  if (GUIDANCE_PAGE_TYPES.has(pageType)) return true;

  const accommodationFacets = record.interactionContext?.accommodationFacets || [];
  const supportTypeHints = record.interactionContext?.supportTypeHints || [];
  return accommodationFacets.length > 0 || supportTypeHints.length > 0;
}

function candidateScore(
  hit: EvidenceItem,
  record: NormalizedRecord,
  contextProfile: PracticalReferenceContextProfile,
  matchedConcepts: ContextConceptProfile[],
): number {
  const pageType = String(record.interactionContext?.pageType || '').trim();
  const evidenceScope = String(record.interactionContext?.evidenceScope || '').trim();
  const sourceUrl = record.interactionContext?.finalUrl || record.interactionContext?.sourceUrl || null;
  const combinedText = `${hit.excerpt || ''} ${record.text || ''}`;

  let score = Number(hit.score || 0);
  if (evidenceScope === 'specific_case') score += 100;
  if (CASE_PAGE_TYPES.has(pageType)) score += 40;
  if (pageType === 'employer_guidance_page') score += 18;
  if (pageType === 'employer_toolkit') score += 16;
  if (pageType === 'document') score += 6;
  if (record.sourceId === 'jeed_reference') score += 10;
  if (record.sourceId === 'askjan_website') score += 8;
  if (record.sourceId === 'australia_jobaccess_guidance') score += 6;
  if (record.sourceId === 'uk_headway_brain_injury_work') score += 6;
  if (normalizeText(record.interactionContext?.practicalSummaryJa || '')) score += 12;
  if (normalizeText(record.interactionContext?.practicalTitleJa || '')) score += 8;
  if (hasConcreteAdjustmentSignal(combinedText)) score += 26;
  else if (hasPracticalActionSignal(combinedText)) score += 18;
  if (hasWorkContextSignal(combinedText)) score += 4;
  if (isAbstractProcessGuidance(combinedText) && !hasConcreteAdjustmentSignal(combinedText)) {
    score -= 18;
  }
  if (isLowValuePreviewText(combinedText)) score -= 80;
  if (isLowValuePreviewUrl(sourceUrl)) score -= 100;
  if (matchedConcepts.length > 0) score += matchedConcepts.length * 18;
  if (contextProfile.activeConcepts.length > 0 && matchedConcepts.length === 0) score -= 10;
  return score;
}

function backfillCandidateScore(
  record: NormalizedRecord,
  contextProfile: PracticalReferenceContextProfile,
  matchedConcepts: ContextConceptProfile[],
): number {
  const pageType = String(record.interactionContext?.pageType || '').trim();
  const evidenceScope = String(record.interactionContext?.evidenceScope || '').trim();
  const sourceUrl = record.interactionContext?.finalUrl || record.interactionContext?.sourceUrl || null;
  const combinedText = normalizeText(record.text || '');
  let score = 0;

  if (evidenceScope === 'specific_case') score += 42;
  if (CASE_PAGE_TYPES.has(pageType)) score += 18;
  if (pageType === 'employer_guidance_page') score += 12;
  if (pageType === 'employer_toolkit') score += 10;
  if (pageType === 'document') score += 4;

  if (record.sourceId === 'askjan_website') score += 10;
  if (record.sourceId === 'askearn_employer_guidance') score += 10;
  if (record.sourceId === 'australia_jobaccess_guidance') score += 9;
  if (record.sourceId === 'canada_duty_to_accommodate') score += 9;
  if (record.sourceId === 'uk_headway_brain_injury_work') score += 8;
  if (record.sourceId === 'uk_gov_disability_employment') score += 7;
  if (record.sourceId === 'eu_reasonable_accommodation') score += 6;
  if (record.sourceId === 'jeed_reference') score += 2;
  if (normalizeText(record.interactionContext?.practicalSummaryJa || '')) score += 12;
  if (normalizeText(record.interactionContext?.practicalTitleJa || '')) score += 8;

  if (hasConcreteAdjustmentSignal(combinedText)) score += 24;
  else if (hasPracticalActionSignal(combinedText)) score += 14;
  if (hasWorkContextSignal(combinedText)) score += 4;
  if (isAbstractProcessGuidance(combinedText) && !hasConcreteAdjustmentSignal(combinedText)) {
    score -= 18;
  }
  if (isLowValuePreviewText(combinedText)) score -= 100;
  if (isLowValuePreviewUrl(sourceUrl)) score -= 100;
  if (matchedConcepts.length > 0) score += matchedConcepts.length * 22;
  if (contextProfile.activeConcepts.length > 0 && matchedConcepts.length === 0) score -= 12;

  return score;
}

function buildFallbackHit(
  record: NormalizedRecord,
  contextProfile: PracticalReferenceContextProfile,
  matchedConcepts: ContextConceptProfile[],
): EvidenceItem {
  const bestCandidate = pickBestSummaryCandidate('', record.text || '', contextProfile);
  const excerpt =
    normalizeText(bestCandidate?.candidate || '') ||
    normalizeText(record.text || '').slice(0, 220) ||
    record.filePath;

  return {
    id: record.id,
    sourceId: record.sourceId,
    filePath: record.filePath,
    excerpt,
    score: backfillCandidateScore(record, contextProfile, matchedConcepts),
  };
}

function dedupeKey(hit: EvidenceItem, record: NormalizedRecord): string {
  return (
    normalizeText(record.interactionContext?.finalUrl || '') ||
    normalizeText(record.interactionContext?.sourceUrl || '') ||
    normalizeText(record.filePath) ||
    hit.id
  );
}

function previewIdentityKey(item: PracticalReferencePreviewItem): string {
  return [
    normalizeLookup(item.sourceId),
    normalizeLookup(item.title),
    normalizeLookup(item.usageFocus),
  ].join('::');
}

function collapsePreviewItems(
  items: PracticalReferencePreviewItem[],
  maxItems: number,
): PracticalReferencePreviewItem[] {
  const merged = new Map<string, PracticalReferencePreviewItem>();

  for (const item of items || []) {
    const key = previewIdentityKey(item);
    if (!key) continue;

    if (!merged.has(key)) {
      merged.set(key, item);
      continue;
    }

    const current = merged.get(key);
    if (!current) continue;
    merged.set(key, {
      ...current,
      linkedAccommodationTitles: uniqueStrings([
        ...(current.linkedAccommodationTitles || []),
        ...(item.linkedAccommodationTitles || []),
      ]),
    });
  }

  return [...merged.values()].slice(0, maxItems);
}

function isOverseasSource(sourceId: string): boolean {
  return normalizeText(sourceId) !== 'jeed_reference';
}

function selectDiverseCandidates(
  candidates: PracticalReferenceCandidate[],
  maxItems: number,
): PracticalReferenceCandidate[] {
  const deduped: PracticalReferenceCandidate[] = [];
  const seenKeys = new Set<string>();

  for (const candidate of candidates) {
    const key = dedupeKey(candidate.hit, candidate.record);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    deduped.push(candidate);
  }

  if (deduped.length <= maxItems) return deduped;

  const selected: PracticalReferenceCandidate[] = [];
  const selectedKeys = new Set<string>();
  const usedSources = new Set<string>();
  const sourceCounts = new Map<string, number>();
  const distinctSourceCount = new Set(deduped.map((candidate) => candidate.record.sourceId)).size;
  const targetDiversity = Math.min(maxItems, 4, distinctSourceCount);
  const maxPerSource = distinctSourceCount > 1 ? 1 : maxItems;
  const distinctOverseasSourceCount = new Set(
    deduped
      .filter((candidate) => isOverseasSource(candidate.record.sourceId))
      .map((candidate) => candidate.record.sourceId),
  ).size;
  const targetOverseas = Math.min(maxItems, 2, distinctOverseasSourceCount);

  const pushCandidate = (
    candidate: PracticalReferenceCandidate,
    options?: { distinctSource?: boolean },
  ): boolean => {
    const key = dedupeKey(candidate.hit, candidate.record);
    if (selectedKeys.has(key)) return false;
    if (options?.distinctSource !== false && usedSources.has(candidate.record.sourceId)) return false;
    if (Number(sourceCounts.get(candidate.record.sourceId) || 0) >= maxPerSource) return false;
    selected.push(candidate);
    selectedKeys.add(key);
    usedSources.add(candidate.record.sourceId);
    sourceCounts.set(candidate.record.sourceId, Number(sourceCounts.get(candidate.record.sourceId) || 0) + 1);
    return true;
  };

  const selectByRule = (
    predicate: (candidate: PracticalReferenceCandidate) => boolean,
    ruleLimit: number,
  ) => {
    let added = 0;
    for (const candidate of deduped) {
      if (selected.length >= maxItems || added >= ruleLimit) break;
      if (!predicate(candidate)) continue;
      if (!pushCandidate(candidate)) continue;
      added += 1;
    }
  };

  if (deduped[0]) {
    pushCandidate(deduped[0], { distinctSource: false });
  }

  if (targetOverseas > 0) {
    selectByRule((candidate) => isOverseasSource(candidate.record.sourceId), targetOverseas);
  }

  if (!selected.some((candidate) => resolveCategory(candidate.record) === 'practical_guidance')) {
    selectByRule(
      (candidate) =>
        isOverseasSource(candidate.record.sourceId) &&
        resolveCategory(candidate.record) === 'practical_guidance',
      1,
    );
  }

  for (const candidate of deduped) {
    if (selected.length >= maxItems || usedSources.size >= targetDiversity) break;
    pushCandidate(candidate);
  }

  for (const candidate of deduped) {
    if (selected.length >= maxItems) break;
    pushCandidate(candidate);
  }

  if (selected.length >= maxItems) {
    return selected;
  }

  for (const candidate of deduped) {
    if (selected.length >= maxItems) break;
    const key = dedupeKey(candidate.hit, candidate.record);
    if (selectedKeys.has(key)) continue;
    selected.push(candidate);
    selectedKeys.add(key);
  }

  return selected;
}

function toPreviewItem(
  hit: EvidenceItem,
  record: NormalizedRecord,
  contextProfile: PracticalReferenceContextProfile,
  matchedConcepts: ContextConceptProfile[],
): PracticalReferencePreviewItem {
  const sourceName = getKnowledgeSourceById(record.sourceId)?.name || record.sourceId;
  const pageType = String(record.interactionContext?.pageType || '').trim() || 'unknown';
  const evidenceScope = String(record.interactionContext?.evidenceScope || '').trim() || 'unknown';
  const category = resolveCategory(record);
  const canonicalUsageFocus = normalizeUsageFocus(record.interactionContext?.usageFocus);
  const usageFocus =
    canonicalUsageFocus || determineUsageFocus(`${hit.excerpt || ''} ${record.text || ''}`);
  const rawTitle =
    normalizeText(record.interactionContext?.practicalTitleJa || '') ||
    extractTitleCandidate(hit.excerpt) ||
    extractTitleCandidate(record.text) ||
    extractTitleFromUrl(record.interactionContext?.finalUrl || record.interactionContext?.sourceUrl) ||
    `${sourceName} ${pageTypeLabel(pageType)}`;
  const title = rewritePreviewTitle(rawTitle, record, usageFocus, category, matchedConcepts);
  const canonicalSummary = normalizeText(record.interactionContext?.practicalSummaryJa || '');

  return {
    id: hit.id,
    title,
    summary: canonicalSummary || selectSummaryText(hit.excerpt || '', record.text || '', contextProfile),
    sourceId: record.sourceId,
    sourceName,
    sourceUrl: record.interactionContext?.finalUrl || record.interactionContext?.sourceUrl || null,
    category,
    categoryLabel: category === 'case_example' ? '類似事例' : '実践ガイダンス',
    usageFocus,
    usageFocusLabel: usageFocusLabel(usageFocus),
    whyRelevant: whyRelevant(usageFocus, category, matchedConcepts),
    pageType,
    evidenceScope,
  };
}

async function readRecordsById(): Promise<Map<string, NormalizedRecord>> {
  if (recordsByIdPromise) return recordsByIdPromise;

  recordsByIdPromise = fs
    .readFile(NORMALIZED_RECORDS_PATH, 'utf8')
    .then((raw) => {
      const byId = new Map<string, NormalizedRecord>();
      const lines = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        let row: NormalizedRecord;
        try {
          row = JSON.parse(line) as NormalizedRecord;
        } catch {
          continue;
        }

        const id = normalizeText(row?.id || '');
        if (!id) continue;
        byId.set(id, row);
      }

      return byId;
    })
    .catch(() => new Map<string, NormalizedRecord>());

  return recordsByIdPromise;
}

export function selectPracticalReferencePreview(
  evidence: EvidenceItem[],
  recordsById: Map<string, NormalizedRecord>,
  maxItems = 4,
  context?: PracticalReferenceContext,
): PracticalReferencePreviewItem[] {
  const contextProfile = buildContextProfile(context);
  const activeContextKeys = activeContextKeySet(contextProfile);
  const evidenceCandidates = (evidence || [])
    .map((hit) => {
      const record = recordsById.get(hit.id);
      if (!isPracticalReferenceRecord(record)) return null;
      const hitText = normalizeText(hit.excerpt || '');
      if (isLowValuePreviewText(hitText) && !hasConcreteAdjustmentSignal(hitText)) {
        return null;
      }
      const combinedText = `${hit.excerpt || ''} ${record.text || ''}`;
      if (blockedBySourceContextGate(record.sourceId, combinedText, activeContextKeys)) {
        return null;
      }
      const matchedConcepts = matchedContextConcepts(
        record,
        combinedText,
        contextProfile,
      );
      return {
        hit,
        record,
        matchedConcepts,
        score: candidateScore(hit, record, contextProfile, matchedConcepts),
      };
    })
    .filter((item): item is PracticalReferenceCandidate => Boolean(item))
    .sort((a, b) => b.score - a.score);
  const evidenceRecordIds = new Set(evidenceCandidates.map((item) => item.record.id));
  const fallbackCandidates = [...recordsById.values()]
    .filter((record) => !evidenceRecordIds.has(record.id))
    .filter((record) => isPracticalReferenceRecord(record))
    .map((record) => {
      const combinedText = normalizeText(record.text || '');
      if (blockedBySourceContextGate(record.sourceId, combinedText, activeContextKeys)) {
        return null;
      }
      const matchedConcepts = matchedContextConcepts(record, combinedText, contextProfile);
      if (
        contextProfile.activeConcepts.length > 0 &&
        matchedConcepts.length === 0 &&
        !hasConcreteAdjustmentSignal(combinedText)
      ) {
        return null;
      }
      const hit = buildFallbackHit(record, contextProfile, matchedConcepts);
      if (hit.score < 18) return null;
      return {
        hit,
        record,
        matchedConcepts,
        score: hit.score,
      };
    })
    .filter((item): item is PracticalReferenceCandidate => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  const selected = selectDiverseCandidates(
    [...evidenceCandidates, ...fallbackCandidates].sort((a, b) => b.score - a.score),
    maxItems,
  );

  return collapsePreviewItems(
    selected.map((candidate) =>
      toPreviewItem(candidate.hit, candidate.record, contextProfile, candidate.matchedConcepts),
    ),
    maxItems,
  );
}

export async function buildPracticalReferencePreview(
  evidence: EvidenceItem[],
  maxItems = 4,
  context?: PracticalReferenceContext,
): Promise<PracticalReferencePreviewItem[]> {
  const recordsById = await readRecordsById();
  return selectPracticalReferencePreview(evidence, recordsById, maxItems, context);
}
