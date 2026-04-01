#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const indexRoot = path.join(projectRoot, 'references', 'index');
const inputPath = path.join(indexRoot, 'normalized-records.jsonl');
const outputPath = path.join(indexRoot, 'knowledge-claims.jsonl');
const manifestPath = path.join(indexRoot, 'knowledge-claims-manifest.json');

const CONTEXT_DOMAINS = [
  'person',
  'job',
  'environment',
  'support',
  'time',
  'institution',
  'evidence',
];

const KNOWLEDGE_EVIDENCE_ROLES = new Set([
  'direct_basis',
  'conditional_hypothesis',
  'support_catalog',
  'related_reading',
]);

const PUBLIC_SAFE_EVIDENCE_ROLES = new Set(['direct_basis']);

const SIGNAL_KEYWORDS = {
  difficulty_occurrence: [
    '困難',
    '就労困難',
    'barrier',
    'limitation',
    'problem',
    '発生',
    'difficult',
    '難しい',
  ],
  difficulty_resolution: [
    '解決',
    '改善',
    '軽減',
    '緩和',
    'mitigation',
    'resolve',
    'solution',
    'adjustment',
  ],
  symptom_exacerbation: ['症状', '悪化', '疲労', 'flare', 'symptom', 'worsen', '体調'],
  support_needs: ['必要', 'ニーズ', '支援', '配慮', 'accommodation', 'support', 'need', 'request'],
};

const ACCOMMODATION_KEYWORDS = {
  schedule_flexibility: [
    '時差',
    '短時間',
    '勤務時間',
    '休憩',
    '休暇',
    'telework',
    'flexible schedule',
  ],
  task_redesign: ['業務調整', '配置転換', '再設計', 'task', 'job redesign'],
  environment_control: ['環境', '騒音', '照明', 'air', 'noise', 'lighting'],
  communication_support: ['手話', '筆談', '通訳', '面談', 'communication', 'interpreter'],
  assistive_technology: ['支援機器', '補助具', 'assistive', 'screen reader', 'software'],
  policy_and_training: ['方針', '研修', 'training', 'policy', '制度'],
};

const OUTCOME_KEYWORDS = {
  retention: ['定着', '継続', '離職', 'retention', 'stay employed'],
  performance_improvement: ['生産性', '成果', '業務効率', 'performance', 'productivity'],
  symptom_stabilization: ['症状安定', '悪化防止', '体調管理', 'stabilization'],
  barrier_reduction: ['困難軽減', '負担軽減', '問題解決', 'barrier reduction'],
  uncertain: ['課題', '未解決', '要検討', 'uncertain', 'pending'],
};

const BOILERPLATE_PATTERNS = [
  /検索結果｜障害者雇用事例リファレンスサービス/i,
  /toggle navigation/i,
  /site map|サイトマップ/i,
  /ウェブアクセシビリティ/i,
  /cookies on /i,
  /copyright/i,
  /all rights reserved/i,
  /アンケートのお願い/i,
  /前へ\s+\d+/i,
  /メニュー\s+閉じる/i,
  /skip to main content/i,
  /skip to footer/i,
  /language selection/i,
  /main menu/i,
  /close menu/i,
  /help us improve\s+\d+\s*characters remaining/i,
  /available languages close menu/i,
  /search canada\.ca search menu/i,
  /springe direkt zu:\s*inhalt/i,
  /^maybe yes this page is useful no this page is not useful/i,
  /report a problem with this page/i,
];

