import {
  REGIONAL_SUPPORT_EVIDENCE_DESCRIPTION,
  REGIONAL_SUPPORT_EVIDENCE_ROLE_LABEL,
} from '@/lib/jac/regionalSupportPositioning';

export type EvidencePresentationRole =
  | 'direct_basis'
  | 'conditional_hypothesis'
  | 'support_catalog'
  | 'related_reading';

export type EvidencePresentationDetail = {
  evidence_role?: string | null;
  evidence_lane?: string | null;
  note_type?: string | null;
  is_partial?: boolean;
  public_safe?: boolean | null;
  trust_tiers?: string[] | null;
  evidence_scopes?: string[] | null;
  page_types?: string[] | null;
};

export type EvidencePresentationCitation<T extends EvidencePresentationDetail> = {
  claim?: string | null;
  evidence_details?: T[] | null;
};

type MergeableEvidenceLane = {
  evidence_id?: string | null;
  lane?: string | null;
  label?: string | null;
};

type MergeableCitation<T extends EvidencePresentationDetail> = EvidencePresentationCitation<T> & {
  evidence_ids?: string[] | null;
  evidence_lanes?: MergeableEvidenceLane[] | null;
};

export type ReferencePracticeStage = 'dialogue' | 'trial' | 'review';

export type EvidencePresentationContext = {
  consultationText?: string;
  selectedTags?: string[];
  followUpAnswers?: string[];
  selectedAccommodationTitles?: string[];
};

export const EVIDENCE_PRESENTATION_ROLE_LABEL: Record<EvidencePresentationRole, string> = {
  direct_basis: '見立ての根拠',
  conditional_hypothesis: '条件付き仮説',
  support_catalog: REGIONAL_SUPPORT_EVIDENCE_ROLE_LABEL,
  related_reading: '具体策の参考資料',
};

export const EVIDENCE_PRESENTATION_ROLE_DESCRIPTION: Record<EvidencePresentationRole, string> = {
  direct_basis: '最終文面の直接根拠として参照できる資料です。',
  conditional_hypothesis: '文脈確認を前提に解釈や追加質問へつなぐ資料です。',
  support_catalog: REGIONAL_SUPPORT_EVIDENCE_DESCRIPTION,
  related_reading: 'web-cache やガイダンス由来の、個別調整を具体化するための参考資料です。',
};

const ROLE_ORDER: EvidencePresentationRole[] = [
  'direct_basis',
  'conditional_hypothesis',
  'support_catalog',
  'related_reading',
];

type ContextConceptProfile = {
  key: string;
  label: string;
  referenceTitle: string;
  contextPatterns: RegExp[];
  citationPatterns: RegExp[];
};

type SourceContextGate = {
  sourceId: string;
  requiredContextKeys: string[];
  patterns: RegExp[];
};

const CITATION_CONTEXT_PROFILES: ContextConceptProfile[] = [
  {
    key: 'schedule_pacing',
    label: '勤務時間・疲労',
    referenceTitle: '勤務時間・休憩を調整する具体策',
    contextPatterns: [
      /勤務時間|勤務日数|フルタイム|短時間|シフト|夜勤|勤務時刻|残業|連続勤務/i,
      /休憩|疲労|倦怠|睡眠|通院|治療|生活リズム/i,
    ],
    citationPatterns: [
      /work schedules?|working time|flexible working|flexible schedule|shift|hours/i,
      /breaks?\b|rest\b|fatigue|energy levels?|treatment schedules?/i,
      /短時間|勤務時間|休憩|シフト|残業/i,
    ],
  },
  {
    key: 'cognitive_instruction',
    label: '手順・認知負荷',
    referenceTitle: '手順・指示を明確化する具体策',
    contextPatterns: [
      /集中作業|思考作業|文章作成|読解|マルチタスク|切替|記憶保持/i,
      /注意集中|認知負荷|発達特性|知的特性|高次脳機能|理解速度|手順保持/i,
      /指示・連絡の明確さ|手順書|見本|確認/i,
    ],
    citationPatterns: [
      /written instructions?|task lists?|checklists?|labels?|reminders?/i,
      /memory|comprehension|structure|step\s+\d+|step-by-step|planning|organi[sz]e/i,
      /手順|指示|確認|段取り/i,
    ],
  },
  {
    key: 'sensory_environment',
    label: '感覚・環境',
    referenceTitle: '感覚・環境負荷を調整する具体策',
    contextPatterns: [
      /感覚過敏|視覚負荷|聴覚負荷|騒音|光|温度|空調|画面/i,
      /字幕|文字起こし|読み上げ|アクセシビリティ/i,
    ],
    citationPatterns: [
      /lighting|noise|temperature|thermostat|screen reader|captions?|text communication/i,
      /workspace|environment|visual|audio|acoustic/i,
      /照明|騒音|温度|字幕|読み上げ/i,
    ],
  },
  {
    key: 'physical_access',
    label: '身体負荷・物理アクセス',
    referenceTitle: '身体負荷・動線を調整する具体策',
    contextPatterns: [
      /移動|外出|現場|身体操作|実作業負荷|立位|運搬|手作業/i,
      /姿勢|椅子|机|通勤負荷|段差|エレベータ|トイレ|物理アクセス/i,
      /痛み|内部障害/i,
    ],
    citationPatterns: [
      /physical changes?|workspace|equipment|ergonomic|chair|desk|lifting|standing|mobility/i,
      /access|accessible|physical|transport/i,
      /姿勢|椅子|机|動線|物理/i,
    ],
  },
  {
    key: 'communication_social',
    label: '会議・対話',
    referenceTitle: '会議・対話を支える具体策',
    contextPatterns: [
      /会議|対話|接客|電話|窓口対応|対人調整|感情労働|同席人数/i,
      /聴覚負荷|字幕・文字起こし・テキスト連絡導線/i,
    ],
    citationPatterns: [
      /communication|interpreter|meeting|phone|customer|deaf|hard of hearing/i,
      /captions?|text communication|sign language|written follow-up/i,
      /会議|対話|電話|字幕|手話/i,
    ],
  },
  {
    key: 'safety_emergency',
    label: '安全・急変リスク',
    referenceTitle: '安全面を先に整える具体策',
    contextPatterns: [/安全|危険業務|緊急対応|発作|急変リスク/i],
    citationPatterns: [
      /safety|emergency|risk|safe at work|health and safety/i,
      /危険|安全|急変/i,
    ],
  },
  {
    key: 'adjustment_review',
    label: '調整後の見直し',
    referenceTitle: '調整後の見直しポイント',
    contextPatterns: [/見直し|再評価|フォローアップ|効果確認|運用後|定期レビュー|試行後/i],
    citationPatterns: [
      /review accommodations?|reassess|follow-?up|monitor|evaluate|make continual improvements/i,
      /見直し|再評価|フォローアップ|効果確認/i,
    ],
  },
  {
    key: 'coordination_process',
    label: '調整の進め方',
    referenceTitle: '本人と職場で調整案をすり合わせる具体策',
    contextPatterns: [
      /個別調整|配慮依頼|職場との相談|上司との相談|説明|共有|合意|見直し|試行|フィードバック/i,
      /面談|確認事項|追加確認|すり合わせ/i,
    ],
    citationPatterns: [
      /talk to the employee|meet with your employee|find timely solutions|ask(?:ed)? for input|seek(?:ing)? feedback/i,
      /functional abilities|restrictions|limitations|review accommodations?|reassess|follow-?up|document/i,
      /調整|見直し|確認|合意|面談/i,
    ],
  },
  {
    key: 'mental_health',
    label: 'メンタル負荷',
    referenceTitle: 'メンタル負荷を下げる具体策',
    contextPatterns: [/不安|緊張|メンタル負荷|精神症状|mental health|ptsd|substance/i],
    citationPatterns: [
      /mental health|well-being|psychological|stress|anxiety|supportive workplace/i,
      /心理|不安|緊張|メンタル/i,
    ],
  },
];

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

const PRACTICAL_REFERENCE_SIGNAL_PATTERNS = [
  /written instructions?|task lists?|checklists?|labels?|reminders?/i,
  /adjust(?:ing)? work schedules?|flexible working(?: time| arrangements?)?/i,
  /change(?:s)? work (?:methods|tasks|processes)|swapping tasks?/i,
  /new or different equipment|assistive|technology|screen reader/i,
  /lighting|noise|thermostat|breaks?\b|workspace/i,
  /communication|interpreter|captions?|sign language|written follow-?up/i,
  /explicit positive feedback|step-by-step\s+(?:instructions?|guide|process|tasks?|checklist)|support plan template/i,
  /physical changes?|ergonomic|chair|desk|lifting|standing|mobility/i,
  /meet with your employee|ask(?:ed)? for input|functional abilities|restrictions/i,
  /配慮|支援|手順|指示|確認|勤務時間|休憩|環境調整/i,
];
const CONCRETE_REFERENCE_ACTION_PATTERNS = [
  /(?:talk|meet|discuss|review|reassess|document|follow-?up|clarify|confirm|identify|gather)\b.{0,90}\b(?:employee|manager|barriers?|needs?|limitations?|restrictions?|adjustments?|solutions?|input|feedback|functional abilities)\b/i,
  /(?:provide|install|adjust|allow|change|swap|modify|schedule|set up|create|use)\b.{0,100}\b(?:written instructions?|task lists?|checklists?|labels?|reminders?|breaks?|lighting|noise|temperature|captions?|sign language|interpreter|screen reader|equipment|ergonomic|chair|desk|telework|workspace)\b/i,
  /\b(?:flexible working time|written instructions?|task lists?|checklists?|labels?|reminders?|rest breaks?|captions?|sign language|interpreter|screen reader|ergonomic|telework|functional abilities|restrictions|timely solutions)\b/i,
];
const DIALOGUE_REFERENCE_PATTERNS = [
  /talk to the employee|meet with your employee|discuss|talk with|ask(?:ed)? for input|gather relevant information|find timely solutions/i,
  /functional abilities|restrictions|limitations|barriers/i,
  /調整|面談|確認|合意|共有|すり合わせ/i,
];
const REVIEW_REFERENCE_PATTERNS = [
  /review accommodations?|reassess|follow-?up|monitor|evaluate|make continual improvements/i,
  /見直し|再評価|フォローアップ|効果確認|定期レビュー|振り返り/i,
];
const ABSTRACT_REFERENCE_PROCESS_PATTERNS = [
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

const LOW_VALUE_REFERENCE_TEXT_PATTERNS = [
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
  /^it normally involves using photo id\b/i,
  /^you(?:’|')ll need a letter confirming your grant\b/i,
  /^what you need to claim\b/i,
  /^for example, about your condition, how it affects your work and what support you think you need\b/i,
  /^if you(?:’|')re a civil servant\b/i,
  /^people with this disorder have these symptoms for longer than one month\b/i,
  /^your disability, illness or health condition you must have\b/i,
  /^you can apply for access to work if you need extra help\b/i,
  /^in addition to the toolkit, earn offers this short course\b/i,
  /^learning center the purpose of this toolkit is to help small businesses\b/i,
  /^small business administration\b/i,
  /^getting started\s*\/\s*publications\b/i,
  /^department of labor(?:['’]|&rsquo;)?s office of disability employment policy \(odep\) under cooperative agreement no\.?$/i,
  /^resources to support accessible ict\b/i,
  /^to address this shortfall, some companies have implemented programs focused on recruiting and hiring neurodivergent people\.?$/i,
  /^providing workplace accommodations yields multiple benefits for employers, including retaining valuable employees, improving overall production and morale, and reducing workers(?:’|') compensation and training costs\.?$/i,
  /^managing such a workforce requires employers to understand disability-related laws, implement effective accommodation policies and procedures, prioritize accessibility, and provide quality jobs for all employees\.?$/i,
  /^the employer assistance and resource network on disability \(earn\) is a resource for employers seeking to recruit, hire, retain, and advance qualified employees with disabilities\.?$/i,
  /^reasonable accommodation is any change to a job or a work environment/i,
  /^the company retained a highly skilled it professional/i,
  /^examples of systemic measures\b/i,
  /^benefit for the employer\b/i,
  /^figure 1: accommodation process diagram\b/i,
  /^the diagram below assumes that the canada labour code\b/i,
  /^accommodation will normally involve the coordination of activities such as assessment and purchase of adaptive equipment\b/i,
  /^check your responsibilities when you take on someone with a different employment status/i,
  /^check who counts as an employee\b/i,
  /^the duty to accommodate is a legal obligation\b/i,
  /^accommodations that are not satisfactoryrequire adjustments and modifications\b/i,
  /^a bona fide occupational requirement is a requirement\b/i,
  /^this applies to all workers, including trainees, apprentices, contract workers and business partners\.?$/i,
  /^this page is part of get ready to employ someone for the first time: step by step\b/i,
  /^we(?:['’]|d|’d)\s+like to set additional cookies to understand how you use gov\.uk, remember your settings and improve government services\.?$/i,
  /^these supports should help them perform job functions efficiently and safely\.?$/i,
  /^this may be inaccurately perceived by others as a performance issue\.?$/i,
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

const LOW_VALUE_REFERENCE_URL_PATTERNS = [
  /\/(?:statistics-on-disability|federal-government-employment|build-a-pipeline-outreach-and-recruitment|lead-the-way-supportive-business-culture|why-hire-people-with-disabilities|small-business-toolkit|resources-on-mental-health-and-employment|neurodiversity-hiring-initiatives-and-partnerships|communicate-external-and-internal-communication-of-company-policies-and-practices)(?:$|[?#])/i,
  /\/page\/(?:mental-health-toolkit|disability-at-work-framework|small-business-guide-mh-sud|learning-guide-mental-well-being-of-gen-z-workers|accommodation-and-accessibility-benefits|learn-about-successful-programs|benefit-your-business-through-disability-employment|benefits-of-neurodiversity-in-the-workplace|employee-benefits-of-neurodiversity|organizational-benefits-of-neurodiversity|disability-employment-in-the-workplace|hire-and-keep-the-best-talent-acquisition-and-retention-processes|accessibility-program|measure-success-accountability|linking-accessibility-and-accommodation|create-a-mental-health-friendly-workplace|substance-use-disorder-in-the-workplace|about-the-issue|the-rehabilitation-act-of-1973-rehab-act|defining-neurodiversity-and-neurodivergence|neurodiversity-in-the-workplace)(?:$|[?#])/i,
  /\/page\/(?:disability-at-work-resources|accommodation-and-accessibility-resources|accommodation-and-accessibility-acing-the-basics|accommodation-and-accessibility-toolkit)(?:$|[?#])/i,
  /\/learning-center\/course\/mental-health-friendly-workplace(?:$|[?#])/i,
  /\/access-to-work(?:$|[?#])/i,
  /\/access-to-work\/eligibility(?:$|[?#])/i,
  /\/access-to-work\/(?:apply|after-you-apply|claiming-from-your-grant|renew)(?:$|[?#])/i,
  /\/welfare-benefits\//i,
  /\/(?:health-wellness-public-servants\.html|employee-wellness-resource\.html|fundamentals-duty-accommodate-roles-responsibilities\.html|duty-accommodate-general-process-managers\.html)(?:$|[?#])/i,
  /\/health-wellness-public-servants\/disability-management\/(?:how-to-build-disability-management-program|handling-disability-management-cases-tool|fundamentals)(?:\.html)?(?:$|[?#])/i,
  /government-canada-workplace-accessibility-passport(?:\.html)?(?:$|[?#]|\/)/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/(?:Formen-der-Hilfe-fuer-Menschen-mit-Behinderungen|Leistungen-nach-dem-SGB-IX|Beratungsleistungen)\//i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/(?:Behindertenrechtskonvention-der-Vereinten-Nationen|Politik-Menschen-Behinderungen|Assistenzhunde)\//i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/politik-fuer-menschen-mit-behinderungen\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Rehabilitation-und-Teilhabe\/Was-ist-Teilhabe-von-Menschen-mit-Behinderungen\/[^/?#]+\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Rehabilitation-und-Teilhabe\/rehabilitation-und-teilhabe\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Rehabilitation-und-Teilhabe\/Rehabilitation-Teilhabe\/rehabilitation-teilhabe\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/teilhabe-und-inklusion\.html(?:$|[?#])/i,
  /\/DE\/Soziales\/Teilhabe-und-Inklusion\/Politik-fuer-Menschen-mit-Behinderungen\/Beschaeftigung-schwerbehinderter-Menschen\/[^/?#]+\.html(?:$|[?#])/i,
  /gesetze-im-internet\.de\/englisch_agg\/englisch_agg\.html(?:$|[?#])/i,
  /antidiskriminierungsstelle\.de\/DE\/ueber-diskriminierung\//i,
  /\/learn-benefits-hiring\/benefits-employing-disability(?:$|[?#])/i,
  /\/know-rights-responsibilities\/(?:guidelines-discrimination|privacy-staff-disability)(?:$|[?#])/i,
  /\/hire-someone-disability\/(?:help-recruit-and-hire-people|taking-apprentice-disability)(?:$|[?#])/i,
  /\/i-am-a-person-with-disability\/working-or-about-start-work\/your-rights-and-responsibilities(?:$|[?#])/i,
  /\/i-am-a-person-with-disability\/working-or-about-start-work\/getting-started-new-job(?:$|[?#])/i,
];

const GENERIC_REFERENCE_CLAIM_PATTERNS = [
  /^参考資料/i,
  /^資料/i,
  /^参考/i,
  /^勤務設計の参考/i,
  /^個別調整の参考/i,
  /^支援設計の参考/i,
  /^一般的な/i,
  /^職場文化/i,
];

function normalizeText(value: string): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function splitSentences(value: string): string[] {
  return normalizeText(value)
    .split(/(?<=[。.!?！？])\s+|\n+/)
    .map((segment) => normalizeText(segment))
    .filter(Boolean);
}

function summarizeText(value: string, maxChars = 180): string {
  const normalized = normalizeText(value);
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars - 1).trim()}…`;
}

function buildContextText(context?: EvidencePresentationContext): string {
  return [
    context?.consultationText || '',
    ...(context?.selectedTags || []),
    ...(context?.followUpAnswers || []),
    ...(context?.selectedAccommodationTitles || []),
  ]
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .join(' ');
}

function activeContextProfiles(context?: EvidencePresentationContext): ContextConceptProfile[] {
  const contextText = buildContextText(context);
  if (!contextText) return [];
  return CITATION_CONTEXT_PROFILES.filter((profile) =>
    profile.contextPatterns.some((pattern) => pattern.test(contextText)),
  );
}

function activeContextKeySet(context?: EvidencePresentationContext): Set<string> {
  return new Set(activeContextProfiles(context).map((profile) => profile.key));
}

function matchedProfilesForText(
  text: string,
  context?: EvidencePresentationContext,
): ContextConceptProfile[] {
  const profiles = activeContextProfiles(context);
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return profiles.filter((profile) =>
    profile.citationPatterns.some((pattern) => pattern.test(normalized)),
  );
}

function citationSearchText<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
): string {
  const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
  const parts = [normalizeText(String(citation.claim || ''))];

  for (const detail of details) {
    const anyDetail = detail as T & {
      summary?: string | null;
      conditions?: string[] | null;
      source_names?: string[] | null;
      sample_excerpts?: Array<{ excerpt?: string | null }> | null;
    };

    parts.push(normalizeText(String(anyDetail.summary || '')));
    parts.push(...(anyDetail.conditions || []).map((value) => normalizeText(String(value || ''))));
    parts.push(...(anyDetail.source_names || []).map((value) => normalizeText(String(value || ''))));
    parts.push(
      ...(anyDetail.sample_excerpts || []).map((item) => normalizeText(String(item?.excerpt || ''))),
    );
  }

  return parts.filter(Boolean).join(' ');
}

function citationSourceUrls<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
): string[] {
  const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
  const urls: string[] = [];

  for (const detail of details) {
    const anyDetail = detail as T & {
      source_urls?: string[] | null;
      sample_excerpts?: Array<{ source_url?: string | null }> | null;
    };

    urls.push(...(anyDetail.source_urls || []).map((value) => normalizeText(String(value || ''))));
    urls.push(
      ...(anyDetail.sample_excerpts || []).map((item) => normalizeText(String(item?.source_url || ''))),
    );
  }

  return [...new Set(urls.filter(Boolean))];
}

function citationSourceIds<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
): string[] {
  const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
  const sourceIds: string[] = [];

  for (const detail of details) {
    const anyDetail = detail as T & {
      source_ids?: string[] | null;
      sample_excerpts?: Array<{ source_id?: string | null }> | null;
    };

    sourceIds.push(...(anyDetail.source_ids || []).map((value) => normalizeText(String(value || ''))));
    sourceIds.push(
      ...(anyDetail.sample_excerpts || []).map((item) => normalizeText(String(item?.source_id || ''))),
    );
  }

  return [...new Set(sourceIds.filter(Boolean))];
}

function blockedBySourceContextGate(
  sourceIds: string[],
  text: string,
  activeContextKeys: Set<string>,
): boolean {
  const normalized = normalizeText(text);
  if (!normalized || sourceIds.length === 0) return false;

  return SOURCE_CONTEXT_GATES.some((gate) => {
    if (!sourceIds.includes(gate.sourceId)) return false;
    if (!gate.patterns.some((pattern) => pattern.test(normalized))) return false;
    return !gate.requiredContextKeys.some((key) => activeContextKeys.has(key));
  });
}

function detailSearchText<T extends EvidencePresentationDetail>(detail: T): string {
  const anyDetail = detail as T & {
    summary?: string | null;
    conditions?: string[] | null;
    sample_excerpts?: Array<{
      excerpt?: string | null;
      practical_title_ja?: string | null;
      practical_summary_ja?: string | null;
      usage_focus?: string | null;
    }> | null;
  };

  return [
    normalizeText(String(anyDetail.summary || '')),
    ...(anyDetail.conditions || []).map((value) => normalizeText(String(value || ''))),
    ...(anyDetail.sample_excerpts || []).flatMap((item) => [
      normalizeText(String(item?.practical_title_ja || '')),
      normalizeText(String(item?.practical_summary_ja || '')),
      normalizeText(String(item?.usage_focus || '')),
      normalizeText(String(item?.excerpt || '')),
    ]),
  ]
    .filter(Boolean)
    .join(' ');
}

function practiceStageFromCanonicalSampleExcerpts<T extends EvidencePresentationDetail>(
  detail: T,
): ReferencePracticeStage | null {
  const anyDetail = detail as T & {
    sample_excerpts?: Array<{
      usage_focus?: string | null;
      practical_summary_ja?: string | null;
      practical_title_ja?: string | null;
    }> | null;
  };
  const sampleExcerpts = Array.isArray(anyDetail.sample_excerpts) ? anyDetail.sample_excerpts : [];
  for (const excerpt of sampleExcerpts) {
    const usageFocus = normalizeText(String(excerpt?.usage_focus || ''));
    if (usageFocus === 'dialogue' || usageFocus === 'trial' || usageFocus === 'review') {
      return usageFocus;
    }
    const practicalSummary = normalizeText(String(excerpt?.practical_summary_ja || ''));
    if (practicalSummary.startsWith('対話で確認:')) return 'dialogue';
    if (practicalSummary.startsWith('見直しの観点:')) return 'review';
    if (practicalSummary.startsWith('試し方の例:')) return 'trial';
    const practicalTitle = normalizeText(String(excerpt?.practical_title_ja || ''));
    if (practicalTitle.includes('対話ガイド')) return 'dialogue';
    if (practicalTitle.includes('見直しガイド')) return 'review';
    if (practicalTitle.includes('実践ガイド') || practicalTitle.includes('実践ヒント')) {
      return 'trial';
    }
  }
  return null;
}

function hasPracticalReferenceSignal(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return PRACTICAL_REFERENCE_SIGNAL_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasConcreteReferenceActionSignal(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return CONCRETE_REFERENCE_ACTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isAbstractReferenceProcessText(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return ABSTRACT_REFERENCE_PROCESS_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isLowValueReferenceText(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return LOW_VALUE_REFERENCE_TEXT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isLowValueReferenceUrl(url: string): boolean {
  const normalized = normalizeText(url).toLowerCase();
  if (!normalized) return false;
  return LOW_VALUE_REFERENCE_URL_PATTERNS.some((pattern) => pattern.test(normalized));
}

function determineReferencePracticeStage(text: string): ReferencePracticeStage {
  const normalized = normalizeText(text);
  if (!normalized) return 'trial';
  if (DIALOGUE_REFERENCE_PATTERNS.some((pattern) => pattern.test(normalized))) return 'dialogue';
  if (REVIEW_REFERENCE_PATTERNS.some((pattern) => pattern.test(normalized))) return 'review';
  return 'trial';
}

function referencePracticeStageLabel(stage: ReferencePracticeStage): string {
  if (stage === 'dialogue') return '対話の軸';
  if (stage === 'review') return '見直しの軸';
  return '試行候補';
}

function rewriteReferenceSummaryToJapanese(
  value: string,
  stage?: ReferencePracticeStage,
): string | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  if (DIALOGUE_REFERENCE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。';
  }
  if (REVIEW_REFERENCE_PATTERNS.some((pattern) => pattern.test(normalized))) {
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

  const fallbackStage = stage || determineReferencePracticeStage(normalized);
  if (fallbackStage === 'dialogue') {
    return '対話で確認: 本人と職場で、必要な配慮と実施条件をすり合わせる。';
  }
  if (fallbackStage === 'review') {
    return '見直しの観点: 調整後に効果と負担を確認し、運用を見直す。';
  }
  return '試し方の例: 今回の状況で小さく試せる調整候補を広げる。';
}

function practicalReferenceTitleFromText(
  text: string,
  matchedProfiles: ContextConceptProfile[],
): string {
  const normalized = normalizeText(text);

  if (
    /work schedules?|working time|flexible working|flexible schedule|shift|hours|breaks?\b|rest\b|fatigue|energy levels?|treatment schedules?|短時間|勤務時間|休憩|シフト|残業/i.test(
      normalized,
    )
  ) {
    return '勤務時間・休憩を調整する具体策';
  }
  if (
    /review accommodations?|reassess|follow-?up|monitor|evaluate|make continual improvements|見直し|再評価|フォローアップ|効果確認/i.test(
      normalized,
    )
  ) {
    return '調整後の見直しポイント';
  }
  if (
    /talk to the employee|meet with your employee|find timely solutions|ask(?:ed)? for input|seek(?:ing)? feedback|functional abilities|restrictions|limitations|review accommodations?|reassess|follow-?up|document|調整|見直し|確認|合意|面談/i.test(
      normalized,
    )
  ) {
    return '本人と職場で調整案をすり合わせる具体策';
  }
  if (
    /written instructions?|task lists?|checklists?|labels?|reminders?|memory|comprehension|structure|step\s+\d+|step-by-step|planning|organi[sz]e|手順|指示|確認|段取り/i.test(
      normalized,
    )
  ) {
    return '手順・指示を明確化する具体策';
  }
  if (
    /lighting|noise|temperature|thermostat|screen reader|captions?|text communication|workspace|environment|visual|audio|acoustic|照明|騒音|温度|字幕|読み上げ/i.test(
      normalized,
    )
  ) {
    return '感覚・環境負荷を調整する具体策';
  }
  if (
    /physical changes?|ergonomic|chair|desk|lifting|standing|mobility|access|accessible|transport|姿勢|椅子|机|動線|物理/i.test(
      normalized,
    )
  ) {
    return '身体負荷・動線を調整する具体策';
  }
  if (
    /communication|interpreter|meeting|phone|customer|deaf|hard of hearing|sign language|written follow-up|会議|対話|電話|手話/i.test(
      normalized,
    )
  ) {
    return '会議・対話を支える具体策';
  }
  if (/safety|emergency|risk|safe at work|health and safety|危険|安全|急変/i.test(normalized)) {
    return '安全面を先に整える具体策';
  }
  if (
    /mental health|well-being|psychological|stress|anxiety|supportive workplace|心理|不安|緊張|メンタル/i.test(
      normalized,
    )
  ) {
    return 'メンタル負荷を下げる具体策';
  }

  if (matchedProfiles.length > 0) {
    return matchedProfiles[0].referenceTitle;
  }

  return '個別調整の具体策候補';
}

function shouldRewriteReferenceClaim(
  claim: string,
  matchedProfiles: ContextConceptProfile[],
  searchText: string,
): boolean {
  const normalized = normalizeText(claim);
  if (!normalized) return true;
  if (GENERIC_REFERENCE_CLAIM_PATTERNS.some((pattern) => pattern.test(normalized))) return true;
  if (normalized.length > 32) return true;
  if (hasConcreteReferenceActionSignal(searchText)) return true;
  if (!hasPracticalReferenceSignal(normalized) && matchedProfiles.length > 0) return true;
  return false;
}

function isRelatedReadingOnlyCitation<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
): boolean {
  const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
  return (
    details.length > 0 &&
    details.every((detail) => resolveEvidencePresentationRole(detail) === 'related_reading')
  );
}

function detailMergeKey<T extends EvidencePresentationDetail>(detail: T): string {
  const anyDetail = detail as T & {
    evidence_id?: string | null;
    source_urls?: string[] | null;
    sample_excerpts?: Array<{ source_url?: string | null; record_id?: string | null }> | null;
    summary?: string | null;
  };

  return (
    normalizeText(String(anyDetail.evidence_id || '')) ||
    normalizeText(String(anyDetail.source_urls?.[0] || '')) ||
    normalizeText(String(anyDetail.sample_excerpts?.[0]?.source_url || '')) ||
    normalizeText(String(anyDetail.sample_excerpts?.[0]?.record_id || '')) ||
    normalizeText(String(anyDetail.summary || ''))
  );
}

function laneMergeKey(lane: MergeableEvidenceLane): string {
  return [
    normalizeText(String(lane?.evidence_id || '')),
    normalizeText(String(lane?.lane || '')),
    normalizeText(String(lane?.label || '')),
  ]
    .filter(Boolean)
    .join('|');
}

function rewriteReferenceCitationClaim<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
  details: T[],
  context?: EvidencePresentationContext,
): string {
  const existingClaim = normalizeText(String(citation.claim || ''));
  const searchText = citationSearchText({ ...citation, evidence_details: details });
  const matchedProfiles = matchedProfilesForText(searchText, context);

  if (!shouldRewriteReferenceClaim(existingClaim, matchedProfiles, searchText)) {
    return existingClaim;
  }

  return practicalReferenceTitleFromText(searchText, matchedProfiles);
}

function scoreReferenceCandidate(
  value: string,
  context?: EvidencePresentationContext,
  options?: { fromExcerpt?: boolean },
): number {
  const normalized = normalizeText(value);
  if (!normalized) return Number.NEGATIVE_INFINITY;
  if (isLowValueReferenceText(normalized)) return -100;

  let score = 0;
  if (hasConcreteReferenceActionSignal(normalized)) score += 16;
  else if (hasPracticalReferenceSignal(normalized)) score += 12;
  if (options?.fromExcerpt) score += 2;
  if (isAbstractReferenceProcessText(normalized) && !hasConcreteReferenceActionSignal(normalized)) {
    score -= 10;
  }

  const profiles = activeContextProfiles(context);
  for (const profile of profiles) {
    if (profile.citationPatterns.some((pattern) => pattern.test(normalized))) {
      score += 8;
    }
  }

  if (/(for example|include:|might include:|could include:|step\s+\d+:)/i.test(normalized)) {
    score += 3;
  }

  const length = normalized.length;
  if (length >= 36 && length <= 220) score += 3;
  else if (length >= 20 && length <= 260) score += 1;
  else score -= 2;

  return score;
}

function scoreReferenceDetailByContext<T extends EvidencePresentationDetail>(
  detail: T,
  context?: EvidencePresentationContext,
): number {
  const text = detailSearchText(detail);
  if (!text) return Number.NEGATIVE_INFINITY;

  let score = scoreReferenceCandidate(text, context);
  score += matchedProfilesForText(text, context).length * 4;
  if (hasConcreteReferenceActionSignal(text)) score += 4;

  const anyDetail = detail as T & { source_urls?: string[] | null };
  const urls = Array.isArray(anyDetail.source_urls) ? anyDetail.source_urls : [];
  if (urls.some((url) => !isLowValueReferenceUrl(String(url || '')))) score += 2;

  return score;
}

function sortReferenceDetailsByContext<T extends EvidencePresentationDetail>(
  details: T[],
  context?: EvidencePresentationContext,
): T[] {
  return [...(details || [])].sort((a, b) => {
    const scoreDiff = scoreReferenceDetailByContext(b, context) - scoreReferenceDetailByContext(a, context);
    if (scoreDiff !== 0) return scoreDiff;
    return normalizeText(detailSearchText(b)).length - normalizeText(detailSearchText(a)).length;
  });
}

function selectReferenceDetailSummary<T extends EvidencePresentationDetail>(
  detail: T,
  context?: EvidencePresentationContext,
): string {
  const anyDetail = detail as T & {
    summary?: string | null;
    conditions?: string[] | null;
    sample_excerpts?: Array<{
      excerpt?: string | null;
      practical_title_ja?: string | null;
      practical_summary_ja?: string | null;
    }> | null;
  };
  const canonicalSummaryCandidates = (anyDetail.sample_excerpts || [])
    .flatMap((item) => [
      normalizeText(String(item?.practical_summary_ja || '')),
      normalizeText(String(item?.practical_title_ja || '')),
    ])
    .filter(Boolean);
  if (canonicalSummaryCandidates.length > 0) {
    return summarizeText(canonicalSummaryCandidates[0]);
  }

  const candidates = [
    ...splitSentences(String(anyDetail.summary || '')).map((candidate) => ({
      candidate,
      fromExcerpt: false,
    })),
    ...(anyDetail.conditions || []).flatMap((value) =>
      splitSentences(String(value || '')).map((candidate) => ({ candidate, fromExcerpt: false })),
    ),
    ...(anyDetail.sample_excerpts || []).flatMap((item) =>
      splitSentences(String(item?.excerpt || '')).map((candidate) => ({ candidate, fromExcerpt: true })),
    ),
  ];

  const best = candidates
    .map((item) => ({
      ...item,
      score: scoreReferenceCandidate(item.candidate, context, { fromExcerpt: item.fromExcerpt }),
    }));
  const concreteCandidates = best.filter((item) => hasConcreteReferenceActionSignal(item.candidate));
  const topCandidate = (concreteCandidates.length > 0 ? concreteCandidates : best).sort(
    (a, b) => b.score - a.score,
  )[0];

  if (topCandidate && topCandidate.score > -20) {
    const stage = determineReferencePracticeStage(topCandidate.candidate);
    return summarizeText(rewriteReferenceSummaryToJapanese(topCandidate.candidate, stage) || topCandidate.candidate);
  }

  return summarizeText(String(anyDetail.summary || ''));
}

function sortReferenceSampleExcerpts<T extends EvidencePresentationDetail>(
  detail: T,
  context?: EvidencePresentationContext,
): Array<{ [key: string]: unknown }> {
  const anyDetail = detail as T & {
    sample_excerpts?: Array<{ excerpt?: string | null; [key: string]: unknown }> | null;
  };
  const sampleExcerpts = Array.isArray(anyDetail.sample_excerpts) ? anyDetail.sample_excerpts : [];

  return [...sampleExcerpts]
    .filter((excerpt) => !isLowValueReferenceText(String(excerpt?.excerpt || '')))
    .sort((a, b) => {
      const scoreDiff =
        scoreReferenceCandidate(String(b?.excerpt || ''), context, { fromExcerpt: true }) -
        scoreReferenceCandidate(String(a?.excerpt || ''), context, { fromExcerpt: true });
      if (scoreDiff !== 0) return scoreDiff;
      return normalizeText(String(b?.excerpt || '')).length - normalizeText(String(a?.excerpt || '')).length;
    });
}

function scoreCitationByContext<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
  context?: EvidencePresentationContext,
): number {
  const profiles = activeContextProfiles(context);
  const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
  const haystack = citationSearchText(citation);
  let score = 0;

  for (const profile of profiles) {
    if (profile.citationPatterns.some((pattern) => pattern.test(haystack))) {
      score += 12;
    }
  }

  for (const detail of details) {
    const role = resolveEvidencePresentationRole(detail);
    if (role === 'support_catalog') score += 3;
    if (role === 'related_reading') score += 2;
    if (detail.public_safe === false) score += 1;
  }

  return score;
}

export function normalizeEvidencePresentationRole(value: unknown): EvidencePresentationRole {
  const role = String(value || '').trim();
  if (role === 'direct_basis') return role;
  if (role === 'conditional_hypothesis') return role;
  if (role === 'support_catalog') return role;
  return 'related_reading';
}

export function resolveEvidencePresentationRole(
  detail: EvidencePresentationDetail,
): EvidencePresentationRole {
  const trustTiers = Array.isArray(detail.trust_tiers) ? detail.trust_tiers : [];
  const evidenceScopes = Array.isArray(detail.evidence_scopes) ? detail.evidence_scopes : [];
  const pageTypes = Array.isArray(detail.page_types) ? detail.page_types : [];
  const isExternal = trustTiers.includes('external');
  const isAggregatedIndex = evidenceScopes.includes('aggregated_index');
  const hasIndexLikePage = pageTypes.some((pageType) =>
    ['search_index', 'index', 'finder', 'resource_hub'].includes(String(pageType || '').trim()),
  );

  const explicitRole = String(detail.evidence_role || '').trim();
  if (detail.note_type === 'support_catalog') return 'support_catalog';
  if (detail.note_type === 'curated_local_note') return 'conditional_hypothesis';
  if (
    isExternal &&
    isAggregatedIndex &&
    (detail.evidence_lane === 'legal_policy' || detail.evidence_lane === 'employer_guidance')
  ) {
    return 'related_reading';
  }
  if (isExternal && hasIndexLikePage) {
    return 'related_reading';
  }
  if (explicitRole) {
    return normalizeEvidencePresentationRole(explicitRole);
  }

  if (
    detail.evidence_lane === 'legal_policy' ||
    detail.evidence_lane === 'case_practice' ||
    detail.evidence_lane === 'employer_guidance'
  ) {
    return detail.is_partial ? 'conditional_hypothesis' : 'direct_basis';
  }

  if (detail.evidence_lane === 'aggregated_general' || detail.evidence_lane === 'mixed') {
    return 'conditional_hypothesis';
  }

  return 'related_reading';
}

export function groupEvidenceByRole<T extends EvidencePresentationDetail>(details: T[]) {
  const buckets = new Map<EvidencePresentationRole, T[]>();

  for (const role of ROLE_ORDER) {
    buckets.set(role, []);
  }

  for (const detail of details) {
    const role = resolveEvidencePresentationRole(detail);
    buckets.get(role)?.push(detail);
  }

  return ROLE_ORDER.map((role) => ({
    role,
    label: EVIDENCE_PRESENTATION_ROLE_LABEL[role],
    description: EVIDENCE_PRESENTATION_ROLE_DESCRIPTION[role],
    details: buckets.get(role) || [],
  })).filter((group) => group.details.length > 0);
}

export function citationHasDirectBasis<T extends EvidencePresentationDetail>(
  citation: EvidencePresentationCitation<T>,
): boolean {
  const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
  return details.some(
    (detail) =>
      resolveEvidencePresentationRole(detail) === 'direct_basis' && detail.public_safe !== false,
  );
}

export function splitCitationsByPresentation<
  T extends EvidencePresentationDetail,
  C extends EvidencePresentationCitation<T>,
>(citations: C[]) {
  const basisCitations: C[] = [];
  const referenceCitations: C[] = [];

  for (const citation of citations) {
    if (citationHasDirectBasis(citation)) {
      basisCitations.push(citation);
    } else {
      referenceCitations.push(citation);
    }
  }

  return {
    basisCitations,
    referenceCitations,
  };
}

export function sortCitationsByContext<
  T extends EvidencePresentationDetail,
  C extends EvidencePresentationCitation<T>,
>(citations: C[], context?: EvidencePresentationContext): C[] {
  return [...(citations || [])].sort((a, b) => {
    const scoreDiff = scoreCitationByContext(b, context) - scoreCitationByContext(a, context);
    if (scoreDiff !== 0) return scoreDiff;
    return normalizeText(String(b.claim || '')).length - normalizeText(String(a.claim || '')).length;
  });
}

export function filterReferenceCitationsByUsefulness<
  T extends EvidencePresentationDetail,
  C extends EvidencePresentationCitation<T>,
>(citations: C[], context?: EvidencePresentationContext): C[] {
  const seen = new Set<string>();
  const activeKeys = activeContextKeySet(context);

  return (citations || []).filter((citation) => {
    const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
    const searchText = citationSearchText(citation);
    const urls = citationSourceUrls(citation);
    const sourceIds = citationSourceIds(citation);
    const hasCaseLikeDetail = details.some((detail) => {
      const evidenceScopes = Array.isArray(detail.evidence_scopes) ? detail.evidence_scopes : [];
      const pageTypes = Array.isArray(detail.page_types) ? detail.page_types : [];
      return (
        evidenceScopes.includes('specific_case') ||
        pageTypes.some((pageType) => ['case_detail', 'case_guide'].includes(String(pageType || '').trim()))
      );
    });
    const contextScore = scoreCitationByContext(citation, context);
    const practical = hasPracticalReferenceSignal(searchText);
    const concrete = hasConcreteReferenceActionSignal(searchText);
    const allUrlsLowValue = urls.length > 0 && urls.every((url) => isLowValueReferenceUrl(url));
    const lowValueText = isLowValueReferenceText(searchText);
    const lowValueDetailOnly =
      details.length > 0 && details.every((detail) => isLowValueReferenceText(detailSearchText(detail)));
    const lowValueSummaryOnly =
      details.length > 0 &&
      details.every((detail) => {
        const anyDetail = detail as T & { summary?: string | null };
        return isLowValueReferenceText(String(anyDetail.summary || ''));
      });
    const abstractProcessOnly =
      isAbstractReferenceProcessText(searchText) && !concrete && !hasCaseLikeDetail;
    const sourceContextBlocked = blockedBySourceContextGate(sourceIds, searchText, activeKeys);

    if (allUrlsLowValue && !hasCaseLikeDetail && !concrete) {
      return false;
    }

    if (
      (lowValueText || lowValueDetailOnly || lowValueSummaryOnly) &&
      !practical &&
      !hasCaseLikeDetail &&
      contextScore < 12
    ) {
      return false;
    }

    if (abstractProcessOnly && contextScore < 16) {
      return false;
    }

    if (sourceContextBlocked && !hasCaseLikeDetail && contextScore < 18) {
      return false;
    }

    const firstDetail = details[0] as (T & { summary?: string | null }) | undefined;
    const dedupeKey =
      urls[0] ||
      normalizeText(String(citation.claim || '')) ||
      normalizeText(String(firstDetail?.summary || ''));
    if (!dedupeKey) return true;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  });
}

export function enrichReferenceCitationsByContext<
  T extends EvidencePresentationDetail,
  C extends EvidencePresentationCitation<T>,
>(citations: C[], context?: EvidencePresentationContext): C[] {
  return (citations || []).map((citation) => {
    const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
    const isRelatedReadingOnly = isRelatedReadingOnlyCitation(citation);
    const enrichedDetails = details.map((detail) => {
      if (resolveEvidencePresentationRole(detail) !== 'related_reading') return detail;

      const anyDetail = detail as T & {
        summary?: string | null;
        sample_excerpts?: Array<{ [key: string]: unknown }> | null;
      };
      const practiceStage =
        practiceStageFromCanonicalSampleExcerpts(detail) ||
        determineReferencePracticeStage(detailSearchText(detail));

      return {
        ...detail,
        practice_stage: practiceStage,
        practice_stage_label: referencePracticeStageLabel(practiceStage),
        summary: selectReferenceDetailSummary(detail, context),
        sample_excerpts: sortReferenceSampleExcerpts(detail, context),
      } as T;
    });

    return {
      ...citation,
      claim: isRelatedReadingOnly
        ? rewriteReferenceCitationClaim(citation, enrichedDetails, context)
        : citation.claim,
      evidence_details: enrichedDetails,
    };
  });
}

export function mergeReferenceCitationsByClaim<
  T extends EvidencePresentationDetail,
  C extends MergeableCitation<T>,
>(citations: C[], context?: EvidencePresentationContext): C[] {
  const ordered: C[] = [];
  const grouped = new Map<string, C>();

  for (const citation of citations || []) {
    if (!isRelatedReadingOnlyCitation(citation)) {
      ordered.push(citation);
      continue;
    }

    const claimKey = normalizeText(String(citation.claim || ''));
    if (!claimKey) {
      ordered.push(citation);
      continue;
    }

    const existing = grouped.get(claimKey);
    if (!existing) {
      const dedupedLaneKeys = [...new Set((citation.evidence_lanes || []).map(laneMergeKey))];
      const seeded = {
        ...citation,
        evidence_ids: [...new Set((citation.evidence_ids || []).filter(Boolean))],
        evidence_lanes: dedupedLaneKeys
          .map((key) => (citation.evidence_lanes || []).find((lane) => laneMergeKey(lane) === key))
          .filter(Boolean) as MergeableEvidenceLane[],
        evidence_details: sortReferenceDetailsByContext(
          [...((citation.evidence_details || []) as T[])],
          context,
        ),
      } as C;
      grouped.set(claimKey, seeded);
      ordered.push(seeded);
      continue;
    }

    const mergedEvidenceIds = [
      ...new Set([...(existing.evidence_ids || []), ...(citation.evidence_ids || [])].filter(Boolean)),
    ];

    const laneMap = new Map<string, MergeableEvidenceLane>();
    for (const lane of [...(existing.evidence_lanes || []), ...(citation.evidence_lanes || [])]) {
      const key = laneMergeKey(lane);
      if (!key) continue;
      if (!laneMap.has(key)) laneMap.set(key, lane);
    }

    const detailMap = new Map<string, T>();
    for (const detail of [
      ...(((existing.evidence_details || []) as T[]) || []),
      ...(((citation.evidence_details || []) as T[]) || []),
    ]) {
      const key = detailMergeKey(detail);
      if (!key) continue;
      if (!detailMap.has(key)) detailMap.set(key, detail);
    }

    const merged = {
      ...existing,
      evidence_ids: mergedEvidenceIds,
      evidence_lanes: Array.from(laneMap.values()),
      evidence_details: sortReferenceDetailsByContext(Array.from(detailMap.values()), context),
    } as C;

    grouped.set(claimKey, merged);

    const orderedIndex = ordered.findIndex(
      (item) => normalizeText(String(item.claim || '')) === claimKey,
    );
    if (orderedIndex >= 0) ordered[orderedIndex] = merged;
  }

  return ordered;
}