const SOURCE_PAGE_BOILERPLATE_RULES = [
  {
    sourceId: 'askjan_website',
    patterns: [
      /close menu close for employers for individuals for others toolkit/i,
      /ada library a to z lists situations & solutions finder/i,
      /publications & articles training events newsletter consultants/i,
      /myjan about us contact us/i,
    ],
  },
  {
    sourceId: 'askearn_employer_guidance',
    patterns: [
      /skip to main content menu search search close about earn/i,
      /the employer assistance and resource network on disability .* offers information and resources to help employers recruit hire retain and advance people with disabilities/i,
      /phases of employment recruit build a pipeline of talent that includes people with disabilities/i,
      /earn makes it easy to stay up-to-date on disability employment news and information/i,
      /job seeker resources service provider resources learning center dinah cohen learning center/i,
      /who we are earn partners earn staff faqs user information user agreement accessibility statement privacy getting started/i,
      /contact us about us about earn earn partners earn staff faqs user agreement accessibility statement privacy/i,
      /earn news newsletters read our recent newsletters/i,
      /disability@work lead the way supportive business culture build the pipeline outreach & recruitment hire/i,
      /what[^\s]{0,10}s new on askearn/i,
      /additional resources resource library a listing of earn resources by topic/i,
      /recruit build a pipeline of talent that includes people with disabilities/i,
      /hire identify people who have the skills and attributes for the job/i,
      /retain keep talented employees with disabilities/i,
      /advance ensure that employees with disabilities have equal opportunities for advancement/i,
    ],
  },
  {
    sourceId: 'jeed_reference',
    patterns: [
      /検索結果：\s*\d+\s*件/i,
      /検索条件：/i,
      /年度\s+事業所名\s+テーマ\s+事業内容\s+規模\s+障害\s+所在地/i,
      /前へ\s+\d+/i,
    ],
  },
  {
    sourceId: 'uk_gov_disability_employment',
    patterns: [
      /accept additional cookies reject additional cookies/i,
      /view cookies hide cookie message skip to main content/i,
      /navigation menu menu menu services and information/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    patterns: [
      /job access skip to main content/i,
      /skip to footer beta you are on a new version of this website/i,
    ],
  },
  {
    sourceId: 'canada_duty_to_accommodate',
    patterns: [
      /canada\.ca skip to main content/i,
      /skip to \"about government\" language selection/i,
      /search canada\.ca search menu main menu jobs and the workplace/i,
    ],
  },
  {
    sourceId: 'germany_antidiscrimination_work',
    patterns: [
      /springe direkt zu:\s*inhalt hauptmenü suche navigation und service servicemenü/i,
      /servicemenü kontakt presse english عربي leichte sprache gebärdensprache/i,
      /unternavigationspunkte öffnen schließen menü hauptmenü/i,
    ],
  },
  {
    sourceId: 'eu_reasonable_accommodation',
    patterns: [
      /your europe .* available languages close menu/i,
      /help us improve\s+\d+\s*characters remaining/i,
    ],
  },
  {
    sourceId: 'uk_headway_brain_injury_work',
    patterns: [
      /follow us:\s*improving life after brain injury/i,
      /need to talk\?\s*0808\s*800\s*2244/i,
      /donate\s+join/i,
      /visit our page on linkedin|visit our page on youtube/i,
      /accessibility disclaimer privacy/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    patterns: [
      /accessibility disclaimer privacy/i,
      /visit our page on linkedin|visit our page on youtube/i,
    ],
  },
];

const SOURCE_STATEMENT_NOISE_RULES = [
  {
    sourceId: 'askjan_website',
    patterns: [
      /^add to myjan remove from myjan close jan provides free, confidential technical assistance about job accommodations and the americans with disabilities act \(ada\)\.?$/i,
      /^numerous other accommodation solutions may exist\.?$/i,
      /^the following is only a sample of the possibilities available, and numerous other accommodation solutions may exist:/i,
      /^symptoms, causes, diagnosis, treatment, and prevention organizations job accommodation network office of disability employment policy/i,
      /^vendors and products please visit vendor site for product links and pricing\.?$/i,
      /vendors and products please visit vendor site for product links and pricing/i,
      /^jan(?:'s)? accommodation solutions: [^.]+ is a publication detailing accommodations/i,
      /^(?:american standard brands|alimed nodstop|cestus boxx|multi-purpose carts|two step adjustable headrest|performance health adjustable headrest|cascade healthcare solutions|mobility direct no products listed)\b/i,
      /^join us for a session that explores complex accommodation scenarios in the workplace/i,
      /^for more information on support persons as reasonable accommodations/i,
    ],
  },
  {
    sourceId: 'askearn_employer_guidance',
    patterns: [
      /^askearn\s*\|\s*section\s+[ivxlcdm]+\.?$/i,
      /^(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+20\d{2}:/i,
      /^back to top\b/i,
      /^publications a listing of earn publications available in pdf format\.?$/i,
      /^courses a listing of earn learning center offerings\.?$/i,
      /^learning center\s*\//i,
      /^additional resources\b/i,
      /\bjan webcast\b/i,
      /\bearn newsletter\b/i,
      /\bwhat(?:['’]|&rsquo;)?s new on askearn\b/i,
      /^(?:et\s+)?learn how\b/i,
      /^recent challenges, coupled with/i,
      /^please note that some of the strategies described/i,
      /^employers should review local, state, and federal laws/i,
      /^disability@work framework the development, procurement, lease, maintenance/i,
      /^earn(?:['’]|&rsquo;)?s workplace mental health toolkit provides employers with the knowledge, skills, and resources/i,
      /^however, none of the strategies included in the disability@work framework/i,
      /^neurodivergent workers can contribute their talents, skills, and perspectives/i,
      /^learn more about mental health and substance use disorder at work/i,
      /^new research finds next-gen workers/i,
      /^learning center employers who want to hire and retain the best talent know the value of creating a workplace that welcomes all workers, including those with disabilities\.?$/i,
      /^benefit your business through disability employment\b/i,
      /^benefits of neurodiversity in the workplace\b/i,
      /^organizational benefits of neurodiversity\b/i,
      /^employee benefits of neurodiversity\b/i,
      /^in addition to the toolkit, earn offers this short course\b/i,
      /^learning center the purpose of this toolkit is to help small businesses\b/i,
      /^small business administration\b/i,
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
      /^an effective process will also reduce employers(?:['’]|’)? exposure to legal risk and support compliance with equal opportunity laws and regulations\.?$/i,
      /^organizations may want to demonstrate that they welcome accommodation requests and consider them a way to enhance productivity\.?$/i,
      /^getting started\s*\/\s*publications\b/i,
      /^department of labor(?:['’]|&rsquo;)?s office of disability employment policy \(odep\) under cooperative agreement no\.?$/i,
      /^resources to support accessible ict\b/i,
      /^to address this shortfall, some companies have implemented programs focused on recruiting and hiring neurodivergent people\.?$/i,
      /^providing workplace accommodations yields multiple benefits for employers, including retaining valuable employees, improving overall production and morale, and reducing workers(?:’|') compensation and training costs\.?$/i,
      /^managing such a workforce requires employers to understand disability-related laws, implement effective accommodation policies and procedures, prioritize accessibility, and provide quality jobs for all employees\.?$/i,
      /^the employer assistance and resource network on disability \(earn\) is a resource for employers seeking to recruit, hire, retain, and advance qualified employees with disabilities\.?$/i,
      /^resources find resources to further support employers\b/i,
      /^see all webinars\b/i,
      /^the job accommodation network \(jan\) is the leading source of free, expert, and confidential guidance\b/i,
      /^this checklist summarizes some of the lessons learned from successful neurodiversity hiring programs\.?$/i,
      /^and don(?:['’]|’)t forget to follow earn on facebook\b/i,
      /^department of labor, nor does mention of trade names, commercial products, or organizations imply endorsement by the u\.s\.?$/i,
      /^share feedback user agreement accessibility statement privacy\b/i,
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
    ],
  },
  {
    sourceId: 'uk_headway_brain_injury_work',
    patterns: [
      /^find out more\b/i,
      /^your gift will help ensure brain injury survivors\b/i,
      /^summary of standards to be assessed\b/i,
      /^how to get self-directed support making a support plan\b/i,
      /^friends of headway\b/i,
      /^headway annual awards\b/i,
      /^share your story with us\b/i,
      /^find your local event charity runs\b/i,
      /^about brain injury for individuals types of brain injury\b/i,
      /^making returning to work, work for you \| headway follow us:/i,
      /^alison winterburn \| headway follow us:/i,
      /^cognitive effects of brain injury \| headway follow us:/i,
    ],
  },
  {
    sourceId: 'germany_antidiscrimination_work',
    patterns: [
      /^zum diskriminierungs-check anfrage in gebärdensprache/i,
      /^antidiskriminierungsstelle des bundes .*kontakt/i,
      /^\s*frage\b/i,
      /^suche nach good-practice\b/i,
      /\bfolgen sie uns auf\b/i,
      /\bfacebook abonnieren\b|\binstagram abonnieren\b/i,
      /^förderung der ausbildung und beschäftigung persönliches budget bundesteilhabegesetz/i,
      /^february\s+20\d{2}\s+pressemitteilung\b/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    patterns: [
      /^how to join an event\b/i,
      /^free events\b/i,
      /\bjobaccess adviser\b/i,
      /\bemail\s+[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i,
      /^benefits of a support plan\b/i,
      /^developing a support plan for your staff\b/i,
      /^save workplace adjustments made easy\b/i,
      /^make sure you know your obligations\b/i,
      /^save talking about your disability at work\b/i,
      /^settling into your new job find out about:/i,
      /^save providing work experience for people with disability\b/i,
      /^you can apply for funding funding is money from the government to pay for services and supports\.?$/i,
      /^we acknowledge all traditional custodians\b/i,
      /^explore resources for service providers:/i,
      /^how your personal information is protected\b/i,
      /^save related pages\b/i,
      /^partnering with the national disability recruitment coordinator\b/i,
      /^it(?:['’]|’)s important to focus on the individual\.?$/i,
      /^save your role in work health and safety find out about:/i,
      /^saved items are specific to your device\b/i,
      /^find out how jobaccess can help\.?$/i,
      /^save assistive technology for staff topics covered in this video:/i,
      /^save making changes in your workplace find out about:/i,
      /^added to saved items your saved items will be here for you to read later\b/i,
      /^diversity makes good business sense find out why you should employ people with disability\b/i,
      /^site maintained by the department of social services back to top css updates\b/i,
      /^save inclusive language tips for employers\b/i,
      /^save workers compensation find out about:/i,
      /^the national disability recruitment coordinator \(ndrc\) has a handy employment support plan template\b/i,
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
    ],
  },
  {
    sourceId: 'uk_gov_disability_employment',
    patterns: [
      /^maybe yes this page is useful no this page is not useful/i,
      /\breport a problem with this page\b/i,
      /^what access to work will not pay for\b/i,
      /^claim online claim by post\b/i,
      /^a paid job can be full or part-time\b/i,
      /^you can call the access to work helpline\b/i,
      /^if you(?:['’]|re|’re)\s+in northern ireland, find out about employment for people with disabilities or contact access to work\b/i,
      /^this applies to all workers, including trainees, apprentices, contract workers and business partners\.?$/i,
      /^this page is part of get ready to employ someone for the first time: step by step\b/i,
      /^we(?:['’]|d|’d)\s+like to set additional cookies to understand how you use gov\.uk, remember your settings and improve government services\.?$/i,
    ],
  },
  {
    sourceId: 'askearn_employer_guidance',
    patterns: [
      /^(?:et\s+)?join the job accommodation network \(jan\) and earn/i,
      /^disability@work framework the following is a compilation of materials/i,
    ],
  },
  {
    sourceId: 'eu_reasonable_accommodation',
    patterns: [
      /^legal compliance and risk mitigation\b/i,
      /^objective to implement known measures\b/i,
      /^\(?20\d{2}\),\s*[“"„]/i,
    ],
  },
  {
    sourceId: 'canada_duty_to_accommodate',
    patterns: [
      /^culturally competent guidance, support, and advice\b/i,
      /^guiding principles of a disability management program are:/i,
      /^for managers and organizations support your employees with the passport/i,
      /^benefits of a support plan\b/i,
      /^developing a support plan for your staff\b/i,
      /^figure 1: accommodation process diagram\b/i,
      /^these supports should help them perform job functions efficiently and safely\.?$/i,
      /^this may be inaccurately perceived by others as a performance issue\.?$/i,
      /^the department(?:['’]|’)s positive measure program applies to employees\b/i,
      /^"the goal of the government of canada is to have a sustainable workforce\b/i,
      /^for example, managers are not required to accept substandard performance or unpredictable attendance\.?$/i,
    ],
  },
  {
    sourceId: 'germany_agg_legal',
    patterns: [
      /^version information:/i,
      /^zum seitenanfang impressum datenschutz/i,
    ],
  },
  {
    sourceId: 'uk_gov_disability_employment',
    patterns: [
      /^it normally involves using photo id\b/i,
      /^you(?:['’]|ll|’ll)\s+need a letter confirming your grant\b/i,
      /^what you need to claim\b/i,
      /^for example, about your condition, how it affects your work and what support you think you need\b/i,
      /^if you(?:['’]|re|’re)\s+a civil servant\b/i,
      /^if you(?:['’]|re|’re)\s+getting employment and support allowance\b/i,
      /^your disability, illness or health condition you must have\b/i,
      /^you can apply for access to work if you need extra help\b/i,
      /^check your responsibilities when you take on someone with a different employment status/i,
      /^check who counts as an employee\b/i,
      /^there(?:['’]|’)s more detail about employers(?:['’]|’)? obligations and how to meet them on the equality and human rights commission website\b/i,
    ],
  },
  {
    sourceId: 'uk_headway_brain_injury_work',
    patterns: [
      /^if you disagree with a decision\b/i,
      /^for others, a brain injury may permanently affect the ability to return to work/i,
    ],
  },
  {
    sourceId: 'eu_reasonable_accommodation',
    patterns: [
      /^reasonable accommodation is any change to a job or a work environment/i,
      /^the company retained a highly skilled it professional/i,
      /^examples of systemic measures\b/i,
      /^benefit for the employer\b/i,
      /^collective bargaining and social dialogue between employers and trade unions play an important role in negotiating and implementing measures for reasonable accommodation in the workplace for persons with disabilities\.?$/i,
    ],
  },
  {
    sourceId: 'canada_duty_to_accommodate',
    patterns: [
      /^previous documentation the gc workplace accessibility passport\b/i,
      /^non-cooperation in the provision of adequate information\b/i,
      /^the three-step process encourages the development of standards\b/i,
      /^implement the decision accommodation is about removing barriers\b/i,
      /^in accommodating an employee or a candidate in a selection process\b/i,
      /^the diagram below assumes that the canada labour code\b/i,
      /^accommodation will normally involve the coordination of activities such as assessment and purchase of adaptive equipment\b/i,
      /^the duty to accommodate is a legal obligation\b/i,
      /^accommodations that are not satisfactoryrequire adjustments and modifications\b/i,
      /^a bona fide occupational requirement is a requirement\b/i,
      /^represented employees may consult with their union to explore the recourse mechanisms open to them\b/i,
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
    ],
  },
];

const SOURCE_RECORD_SKIP_RULES = [
  {
    sourceId: 'askearn_employer_guidance',
    pageTypes: ['resource_hub'],
    urlPatterns: [
      /\/page\/(?:about-earn|contact-us|earn-partners|earn-staff|news-and-events|subscribe|privacy|user-agreement|job-seekers-resources|service-provider-resources|getting-started|accessibility-statement|recruit|hire|retain|advance|dinah-cohen-learning-center)(?:$|[?#])/i,
      /\/page\/(?:statistics-on-disability|federal-government-employment|build-a-pipeline-outreach-and-recruitment|lead-the-way-supportive-business-culture|why-hire-people-with-disabilities|small-business-toolkit|resources-on-mental-health-and-employment|neurodiversity-hiring-initiatives-and-partnerships|communicate-external-and-internal-communication-of-company-policies-and-practices)(?:$|[?#])/i,
      /\/page\/(?:mental-health-toolkit|disability-at-work-framework|small-business-guide-mh-sud|learning-guide-mental-well-being-of-gen-z-workers|accommodation-and-accessibility-benefits|learn-about-successful-programs|benefit-your-business-through-disability-employment|benefits-of-neurodiversity-in-the-workplace|employee-benefits-of-neurodiversity|organizational-benefits-of-neurodiversity|disability-employment-in-the-workplace|hire-and-keep-the-best-talent-acquisition-and-retention-processes|accessibility-program|measure-success-accountability|linking-accessibility-and-accommodation|create-a-mental-health-friendly-workplace|substance-use-disorder-in-the-workplace|about-the-issue|the-rehabilitation-act-of-1973-rehab-act|defining-neurodiversity-and-neurodivergence|neurodiversity-in-the-workplace)(?:$|[?#])/i,
      /\/page\/(?:disability-at-work-resources|accommodation-and-accessibility-resources|accommodation-and-accessibility-acing-the-basics|accommodation-and-accessibility-toolkit)(?:$|[?#])/i,
      /\/learning-center\/course\/mental-health-friendly-workplace(?:$|[?#])/i,
      /\/page\/earn-newsletter-[^/?#]+/i,
      /\/page\/[^/?#]*roundtable(?:$|[?#])/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    urlPatterns: [
      /\/(?:free-events[^/?#]*|about-employer-toolkit)(?:$|[?#])/i,
      /\/know-rights-responsibilities\/(?:guidelines-discrimination|privacy-staff-disability)(?:$|[?#])/i,
      /\/hire-someone-disability\/(?:help-recruit-and-hire-people|taking-apprentice-disability)(?:$|[?#])/i,
      /\/i-am-a-person-with-disability\/working-or-about-start-work\/your-rights-and-responsibilities(?:$|[?#])/i,
      /\/i-am-a-person-with-disability\/working-or-about-start-work\/getting-started-new-job(?:$|[?#])/i,
    ],
  },
  {
    sourceId: 'germany_antidiscrimination_work',
    urlPatterns: [
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
    ],
  },
  {
    sourceId: 'eu_reasonable_accommodation',
    urlPatterns: [
      /op\.europa\.eu\/webpub\/empl\/reasonable-accommodation-at-work\/(?!en\/)[a-z]{2}\/?$/i,
      /employment-social-affairs\.ec\.europa\.eu\/reasonable-accommodation-work-guidelines-and-good-practices_en(?:$|[?#])/i,
    ],
  },
  {
    sourceId: 'canada_duty_to_accommodate',
    urlPatterns: [
      /\/(?:diversity-inclusion-public-service\.html|disability-management\.html|working-government-canada-duty-accommodate-right-non-discrimination\.html|health-wellness-public-servants\.html|employee-wellness-resource\.html|fundamentals-duty-accommodate-roles-responsibilities\.html|duty-accommodate-general-process-managers\.html)(?:$|[?#])/i,
      /\/health-wellness-public-servants\/disability-management\/(?:how-to-build-disability-management-program|handling-disability-management-cases-tool|fundamentals)(?:\.html)?(?:$|[?#])/i,
      /government-canada-workplace-accessibility-passport(?:\.html)?(?:$|[?#]|\/)/i,
    ],
  },
  {
    sourceId: 'uk_gov_disability_employment',
    urlPatterns: [
      /\/access-to-work(?:$|[?#])/i,
      /\/access-to-work\/eligibility(?:$|[?#])/i,
      /\/access-to-work\/print(?:$|[?#])/i,
      /\/access-to-work\/(?:apply|after-you-apply|claiming-from-your-grant|renew)(?:$|[?#])/i,
      /\/guidance\/equality-act-2010-guidance(?:$|[?#])/i,
    ],
  },
  {
    sourceId: 'germany_agg_legal',
    urlPatterns: [
      /gesetze-im-internet\.de\/englisch_agg\/(?:englisch_agg\.html|index\.html|print_englisch_agg\.html)?(?:$|[?#])/i,
    ],
  },
  {
    sourceId: 'uk_headway_brain_injury_work',
    urlPatterns: [/\/welfare-benefits\//i],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    urlPatterns: [/\/learn-benefits-hiring\/benefits-employing-disability(?:$|[?#])/i],
  },
];

const LEGAL_POLICY_SOURCE_IDS = new Set([
  'uk_gov_disability_employment',
  'eu_reasonable_accommodation',
  'germany_agg_legal',
  'germany_antidiscrimination_work',
  'canada_duty_to_accommodate',
  'australia_jobaccess_guidance',
]);

const EMPLOYER_GUIDANCE_SOURCE_IDS = new Set(['askearn_employer_guidance']);
const INDEX_LIKE_PAGE_TYPES = new Set(['search_index', 'index', 'finder', 'resource_hub']);

const NAVIGATION_TERMS = [
  'menu',
  'navigation',
  'site map',
  'サイトマップ',
  'cookie',
  'privacy',
  'copyright',
  'all rights reserved',
  '検索結果',
  '検索条件',
  '前へ',
  '次へ',
  'toggle',
  'breadcrumb',
  'skip to main content',
  'contact us',
  'myjan',
];

function uniqueSorted(values) {
  return Array.from(
    new Set(
      values.filter(
        (value) => value !== null && value !== undefined && String(value).trim() !== '',
      ),
    ),
  ).sort();
}

function splitSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[。.!?！？])\s+|\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function hasAny(text, keywords) {
  const normalized = String(text || '').toLowerCase();
  return keywords.some((keyword) => normalized.includes(String(keyword).toLowerCase()));
}

function normalizeWhitespace(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLeadingMachineLabel(text) {
  return String(text || '').replace(/^[a-z][a-z0-9]*(?:_[a-z0-9]+)+\s*:\s*/i, '');
}

function collapseRepeatedLeadPhrase(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return normalized;

  const words = normalized.split(/\s+/).filter(Boolean);
  for (let size = Math.min(6, Math.floor(words.length / 2)); size >= 2; size -= 1) {
    const first = words.slice(0, size).join(' ');
    const second = words.slice(size, size * 2).join(' ');
    if (first && second && first.toLowerCase() === second.toLowerCase()) {
      return [first, ...words.slice(size * 2)].join(' ').trim();
    }
  }

  return normalized;
}

function normalizeClaimInput(text) {
  return collapseRepeatedLeadPhrase(
    normalizeWhitespace(stripLeadingMachineLabel(text))
    .replace(/\bOpen Close\b/gi, ' ')
    .replace(/\bClose Open\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim(),
  );
}

function isQuestionLikeStatement(text) {
  const normalized = normalizeClaimInput(text);
  if (!normalized) return false;
  if (/^(?:question|frage|q[:\s])/i.test(normalized)) return true;
  if (/[?？]\s*$/.test(normalized)) return true;
  return (
    /か[。.]?$/.test(normalized) &&
    /(誰|何|どこ|どの|いつ|なぜ|どう|どこまで|切る|揃っている|中心)/.test(normalized)
  );
}

function getClaimText(record) {
  return normalizeClaimInput(record?.claimText || record?.bodyText || record?.text || '');
}

function buildClaimExcerpt(record) {
  const body = getClaimText(record).slice(0, 220);
  const heading = normalizeWhitespace(record?.headingText || '');
  if (heading && body) return `${heading} | ${body}`.slice(0, 220);
  return body;
}

function toWordLikeTokens(text) {
  return normalizeWhitespace(text)
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean);
}

function countNavigationHits(text) {
  const normalized = normalizeWhitespace(text).toLowerCase();
  return NAVIGATION_TERMS.reduce((count, term) => count + (normalized.includes(term) ? 1 : 0), 0);
}

function matchesSourcePageBoilerplate(text, record) {
  const sourceId = record.sourceId || 'unknown';
  const pageType = record.interactionContext?.pageType || 'unknown';

  for (const rule of SOURCE_PAGE_BOILERPLATE_RULES) {
    if (rule.sourceId !== sourceId) continue;
    if (
      Array.isArray(rule.pageTypes) &&
      rule.pageTypes.length > 0 &&
      !rule.pageTypes.includes(pageType)
    )
      continue;
    if (rule.patterns.some((pattern) => pattern.test(text))) return true;
  }
  return false;
}

function matchesSourceStatementNoise(text, record) {
  const sourceId = record.sourceId || 'unknown';
  const pageType = record.interactionContext?.pageType || 'unknown';

  for (const rule of SOURCE_STATEMENT_NOISE_RULES) {
    if (rule.sourceId !== sourceId) continue;
    if (
      Array.isArray(rule.pageTypes) &&
      rule.pageTypes.length > 0 &&
      !rule.pageTypes.includes(pageType)
    )
      continue;
    if (rule.patterns.some((pattern) => pattern.test(text))) return true;
  }

  return false;
}

function normalizeRecordUrl(record) {
  return String(record?.interactionContext?.finalUrl || record?.interactionContext?.sourceUrl || '')
    .trim()
    .toLowerCase();
}

function recordSkipReason(record) {
  const sourceId = record.sourceId || 'unknown';
  const pageType = record.interactionContext?.pageType || 'unknown';
  const trustTier = record.interactionContext?.trustTier || 'unknown';
  const url = normalizeRecordUrl(record);

  if (trustTier === 'external' && isIndexLikePageType(pageType)) {
    return 'source_record_page_type_skip';
  }

  for (const rule of SOURCE_RECORD_SKIP_RULES) {
    if (rule.sourceId !== sourceId) continue;
    if (Array.isArray(rule.pageTypes) && rule.pageTypes.includes(pageType)) {
      return 'source_record_page_type_skip';
    }
    if (rule.urlPatterns?.some((pattern) => pattern.test(url))) {
      return 'source_record_url_skip';
    }
  }

  return null;
}

function hasCoreContextSignal(text) {
  return /(本人|当事者|従業員|employee|worker|individual|person|job|task|業務|職務|支援|配慮|合理的配慮|accommodation|support|law|legal|act|regulation|制度)/i.test(
    text,
  );
}

function shouldRescueSoftRejection(record, statement) {
  const scope = record.interactionContext?.evidenceScope || 'unknown';
  return scope === 'specific_case' && hasCoreContextSignal(statement);
}

function rejectStatement(record, statement, reason, { soft = false } = {}) {
  if (soft && shouldRescueSoftRejection(record, statement)) {
    return { isAccepted: true, reason: null };
  }
  return { isAccepted: false, reason };
}

function evaluateStatementQuality(text, record) {
  const normalized = normalizeClaimInput(text);
  if (!normalized) return rejectStatement(record, normalized, 'empty_statement');
  if (normalized.length < 14) return rejectStatement(record, normalized, 'too_short');
  if (/[：:]\s*$/.test(normalized)) {
    return rejectStatement(record, normalized, 'heading_like_statement');
  }
  if (/^\|.*\|\s*$/.test(normalized) || /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(normalized)) {
    return rejectStatement(record, normalized, 'markdown_table_row');
  }
  if (isQuestionLikeStatement(normalized)) {
    return rejectStatement(record, normalized, 'question_like_statement');
  }
  if (BOILERPLATE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return rejectStatement(record, normalized, 'global_boilerplate_pattern');
  }
  if (matchesSourcePageBoilerplate(normalized, record)) {
    return rejectStatement(record, normalized, 'source_page_boilerplate_pattern');
  }
  if (matchesSourceStatementNoise(normalized, record)) {
    return rejectStatement(record, normalized, 'source_statement_noise_pattern');
  }

  const navHits = countNavigationHits(normalized);
  if (navHits >= 3) {
    return rejectStatement(record, normalized, 'navigation_density_high', { soft: true });
  }

  const tokens = toWordLikeTokens(normalized);
  if (tokens.length >= 8) {
    const uniqueRatio = new Set(tokens).size / tokens.length;
    if (uniqueRatio < 0.45) {
      return rejectStatement(record, normalized, 'low_lexical_diversity', { soft: true });
    }

    const contentTokens = tokens.filter(
      (token) =>
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(token) || token.length >= 3,
    );
    const contentRatio = contentTokens.length / tokens.length;
    if (contentRatio < 0.5) {
      return rejectStatement(record, normalized, 'low_content_token_ratio', { soft: true });
    }

    const tokenFreq = {};
    for (const token of tokens) tokenFreq[token] = (tokenFreq[token] || 0) + 1;
    const maxFreq = Math.max(...Object.values(tokenFreq));
    if (maxFreq >= 4 && maxFreq / tokens.length >= 0.25) {
      return rejectStatement(record, normalized, 'repeated_token_dominance', { soft: true });
    }
  }

  return { isAccepted: true, reason: null };
}

function scoreSentenceCandidate(sentence, keywords, record) {
  const normalized = normalizeWhitespace(sentence);
  let score = 0;

  if (hasAny(normalized, keywords)) score += 6;
  if (hasCoreContextSignal(normalized)) score += 2;

  const length = normalized.length;
  if (length >= 40 && length <= 220) score += 2;
  else if (length >= 24 && length <= 260) score += 1;
  else if (length > 260) score -= 1;
  else score -= 1;

  if (record.sourceId === 'askearn_employer_guidance') {
    if (/\ba listing of\b/i.test(normalized)) score -= 2;
    if (/\blearn about\b/i.test(normalized)) score -= 1;
    if (/\bfind out\b/i.test(normalized)) score -= 1;
    if (/\bwebcast\b|\bnewsletter\b/i.test(normalized)) score -= 4;
  }

  return score;
}

function pickSentence(text, keywords, record) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return {
      statement: String(text || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 260),
      skippedReasons: [],
    };
  }

  const meaningfulSentences = [];
  const skippedReasons = [];
  for (const sentence of sentences) {
    const quality = evaluateStatementQuality(sentence, record);
    if (quality.isAccepted) {
      meaningfulSentences.push(sentence);
      continue;
    }
    skippedReasons.push(quality.reason || 'quality_rejected');
  }

  if (meaningfulSentences.length > 0) {
    const scored = meaningfulSentences
      .map((sentence) => ({
        sentence,
        score: scoreSentenceCandidate(sentence, keywords, record),
        keywordHit: hasAny(sentence, keywords),
      }))
      .sort((a, b) => {
        if (b.keywordHit !== a.keywordHit) return Number(b.keywordHit) - Number(a.keywordHit);
        if (b.score !== a.score) return b.score - a.score;
        return b.sentence.length - a.sentence.length;
      });

    return {
      statement: scored[0].sentence.slice(0, 260),
      skippedReasons,
    };
  }

  return {
    statement: sentences[0].slice(0, 260),
    skippedReasons,
  };
}

function normalizeForKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[0-9０-９]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

function mapTrustTierScore(trustTier) {
  if (trustTier === 'primary') return 0.78;
  if (trustTier === 'secondary') return 0.68;
  if (trustTier === 'external') return 0.55;
  return 0.45;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function inferContextCoverage(record) {
  const ctx = record.interactionContext || {};
  const text = getClaimText(record);
  const disabilityFacets = ctx.disabilityFacets || ctx.disabilityHints || [];
  const industryFacets = ctx.industryFacets || [];
  const supportHints = ctx.supportTypeHints || [];
  const accommodationFacets = ctx.accommodationFacets || [];

  const hasTimeSignal =
    Boolean(ctx.linkedCaseYear) ||
    /\b(19|20)\d{2}\b/.test(text) ||
    /(年度|年次|year|years|monthly|weekly|daily)/i.test(text);

  const coverage = {
    person:
      disabilityFacets.length > 0 || /(本人|当事者|employee|worker|user|individual)/i.test(text),
    job: industryFacets.length > 0 || /(業務|職務|仕事|task|job|role|workload)/i.test(text),
    environment:
      accommodationFacets.includes('environment_control') ||
      /(職場環境|騒音|照明|workspace|environment|noise|lighting)/i.test(text),
    support:
      supportHints.length > 0 ||
      accommodationFacets.length > 0 ||
      /(支援|配慮|合理的配慮|support|accommodation|adjustment)/i.test(text),
    time: hasTimeSignal,
    institution:
      (ctx.country && ctx.country !== 'unknown') ||
      (ctx.legalContext && ctx.legalContext !== 'unspecified') ||
      /(法律|法令|policy|act|regulation)/i.test(text),
    evidence:
      (ctx.trustTier && ctx.trustTier !== 'unknown') ||
      record.contentType === 'guideline' ||
      record.contentType === 'web_reference',
  };

  const missingContexts = CONTEXT_DOMAINS.filter((domain) => !coverage[domain]);
  return {
    coverage,
    missingContexts,
    isPartial: missingContexts.length > 0,
  };
}

function inferEvidenceLane({ sourceIds, evidenceScopes, pageTypes }) {
  const ids = Array.isArray(sourceIds) ? sourceIds : [];
  const scopes = Array.isArray(evidenceScopes) ? evidenceScopes : [];
  const pages = Array.isArray(pageTypes) ? pageTypes : [];

  const hasSpecificCase = scopes.includes('specific_case');
  const hasAggregatedIndex = scopes.includes('aggregated_index');
  const allSourcesLegalPolicy =
    ids.length > 0 && ids.every((sourceId) => LEGAL_POLICY_SOURCE_IDS.has(sourceId));
  const allSourcesEmployerGuidance =
    ids.length > 0 && ids.every((sourceId) => EMPLOYER_GUIDANCE_SOURCE_IDS.has(sourceId));
  const hasLegalPageHints = pages.some((pageType) => {
    const normalized = String(pageType || '').toLowerCase();
    if (!normalized) return false;
    if (
      normalized.startsWith('employer_') ||
      normalized === 'training_course' ||
      normalized === 'resource_hub'
    ) {
      return false;
    }
    return /(^|_)legal|gov/.test(normalized) || /^policy(?:_|$)/.test(normalized);
  });
  const hasEmployerGuidancePageHints = pages.some((pageType) =>
    /employer_toolkit|employer_publication|employer_guidance_page|training_course|resource_hub/i.test(
      String(pageType || ''),
    ),
  );

  if ((allSourcesLegalPolicy || hasLegalPageHints) && hasAggregatedIndex && !hasSpecificCase) {
    return 'legal_policy';
  }
  if (
    (allSourcesEmployerGuidance || hasEmployerGuidancePageHints) &&
    hasAggregatedIndex &&
    !hasSpecificCase
  ) {
    return 'employer_guidance';
  }
  if (hasSpecificCase && !hasAggregatedIndex) {
    return 'case_practice';
  }
  if (hasSpecificCase && hasAggregatedIndex) {
    return 'mixed';
  }
  if (hasAggregatedIndex) {
    return 'aggregated_general';
  }
  return allSourcesLegalPolicy || hasLegalPageHints ? 'legal_policy' : 'mixed';
}

function normalizeNoteType(value) {
  const noteType = String(value || '').trim();
  return noteType || null;
}

function normalizeEvidenceRole(value) {
  const role = String(value || '').trim();
  return KNOWLEDGE_EVIDENCE_ROLES.has(role) ? role : 'related_reading';
}

function isIndexLikePageType(pageType) {
  return INDEX_LIKE_PAGE_TYPES.has(String(pageType || '').trim());
}

function shouldDemoteCandidateToRelatedReading(candidate) {
  const trustTier = String(candidate.trustTier || '').trim();
  const evidenceScope = String(candidate.evidenceScope || '').trim();

  if (trustTier === 'external' && isIndexLikePageType(candidate.pageType)) {
    return true;
  }

  if (
    trustTier === 'external' &&
    evidenceScope === 'aggregated_index' &&
    (candidate.evidenceLane === 'legal_policy' || candidate.evidenceLane === 'employer_guidance')
  ) {
    return true;
  }

  return false;
}

function deriveCandidateEvidenceLane(candidate) {
  return inferEvidenceLane({
    sourceIds: [candidate.sourceId],
    evidenceScopes: [candidate.evidenceScope],
    pageTypes: [candidate.pageType],
  });
}

function deriveCandidateEvidenceRole(candidate) {
  const noteType = normalizeNoteType(candidate.noteType);
  if (noteType === 'support_catalog') return 'support_catalog';
  if (noteType === 'curated_local_note') return 'conditional_hypothesis';
  if (shouldDemoteCandidateToRelatedReading(candidate)) return 'related_reading';

  if (
    candidate.evidenceLane === 'legal_policy' ||
    candidate.evidenceLane === 'case_practice' ||
    candidate.evidenceLane === 'employer_guidance'
  ) {
    return 'direct_basis';
  }

  if (
    candidate.evidenceLane === 'aggregated_general' ||
    candidate.evidenceLane === 'mixed' ||
    candidate.evidenceScope === 'aggregated_index'
  ) {
    return 'conditional_hypothesis';
  }

  return 'related_reading';
}

function primaryEvidenceRole(evidenceRoles) {
  if (evidenceRoles.includes('support_catalog')) return 'support_catalog';
  if (evidenceRoles.includes('conditional_hypothesis')) return 'conditional_hypothesis';
  if (evidenceRoles.includes('direct_basis')) return 'direct_basis';
  return 'related_reading';
}

function buildProvenance({
  evidenceRoles,
  noteTypes,
  curationRiskLevels,
  mustPairWithRegionalSupport,
}) {
  const evidenceRole = primaryEvidenceRole(evidenceRoles);
  return {
    noteTypes: uniqueSorted(noteTypes),
    curationRiskLevels: uniqueSorted(curationRiskLevels),
    evidenceRole,
    publicSafe: PUBLIC_SAFE_EVIDENCE_ROLES.has(evidenceRole),
    mustPairWithRegionalSupport: Boolean(mustPairWithRegionalSupport),
  };
}

function evaluateRisk({ evidenceScope, trustTier, missingContexts, evidenceCount, evidenceLane }) {
  const missingCore = missingContexts.filter((domain) =>
    ['person', 'job', 'support', 'institution'].includes(domain),
  ).length;
  const isLegalPolicyLane = evidenceLane === 'legal_policy';
  const isEmployerGuidanceLane = evidenceLane === 'employer_guidance';

  if (evidenceScope === 'aggregated_index' && trustTier === 'external') {
    if (isLegalPolicyLane) {
      if (missingCore >= 2) {
        return {
          level: 'high',
          reasons: ['legal_policy_aggregated_missing_core_contexts'],
        };
      }
      return {
        level: 'medium',
        reasons: ['legal_policy_aggregated_evidence'],
      };
    }
    if (isEmployerGuidanceLane) {
      if (missingCore >= 2) {
        return {
          level: 'high',
          reasons: ['employer_guidance_aggregated_missing_core_contexts'],
        };
      }
      return {
        level: 'medium',
        reasons: ['employer_guidance_aggregated_evidence'],
      };
    }
    return {
      level: 'high',
      reasons: ['aggregated_external_evidence'],
    };
  }

  if (evidenceScope === 'aggregated_index' && missingCore >= 1) {
    if (isLegalPolicyLane && missingCore === 1) {
      return {
        level: 'medium',
        reasons: ['legal_policy_partial_context'],
      };
    }
    if (isEmployerGuidanceLane && missingCore === 1) {
      return {
        level: 'medium',
        reasons: ['employer_guidance_partial_context'],
      };
    }
    return {
      level: 'high',
      reasons: ['aggregated_index_evidence', 'missing_core_contexts'],
    };
  }

  if (trustTier === 'external' && evidenceCount <= 2 && missingCore >= 2) {
    if (isLegalPolicyLane) {
      return {
        level: 'medium',
        reasons: ['legal_policy_low_corroboration'],
      };
    }
    if (isEmployerGuidanceLane) {
      return {
        level: 'medium',
        reasons: ['employer_guidance_low_corroboration'],
      };
    }
    return {
      level: 'high',
      reasons: ['external_source_low_corroboration', 'missing_core_contexts'],
    };
  }

  if (missingCore > 0 || missingContexts.length >= 3) {
    return {
      level: 'medium',
      reasons: ['partial_context'],
    };
  }

  if (trustTier === 'external') {
    return {
      level: 'medium',
      reasons: ['external_source'],
    };
  }

  return {
    level: 'low',
    reasons: ['context_coverage_ok'],
  };
}

function evaluateConfidence({
  trustTier,
  evidenceScope,
  pageTypes,
  missingContexts,
  evidenceCount,
}) {
  let score = mapTrustTierScore(trustTier);

  if (evidenceScope === 'specific_case') score += 0.1;
  if (evidenceScope === 'aggregated_index') score -= 0.05;
  if (pageTypes.includes('case_detail') || pageTypes.includes('case_guide')) score += 0.05;
  if (
    pageTypes.some((pageType) =>
      /employer_toolkit|employer_publication|training_course/i.test(String(pageType || '')),
    )
  ) {
    score += 0.03;
  }
  score -= Math.min(0.3, missingContexts.length * 0.04);
  score += Math.min(0.18, Math.max(0, evidenceCount - 1) * 0.03);
  score = Number(clamp(score, 0.05, 0.95).toFixed(3));

  const level = score >= 0.75 ? 'high' : score >= 0.55 ? 'medium' : 'low';
  return { score, level };
}

function makeCandidate(record, { claimType, signal = null, keywords = [] }) {
  const ctx = record.interactionContext || {};
  const picked = pickSentence(getClaimText(record), keywords, record);
  const statement = normalizeClaimInput(picked.statement);
  const canonicalStatement = normalizeForKey(statement);
  if (!canonicalStatement) {
    return {
      candidate: null,
      rejectionReason: 'empty_canonical_statement',
      skippedReasons: picked.skippedReasons || [],
    };
  }

  const quality = evaluateStatementQuality(statement, record);
  if (!quality.isAccepted) {
    return {
      candidate: null,
      rejectionReason: quality.reason || 'quality_rejected',
      skippedReasons: picked.skippedReasons || [],
    };
  }

  const coverage = inferContextCoverage(record);
  const noteType = normalizeNoteType(ctx.noteType);
  const evidenceScope = ctx.evidenceScope || 'unknown';
  const pageType = ctx.pageType || 'unknown';
  const candidateBase = {
    claimType,
    signal,
    statement,
    canonicalStatement,
    sourceId: record.sourceId,
    recordId: record.id,
    filePath: record.filePath,
    excerpt: buildClaimExcerpt(record),
    sourceUrl: ctx.finalUrl || ctx.sourceUrl || null,
    country: ctx.country || 'unknown',
    legalContext: ctx.legalContext || 'unspecified',
    language: ctx.language || 'unknown',
    trustTier: ctx.trustTier || 'unknown',
    pageType,
    evidenceScope,
    noteType,
    curationRiskLevel: ctx.curationRiskLevel || null,
    mustPairWithRegionalSupport: Boolean(ctx.mustPairWithRegionalSupport),
    disabilityFacets: uniqueSorted(ctx.disabilityFacets || ctx.disabilityHints || []),
    conditionLabels: uniqueSorted(ctx.conditionLabels || []),
    disabilityLabels: uniqueSorted(ctx.disabilityLabels || []),
    industryFacets: uniqueSorted(ctx.industryFacets || []),
    companySizeFacets: uniqueSorted(ctx.companySizeFacets || []),
    accommodationFacets: uniqueSorted(ctx.accommodationFacets || ctx.supportTypeHints || []),
    outcomeFacets: uniqueSorted(ctx.outcomeFacets || []),
    practicalTitleJa: normalizeWhitespace(ctx.practicalTitleJa || ''),
    practicalSummaryJa: normalizeWhitespace(ctx.practicalSummaryJa || ''),
    usageFocus: normalizeWhitespace(ctx.usageFocus || ''),
    applicabilityConditionsJa: normalizeWhitespace(ctx.applicabilityConditionsJa || ''),
    missingContexts: coverage.missingContexts,
    presentContexts: CONTEXT_DOMAINS.filter((domain) => !coverage.missingContexts.includes(domain)),
  };
  const evidenceLane = deriveCandidateEvidenceLane(candidateBase);
  const evidenceRole = deriveCandidateEvidenceRole({
    ...candidateBase,
    evidenceLane,
  });

  return {
    candidate: {
      ...candidateBase,
      evidenceLane,
      evidenceRole,
    },
    rejectionReason: null,
    skippedReasons: picked.skippedReasons || [],
  };
}

function buildCandidates(record) {
  if (record.contentType === 'metadata_only')
    return { candidates: [], rejections: [], attemptedCount: 0 };
  if (!getClaimText(record) || getClaimText(record).trim().length < 20)
    return { candidates: [], rejections: [], attemptedCount: 0 };

  const ctx = record.interactionContext || {};
  const recordSkip = recordSkipReason(record);
  if (recordSkip) {
    return {
      candidates: [],
      rejections: [
        {
          reason: recordSkip,
          sourceId: record.sourceId || 'unknown',
          pageType: ctx.pageType || 'unknown',
          evidenceScope: ctx.evidenceScope || 'unknown',
          stage: 'record_gate',
        },
      ],
      attemptedCount: 0,
    };
  }
  const signals = ctx.interactionModelSignals || {};
  const candidates = [];
  const rejections = [];
  let attemptedCount = 0;

  const registerAttempt = (attempt) => {
    if (!attempt) return;
    attemptedCount += 1;
    const skippedReasons = Array.isArray(attempt.skippedReasons) ? attempt.skippedReasons : [];
    for (const reason of skippedReasons) {
      rejections.push({
        reason: reason || 'quality_rejected',
        sourceId: record.sourceId || 'unknown',
        pageType: ctx.pageType || 'unknown',
        evidenceScope: ctx.evidenceScope || 'unknown',
        stage: 'sentence_selection',
      });
    }
    if (attempt.candidate) {
      candidates.push(attempt.candidate);
      return;
    }
    rejections.push({
      reason: attempt.rejectionReason || 'unknown_rejection',
      sourceId: record.sourceId || 'unknown',
      pageType: ctx.pageType || 'unknown',
      evidenceScope: ctx.evidenceScope || 'unknown',
      stage: 'candidate_emission',
    });
  };

  for (const [signal, isActive] of Object.entries(signals)) {
    if (!isActive) continue;
    registerAttempt(
      makeCandidate(record, {
        claimType: 'interaction_signal',
        signal,
        keywords: SIGNAL_KEYWORDS[signal] || [],
      }),
    );
  }

  const accommodationFacets = uniqueSorted([
    ...(ctx.accommodationFacets || []),
    ...(ctx.supportTypeHints || []),
  ]);
  if (accommodationFacets.length > 0) {
    const keywords = uniqueSorted(
      accommodationFacets
        .flatMap((facet) => ACCOMMODATION_KEYWORDS[facet] || [])
        .concat(['配慮', 'adjustment', 'support']),
    );
    registerAttempt(
      makeCandidate(record, {
        claimType: 'accommodation_action',
        signal: null,
        keywords,
      }),
    );
  }

  const outcomeFacets = uniqueSorted(ctx.outcomeFacets || []);
  if (outcomeFacets.length > 0) {
    const keywords = uniqueSorted(
      outcomeFacets.flatMap((facet) => OUTCOME_KEYWORDS[facet] || []).concat(['結果', 'outcome']),
    );
    registerAttempt(
      makeCandidate(record, {
        claimType: 'outcome_signal',
        signal: null,
        keywords,
      }),
    );
  }

  return {
    candidates,
    rejections,
    attemptedCount,
  };
}

function mergeCandidate(aggregate, candidate) {
  aggregate.evidenceCount += 1;
  aggregate.sourceIds.add(candidate.sourceId);
  aggregate.recordIds.add(candidate.recordId);
  aggregate.filePaths.add(candidate.filePath);
  if (candidate.sourceUrl) aggregate.sourceUrls.add(candidate.sourceUrl);
  aggregate.countries.add(candidate.country);
  aggregate.legalContexts.add(candidate.legalContext);
  aggregate.languages.add(candidate.language);
  aggregate.trustTiers.add(candidate.trustTier);
  aggregate.pageTypes.add(candidate.pageType);
  aggregate.evidenceScopes.add(candidate.evidenceScope);
  aggregate.evidenceLanes.add(candidate.evidenceLane);
  aggregate.evidenceRoles.add(candidate.evidenceRole);
  if (candidate.noteType) aggregate.noteTypes.add(candidate.noteType);
  if (candidate.curationRiskLevel) aggregate.curationRiskLevels.add(candidate.curationRiskLevel);
  aggregate.mustPairWithRegionalSupport =
    aggregate.mustPairWithRegionalSupport || candidate.mustPairWithRegionalSupport;
  candidate.disabilityFacets.forEach((value) => aggregate.disabilityFacets.add(value));
  candidate.conditionLabels.forEach((value) => aggregate.conditionLabels.add(value));
  candidate.disabilityLabels.forEach((value) => aggregate.disabilityLabels.add(value));
  candidate.industryFacets.forEach((value) => aggregate.industryFacets.add(value));
  candidate.companySizeFacets.forEach((value) => aggregate.companySizeFacets.add(value));
  candidate.accommodationFacets.forEach((value) => aggregate.accommodationFacets.add(value));
  candidate.outcomeFacets.forEach((value) => aggregate.outcomeFacets.add(value));
  candidate.presentContexts.forEach((domain) => {
    aggregate.contextHits[domain] = (aggregate.contextHits[domain] || 0) + 1;
  });

  if (aggregate.sampleExcerpts.length < 3) {
    aggregate.sampleExcerpts.push({
      recordId: candidate.recordId,
      sourceId: candidate.sourceId,
      filePath: candidate.filePath,
      sourceUrl: candidate.sourceUrl,
      excerpt: candidate.excerpt,
      practicalTitleJa: candidate.practicalTitleJa || null,
      practicalSummaryJa: candidate.practicalSummaryJa || null,
      usageFocus: candidate.usageFocus || null,
      applicabilityConditionsJa: candidate.applicabilityConditionsJa || null,
    });
  }
}

async function readJsonl(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function initializeAggregate(candidate) {
  return {
    key: candidateAggregateKey(candidate),
    claimType: candidate.claimType,
    signal: candidate.signal,
    statement: candidate.statement,
    canonicalStatement: candidate.canonicalStatement,
    evidenceCount: 0,
    sourceIds: new Set(),
    recordIds: new Set(),
    filePaths: new Set(),
    sourceUrls: new Set(),
    countries: new Set(),
    legalContexts: new Set(),
    languages: new Set(),
    trustTiers: new Set(),
    pageTypes: new Set(),
    evidenceScopes: new Set(),
    evidenceLanes: new Set(),
    evidenceRoles: new Set(),
    noteTypes: new Set(),
    curationRiskLevels: new Set(),
    mustPairWithRegionalSupport: false,
    disabilityFacets: new Set(),
    conditionLabels: new Set(),
    disabilityLabels: new Set(),
    industryFacets: new Set(),
    companySizeFacets: new Set(),
    accommodationFacets: new Set(),
    outcomeFacets: new Set(),
    contextHits: Object.fromEntries(CONTEXT_DOMAINS.map((domain) => [domain, 0])),
    sampleExcerpts: [],
  };
}

function candidateAggregateKey(candidate) {
  const evidenceScope = candidate.evidenceScope || 'unknown';
  const evidenceLane = candidate.evidenceLane || 'unknown';
  const evidenceRole = candidate.evidenceRole || 'related_reading';
  const canonicalStatement = candidate.canonicalStatement;

  if (evidenceRole === 'related_reading') {
    return [
      'related_reading',
      candidate.sourceId || 'unknown',
      evidenceScope,
      evidenceLane,
      canonicalStatement,
    ].join('|');
  }

  return [
    candidate.claimType,
    candidate.signal || 'none',
    evidenceScope,
    evidenceLane,
    evidenceRole,
    canonicalStatement,
  ].join('|');
}

function buildApplicability(aggregate) {
  const missingContexts = CONTEXT_DOMAINS.filter(
    (domain) => (aggregate.contextHits[domain] || 0) === 0,
  );
  const conditions = [];

  const evidenceScopes = Array.from(aggregate.evidenceScopes);
  if (evidenceScopes.includes('specific_case')) {
    conditions.push(
      'Treat as case-bounded evidence; verify transferability to current workplace context.',
    );
  }
  if (evidenceScopes.includes('aggregated_index')) {
    conditions.push(
      'Treat as index-level evidence; require additional case/detail confirmation before action.',
    );
  }
  if (aggregate.countries.size > 0) {
    const countries = Array.from(aggregate.countries).filter((value) => value !== 'unknown');
    if (countries.length > 0) {
      conditions.push(`Apply with jurisdiction check (${countries.join(', ')} legal context).`);
    }
  }
  if (aggregate.industryFacets.size > 0) {
    conditions.push(
      `Industry sensitivity present: ${Array.from(aggregate.industryFacets).join(', ')}.`,
    );
  }

  return {
    missingContexts,
    isPartial: missingContexts.length > 0,
    conditions,
  };
}

function primaryTrustTier(trustTiers) {
  if (trustTiers.includes('primary')) return 'primary';
  if (trustTiers.includes('secondary')) return 'secondary';
  if (trustTiers.includes('external')) return 'external';
  return 'unknown';
}

function primaryEvidenceScope(evidenceScopes) {
  if (evidenceScopes.includes('specific_case')) return 'specific_case';
  if (evidenceScopes.includes('aggregated_index')) return 'aggregated_index';
  return 'unknown';
}

function toClaim(aggregate) {
  const sourceIds = Array.from(aggregate.sourceIds).sort();
  const trustTiers = Array.from(aggregate.trustTiers);
  const pageTypes = Array.from(aggregate.pageTypes);
  const evidenceScopes = Array.from(aggregate.evidenceScopes);
  const evidenceLaneCandidates = uniqueSorted(Array.from(aggregate.evidenceLanes));
  const evidenceLane =
    evidenceLaneCandidates.length === 1
      ? evidenceLaneCandidates[0]
      : inferEvidenceLane({
          sourceIds,
          evidenceScopes,
          pageTypes,
        });
  const applicability = buildApplicability(aggregate);
  const risk = evaluateRisk({
    evidenceScope: primaryEvidenceScope(evidenceScopes),
    trustTier: primaryTrustTier(trustTiers),
    missingContexts: applicability.missingContexts,
    evidenceCount: aggregate.evidenceCount,
    evidenceLane,
  });
  const confidence = evaluateConfidence({
    trustTier: primaryTrustTier(trustTiers),
    evidenceScope: primaryEvidenceScope(evidenceScopes),
    pageTypes,
    missingContexts: applicability.missingContexts,
    evidenceCount: aggregate.evidenceCount,
  });
  const provenance = buildProvenance({
    evidenceRoles: Array.from(aggregate.evidenceRoles),
    noteTypes: Array.from(aggregate.noteTypes),
    curationRiskLevels: Array.from(aggregate.curationRiskLevels),
    mustPairWithRegionalSupport: aggregate.mustPairWithRegionalSupport,
  });

  const id = createHash('sha1').update(aggregate.key).digest('hex').slice(0, 16);

  return {
    id,
    claimType: aggregate.claimType,
    signal: aggregate.signal,
    statement: aggregate.statement,
    canonicalStatement: aggregate.canonicalStatement,
    evidenceCount: aggregate.evidenceCount,
    sourceIds,
    evidenceRecordIds: Array.from(aggregate.recordIds).sort(),
    sampleExcerpts: aggregate.sampleExcerpts,
    interactionContextSummary: {
      countries: uniqueSorted(Array.from(aggregate.countries)),
      legalContexts: uniqueSorted(Array.from(aggregate.legalContexts)),
      languages: uniqueSorted(Array.from(aggregate.languages)),
      trustTiers: uniqueSorted(Array.from(aggregate.trustTiers)),
      pageTypes: uniqueSorted(Array.from(aggregate.pageTypes)),
      evidenceScopes: uniqueSorted(Array.from(aggregate.evidenceScopes)),
      evidenceLane,
      disabilityFacets: uniqueSorted(Array.from(aggregate.disabilityFacets)),
      conditionLabels: uniqueSorted(Array.from(aggregate.conditionLabels)),
      disabilityLabels: uniqueSorted(Array.from(aggregate.disabilityLabels)),
      industryFacets: uniqueSorted(Array.from(aggregate.industryFacets)),
      companySizeFacets: uniqueSorted(Array.from(aggregate.companySizeFacets)),
      accommodationFacets: uniqueSorted(Array.from(aggregate.accommodationFacets)),
      outcomeFacets: uniqueSorted(Array.from(aggregate.outcomeFacets)),
    },
    applicability,
    risk,
    confidence,
    provenance,
  };
}

function increment(map, key, amount = 1) {
  map[key] = (map[key] || 0) + amount;
}

async function main() {
  const records = await readJsonl(inputPath);
  const aggregateMap = new Map();
  let attemptedCandidateCount = 0;
  let candidateCount = 0;
  let boilerplateRejectedCount = 0;
  let sentenceSelectionRejectedCount = 0;
  let candidateEmissionRejectedCount = 0;
  let eligibleRecordCount = 0;
  const rejectedByReason = {};
  const rejectedBySourceId = {};
  const rejectedByPageType = {};
  const rejectedByEvidenceScope = {};
  const rejectedByStage = {};

  for (const record of records) {
    const { candidates, rejections, attemptedCount } = buildCandidates(record);
    attemptedCandidateCount += attemptedCount;

    for (const rejection of rejections) {
      boilerplateRejectedCount += 1;
      if (rejection.stage === 'sentence_selection') sentenceSelectionRejectedCount += 1;
      if (rejection.stage === 'candidate_emission') candidateEmissionRejectedCount += 1;
      increment(rejectedByReason, rejection.reason || 'unknown_rejection');
      increment(rejectedBySourceId, rejection.sourceId || 'unknown');
      increment(rejectedByPageType, rejection.pageType || 'unknown');
      increment(rejectedByEvidenceScope, rejection.evidenceScope || 'unknown');
      increment(rejectedByStage, rejection.stage || 'unknown');
    }

    if (attemptedCount === 0) continue;
    eligibleRecordCount += 1;

    for (const candidate of candidates) {
      candidateCount += 1;
      const key = candidateAggregateKey(candidate);
      if (!aggregateMap.has(key)) {
        aggregateMap.set(key, initializeAggregate(candidate));
      }
      mergeCandidate(aggregateMap.get(key), candidate);
    }
  }

  const claims = Array.from(aggregateMap.values()).map((aggregate) => toClaim(aggregate));
  claims.sort((a, b) => {
    if (b.evidenceCount !== a.evidenceCount) return b.evidenceCount - a.evidenceCount;
    return b.confidence.score - a.confidence.score;
  });

  const byClaimType = {};
  const bySignal = {};
  const byRiskLevel = {};
  const byConfidenceLevel = {};
  const bySourceId = {};
  const byCountry = {};
  const byLegalContext = {};
  const byEvidenceScope = {};
  const byEvidenceLane = {};
  const byEvidenceRole = {};
  let partialClaims = 0;

  for (const claim of claims) {
    increment(byClaimType, claim.claimType);
    increment(byRiskLevel, claim.risk.level);
    increment(byConfidenceLevel, claim.confidence.level);
    if (claim.signal) increment(bySignal, claim.signal);
    if (claim.applicability.isPartial) partialClaims += 1;

    for (const sourceId of claim.sourceIds) increment(bySourceId, sourceId);
    for (const country of claim.interactionContextSummary.countries) increment(byCountry, country);
    for (const legalContext of claim.interactionContextSummary.legalContexts)
      increment(byLegalContext, legalContext);
    for (const evidenceScope of claim.interactionContextSummary.evidenceScopes)
      increment(byEvidenceScope, evidenceScope);
    increment(byEvidenceLane, claim.interactionContextSummary.evidenceLane || 'unknown');
    increment(byEvidenceRole, claim.provenance?.evidenceRole || 'related_reading');
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    inputPath,
    outputPath,
    inputRecordCount: records.length,
    eligibleRecordCount,
    attemptedCandidateCount,
    candidateCount,
    boilerplateRejectedCount,
    sentenceSelectionRejectedCount,
    candidateEmissionRejectedCount,
    claimCount: claims.length,
    dedupReductionPct:
      candidateCount === 0
        ? 0
        : Number((((candidateCount - claims.length) / candidateCount) * 100).toFixed(1)),
    partialClaimCount: partialClaims,
    byClaimType,
    bySignal,
    byRiskLevel,
    byConfidenceLevel,
    bySourceId,
    byCountry,
    byLegalContext,
    byEvidenceScope,
    byEvidenceLane,
    byEvidenceRole,
    rejectedByReason,
    rejectedBySourceId,
    rejectedByPageType,
    rejectedByEvidenceScope,
    rejectedByStage,
  };

  await fs.writeFile(
    outputPath,
    claims.map((claim) => JSON.stringify(claim)).join('\n') + '\n',
    'utf8',
  );
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Claims written: ${outputPath}`);
  console.log(`Claims count: ${claims.length}`);
  console.log(`Candidates: ${candidateCount}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
