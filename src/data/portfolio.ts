import type { BadgeVariant } from '../components/ui';

export interface HeroPillar {
  title: string;
  description: string;
}

export type ProjectFilterGroup = 'public-health' | 'tooling';

export interface ProjectCaseStudy {
  id: string;
  filterGroup: ProjectFilterGroup;
  isFlagship?: boolean;
  category: string;
  badgeVariant: BadgeVariant;
  originLabel: string;
  title: string;
  summary: string;
  problem: string;
  roleApproach: string;
  verifiedOutcome: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  isExternal: boolean;
}

export interface LabPreviewCard {
  src: string;
  alt: string;
  title: string;
  caption: string;
  href: string;
  isSvg?: boolean;
}

export interface ExperienceItem {
  title: string;
  period: string;
  isCurrent?: boolean;
  organization: string;
  employmentType?: string;
  location?: string;
  bullets: Array<{ before?: string; strong?: string; after?: string }>;
}

export interface Basics {
  name: string;
  eyebrow: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  siteUrl: string;
  linkedinUrl: string;
  linkedinHandle: string;
  githubUrl: string;
  githubHandle: string;
  resumePdf: string;
}

export const BASICS: Basics = {
  name: 'Mars Cruz, MPH, CHES',
  eyebrow: 'Public Health & Applied Informatics',
  headline:
    'Public Health Educator \u00b7 Program Implementation and Evaluation \u00b7 Community Partnerships',
  summary:
    'Public health educator and program coordinator with 8+ years of experience translating regulatory compliance and prevention science into plain-language training and measurable operations.',
  location: 'Denver, CO (Remote & Hybrid)',
  email: 'nalcs.mika@gmail.com',
  siteUrl: 'https://tribrigademars.github.io/',
  linkedinUrl: 'https://www.linkedin.com/in/mars-cruz-6099b930a/',
  linkedinHandle: 'mars-cruz-6099b930a',
  githubUrl: 'https://github.com/TriBrigadeMars',
  githubHandle: 'TriBrigadeMars',
  resumePdf: 'assets/resume.pdf',
};

/** "Employer · Employment type · Location", exactly as the résumé renders it. */
export function experienceMeta(role: ExperienceItem): string {
  return [role.organization, role.employmentType, role.location].filter(Boolean).join(' \u00b7 ');
}

export interface SkillGroup {
  title: string;
  dotClass: string;
  skills: string[];
}

export interface EducationItem {
  badge: string;
  badgeVariant: BadgeVariant;
  kind: 'degree' | 'credential';
  degree: string;
  field: string;
  fieldHighlight?: boolean;
  institution: string;
}

export const HERO_PILLARS: HeroPillar[] = [
  {
    title: 'Compliance Education',
    description:
      'Plain-language Title VII, Title IX, and ADA/WCAG training curricula and tabletop exercises.',
  },
  {
    title: 'Evaluation & Analytics',
    description:
      'CDC 6-step pre/post evaluation paired with SQL, Tableau, and Excel compliance reporting.',
  },
  {
    title: 'Local-First Tooling',
    description:
      'Offline desktop and multi-harness QA workflows designed to protect sensitive records.',
  },
];

export const LAB_PREVIEW_STRIP: LabPreviewCard[] = [
  {
    src: 'assets/education/fa-day1/thumbs/page-04.webp',
    alt: 'Slide preview: Four Types of Workplace Conflict comparing Task, Process, Status, and Relationship conflict',
    title: 'Student Services Day 1',
    caption: 'Four Types of Workplace Conflict deck',
    href: 'education.html#slide-decks',
  },
  {
    src: 'assets/education/gdg-ai/thumbs/gdg-slide-05.webp',
    alt: 'Slide preview: Case 1 Rebuilding a 52-page Canvas LMS prevention course',
    title: 'GDG Denver AI for Good',
    caption: '52-page Canvas course QA pipeline',
    href: 'education.html#slide-decks',
  },
  {
    src: 'assets/education/diagrams/five_ds_workplace.svg',
    alt: 'Deterministic SVG diagram: The 5 Ds of bystander intervention in the workplace',
    title: '5 Ds Pedagogical Model',
    caption: 'Deterministic accessible SVG framework',
    href: 'education.html#visual-frameworks',
    isSvg: true,
  },
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'title-vii-analytics',
    filterGroup: 'public-health',
    isFlagship: true,
    category: 'Compliance & Workforce Analytics',
    badgeVariant: 'teal',
    originLabel: 'University R1',
    title: 'Title VII Compliance Analytics & Reporting',
    summary:
      'Built recurring SQL reporting pipelines and Tableau compliance dashboards covering an academic and clinical community of over 22,000 members.',
    problem:
      'Campus leadership and outreach units needed timely visibility into training adherence and outreach gaps across an academic and clinical community of over 22,000 members.',
    roleApproach:
      'As Prevention, Education, and Outreach (PEO) Coordinator, authored SQL queries over quantitative teammate records and built interactive Tableau dashboards for institutional leaders.',
    verifiedOutcome:
      'Delivered recurring SQL reporting pipelines and audit-ready compliance visibility across institutional lanes.',
    tags: ['SQL', 'Tableau', 'Title VII / IX', 'Compliance Reporting'],
    ctaLabel: 'Read Experience Details',
    ctaHref: '#experience',
    isExternal: false,
  },
  {
    id: 'titleix-policy-tracker',
    filterGroup: 'public-health',
    isFlagship: true,
    category: 'Regulatory & Policy Informatics',
    badgeVariant: 'teal',
    originLabel: 'Work Sample',
    title: 'Title IX & Civil Rights Policy Tracker',
    summary:
      'Dual-mode web and local offline statutory tracker enabling side-by-side comparison of proposed and enacted federal and state Title IX rules.',
    problem:
      'Researchers, advocates, and policy staff need to compare proposed and enacted federal and state Title IX rules across both connected and offline environments.',
    roleApproach:
      'Independent work sample engineered from one codebase as a hosted Next.js 15 and PostgreSQL web app and an offline desktop shell via embedded PGlite, Electron, and Rust/Tauri v2.',
    verifiedOutcome:
      'Supports dual web and local offline statutory comparison with local Unix-socket / PGlite storage; source repository published on GitHub.',
    tags: ['Next.js 15', 'PostgreSQL / PGlite', 'Tauri v2 / Electron', 'Title IX'],
    ctaLabel: 'View Repository',
    ctaHref: 'https://github.com/TriBrigadeMars/titleix-policy-tracker',
    isExternal: true,
  },
  {
    id: 'gdg-denver-curriculum',
    filterGroup: 'public-health',
    isFlagship: true,
    category: 'Public-Interest AI Literacy',
    badgeVariant: 'yellow',
    originLabel: 'Workshop Sample',
    title: 'GDG Denver \u201cAI for Good\u201d Curriculum & QA Lab',
    summary:
      'Non-coder AI governance workshop documenting offline sandboxes, a 52-page Canvas LMS rebuild, a 6-step voice guard, and 3-critic visual audits.',
    problem:
      'Practitioners adopting AI tools without software backgrounds face risks of citation errors, accessibility gaps, and eroded educator voice.',
    roleApproach:
      'Independent workshop sample ("AI for Good, From a Non-Coder\'s Desk") detailing offline sandboxes, a 52-page Canvas LMS course rebuild, a 6-step voice guard, and 3-critic visual audits.',
    verifiedOutcome:
      'Documents stage-gated course QA, read-only file hygiene controls, and 12 annotated slide walkthroughs in the interactive Curriculum Lab.',
    tags: ['Canvas LMS / IMSCC', '3-Critic QA', 'WCAG 2.2 AA', 'Public Sans'],
    ctaLabel: 'Open Workshop Deck & Case Studies',
    ctaHref: 'education.html#slide-decks',
    isExternal: false,
  },
  {
    id: 'resume-tailor',
    filterGroup: 'tooling',
    category: 'Data Governance & Plain Language',
    badgeVariant: 'blue',
    originLabel: 'Work Sample',
    title: 'Resume Tailor (Local AI Rewriter)',
    summary:
      'Offline desktop application using a local Ollama LLM to align structured writing against competency requirements without external cloud API uploads.',
    problem:
      'Sensitive career, personnel, and policy materials cannot be uploaded to external cloud AI APIs when adapting writing to plain-language standards.',
    roleApproach:
      'Independent work sample built as a local-first desktop app comparing structured documents against target competency requirements via a local Ollama LLM instance.',
    verifiedOutcome:
      'Demonstrates offline plain-language alignment and competency comparison with zero sensitive data sent to external cloud APIs; source repository published on GitHub.',
    tags: ['Data Governance', 'Plain Language', 'Ollama', 'Local LLMs'],
    ctaLabel: 'View Source Code',
    ctaHref: 'https://github.com/TriBrigadeMars/resume-tailor',
    isExternal: true,
  },
  {
    id: 'android-kiosk',
    filterGroup: 'tooling',
    category: 'Clinical Field & Device Controls',
    badgeVariant: 'purple',
    originLabel: 'Work Sample',
    title: 'Android Kiosk Lock Task App',
    summary:
      'Java Android SDK utility locking community health intake kiosks and screening tablets into approved single-purpose workflows via enterprise LockTask mode.',
    problem:
      'Community health intake kiosks, outpatient clinical screening tablets, and field survey stations risk tampering when devices remain unlocked to general OS apps.',
    roleApproach:
      'Independent work sample built in Java on the Android SDK using enterprise LockTask mode to lock devices into single-purpose clinical and survey interfaces.',
    verifiedOutcome:
      'Provides tamper-resistant hardware lockdown keeping point-of-care field devices confined to approved workflows; repository published on GitHub.',
    tags: ['Android SDK', 'Java', 'LockTask API', 'Clinical Intake'],
    ctaLabel: 'View Repository',
    ctaHref: 'https://github.com/TriBrigadeMars/Android-Kiosk-Lock-Task-App',
    isExternal: true,
  },
  {
    id: 'hermes-profile-sync',
    filterGroup: 'tooling',
    category: 'Workflow Standardization & Auditability',
    badgeVariant: 'yellow',
    originLabel: 'Work Sample',
    title: 'Hermes Agent Profile Sync',
    summary:
      'Python cross-environment synchronization utility tracking and aligning deterministic standard operating procedures across isolated workstations.',
    problem:
      'Cross-machine configuration drift undermines deterministic workflows and reproducible standard operating procedures (SOPs) across isolated workstations.',
    roleApproach:
      'Independent work sample implemented in Python as a cross-environment synchronization utility tracking and aligning reproducible workstation states.',
    verifiedOutcome:
      'Maintains deterministic, auditable environment configurations across isolated workstations; source repository published on GitHub.',
    tags: ['Process Standardization', 'Auditability', 'Python'],
    ctaLabel: 'View Repository',
    ctaHref: 'https://github.com/TriBrigadeMars/hermes-profile-sync',
    isExternal: true,
  },
  {
    id: 'office-equity-open-notebook',
    filterGroup: 'tooling',
    category: 'Local-First Research & Policy RAG',
    badgeVariant: 'blue',
    originLabel: 'Work Sample',
    title: 'Office of Equity Open Notebook',
    summary:
      'Zero-Docker Windows Electron installer bundling Python 3.12, Node.js, SurrealDB, and Docling for local-model policy synthesis.',
    problem:
      'Non-technical staff cannot rely on Docker setup when synthesizing public research and policy guides using local LLMs.',
    roleApproach:
      'Independent work sample wrapping the open-source Open Notebook stack in a self-contained Windows Electron installer bundling Python 3.12, Node.js, SurrealDB, and Docling.',
    verifiedOutcome:
      'Enables zero-Docker desktop installation and multi-model grounded synthesis via Ollama or LM Studio with local SurrealDB storage; source published on GitHub.',
    tags: ['Electron', 'SurrealDB', 'Docling', 'Grounded RAG'],
    ctaLabel: 'View Repository',
    ctaHref: 'https://github.com/TriBrigadeMars/Office-Equity-Open-Notebook',
    isExternal: true,
  },
  {
    id: 't3-code-master-config',
    filterGroup: 'tooling',
    category: 'Agentic QA & Environment Sync',
    badgeVariant: 'purple',
    originLabel: 'Work Sample',
    title: 'T3 Code Master Config & Multi-Harness QA',
    summary:
      'Secret-free configuration synchronization and dry-run merge pipeline maintaining parity across six local and CLI agent harnesses.',
    problem:
      'Synchronizing multiple AI harnesses and local models risks configuration skew or leaking secrets and local session databases.',
    roleApproach:
      'Independent work sample creating a configuration-only synchronization framework with dry-run merging across T3 Code Nightly, LM Studio Bionic, Antigravity, Claude Code, Codex, and Hermes.',
    verifiedOutcome:
      'Maintains multi-harness parity with secret-free config templates and zero vendored session databases; repository published on GitHub.',
    tags: ['Multi-Harness Sync', 'LM Studio Bionic', 'Guardrails'],
    ctaLabel: 'View Repository',
    ctaHref: 'https://github.com/TriBrigadeMars/t3-code-master-config',
    isExternal: true,
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    title: 'Prevention, Education, and Outreach (PEO) Coordinator',
    period: 'September 2024 — Present',
    isCurrent: true,
    organization: 'University of Colorado',
    employmentType: 'Full-Time (40 hr/week)',
    location: 'Denver, CO',
    bullets: [
      {
        before:
          'Serve as a technical and regulatory resource for campus leadership and medical providers, translating complex statutory mandates (Title VII, Title IX, ADA) into plain-language educational curricula and accessible digital resources.',
      },
      {
        before:
          'Utilize SQL queries and Tableau dashboards to analyze quantitative employee records and produce recurring Title VII compliance reports for institutional leadership.',
      },
      {
        before:
          'Design and deliver virtual and hybrid compliance seminars for faculty, students, and teammates across an R1 academic and clinical community of over 22,000 members.',
      },
      {
        before:
          'Conduct structured teammate onboarding and civil-rights compliance trainings for cohorts of 150+ attendees.',
      },
      {
        before:
          'Coordinate statewide conferences and cross-functional working groups to align best practices and evidence-based strategies on Title IX compliance.',
      },
    ],
  },
  {
    title: 'Political Outreach Consultant',
    period: 'July 2024 — September 2024',
    organization: 'Valley Forward',
    employmentType: 'Part-Time (24 hr/week)',
    bullets: [
      {
        before:
          'Informed and engaged community members on local policy issues; conducted structured perception surveys and field intake.',
      },
      {
        before:
          'Planned field operations and canvassing routes for outreach efficiency leveraging PDI data analytics.',
      },
      {
        before:
          'Collaborated with campaign leadership to track milestones and implement targeted community engagement strategies.',
      },
    ],
  },
  {
    title: 'Senior Program Coordinator',
    period: 'October 2023 — May 2024',
    organization: 'Youth Leadership Institute',
    employmentType: 'Full-Time (40 hr/week)',
    bullets: [
      {
        before:
          'Acted as Project Director for the California Department of Public Health funded program \u201cMobilizing Youth to Nix Tobacco\u201d (MYNT), managing end-to-end grant compliance, evaluation deliverables, and statutory reporting.',
      },
      {
        before:
          'Authored policy position papers, executive talking points, presentations, and regulatory consultation responses for statewide public health prevention engagement.',
      },
      {
        before: 'Supported the ',
        strong: '$750,000 Sierra San Joaquin Jobs (S2J2) initiative',
        after: ' through cross-sector coalition building with regional stakeholders.',
      },
      {
        before:
          'Partnered across development, communications, and executive lanes to advance public health policy initiatives in Fresno County and the Central Valley.',
      },
      {
        before:
          'Co-facilitated three youth participatory action research electives, engaging 60\u201370 students per class in research methodology and leadership development.',
      },
      {
        before:
          'Supervised Senior Program Coordinators deploying multi-county health education initiatives across Fresno and Madera Counties.',
      },
    ],
  },
  {
    title: 'Community Health Worker',
    period: 'March 2023 — October 2023',
    organization: 'Centro La Familia Advocacy Services',
    employmentType: 'Full-Time (36.5 hr/week)',
    bullets: [
      {
        before:
          'Supported an active client roster of 15\u201325 individuals, navigating public health benefits, substance use prevention, and housing resources with accessible, plain-language guidance.',
      },
      {
        before:
          'Maintained monthly reporting pipelines including structured case summaries and individualized care plans, tracking progress metrics to inform local resource allocation.',
      },
    ],
  },
  {
    title: 'Health Education Specialist',
    period: 'January 2022 — February 2023',
    organization: 'Merced County Department of Public Health',
    employmentType: 'Full-Time (40 hr/week)',
    bullets: [
      {
        before:
          'Built custom Microsoft Excel visualizations and audit tables using advanced formulas (VLOOKUP, INDEX/MATCH) to track and reconcile open-source Medicaid funding utilization in Merced County.',
      },
      {
        before:
          'Coordinated public health education initiatives for the Local Oral Health Program (LOHP), sustaining operational coalitions between county health leadership and advisory committees.',
      },
      {
        before:
          'Recruited 10\u201315 key community stakeholders per presentation cycle to drive program adoption and health literacy outreach.',
      },
    ],
  },
  {
    title: 'Communicable Disease Investigator',
    period: 'October 2020 — December 2021',
    organization: 'Fresno County Department of Public Health',
    employmentType: 'Full-Time (40 hr/week)',
    bullets: [
      {
        before:
          'Conducted rapid epidemiological screening interviews and case investigations to trace infection sources across a liaison caseload of 25\u201360 school districts.',
      },
      {
        before:
          'Translated evolving state and federal clinical isolation and quarantine guidance into actionable protocols for school administrators, faculty, and health professionals during emergency COVID-19 response.',
      },
    ],
  },
  {
    title: 'Program Coordinator',
    period: 'August 2017 — October 2020',
    organization: 'Fresno Barrios Unidos',
    employmentType: 'Full-Time (40 hr/week)',
    bullets: [
      {
        before:
          'Administered Apricot CRM system to audit funding streams, foundation deliverables, and longitudinal client service delivery.',
      },
      {
        before:
          'Served as community liaison with City of Fresno councilmembers and municipal staff to advocate for ',
        strong: '$500k+ in capital funding',
        after: ' for public wireless networks and bus rapid transit.',
      },
      {
        before:
          'Coordinated youth development and violence prevention cohorts (Men with Heart & Joven Noble), enrolling over 20 youth per cycle.',
      },
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Compliance, Policy & Accessible Communications',
    dotClass: 'bg-teal-600',
    skills: [
      'Title VII & Title IX Compliance',
      'ADA & Digital Accessibility',
      'Plain-Language Health Literacy',
      'Regulatory & Policy Analysis',
      'Grant Compliance & Reporting',
      'CHES Certification',
      'WCAG 2.2 AA & Section 508 Auditing',
      'FERPA & HIPAA Safe Harbor De-Identification',
      'APA 7 Citation & Evidence Verification',
    ],
  },
  {
    title: 'Analytics & Data Reporting',
    dotClass: 'bg-skyline-600',
    skills: [
      'SQL',
      'Tableau Dashboards',
      'Advanced Excel (VLOOKUP, INDEX/MATCH, VBA)',
      'Medicaid Utilization Tracking',
      'R',
      'Atlas.ti',
      'PDI Analytics',
      'CDC 6-Step Program Evaluation',
      'Paired Pre/Post Psychometrics (Wilcoxon / Cohen\u2019s d)',
      'QualCoder & Reflexive Thematic Analysis',
    ],
  },
  {
    title: 'Program Operations & Systems',
    dotClass: 'bg-gold-500',
    skills: [
      'Cross-Functional Project Coordination',
      'Coalition & Stakeholder Alignment',
      'Teammate Onboarding & Training',
      'Percipio LMS',
      'Apricot CRM',
      'Google Workspace & Microsoft 365',
      'Bloom\u2019s Taxonomy Curriculum Design',
      '5 Ds & VUCA Bystander Pedagogy',
      'Canvas LMS (Common Cartridge / IMSCC)',
    ],
  },
  {
    title: 'Applied Technical & Local AI Work Samples',
    dotClass: 'bg-terracotta',
    skills: [
      'Ollama & Local LLMs',
      'Python',
      'Android LockTask / Kiosk Mode',
      'Git & GitHub',
      'Tailwind CSS',
      'Sitefinity CMS',
      'Local OCR & PII Redaction (PyMuPDF / Tesseract)',
      'Multi-Agent QA Workflows',
      'SurrealDB & Grounded Policy RAG',
    ],
  },
];

export const EDUCATIONS: EducationItem[] = [
  {
    badge: 'Graduate Degree',
    badgeVariant: 'yellow',
    kind: 'degree',
    degree: 'Master of Public Health (MPH)',
    field: 'Health Promotion & Health Education',
    fieldHighlight: true,
    institution: 'California State University San Marcos',
  },
  {
    badge: 'Undergraduate Degree',
    badgeVariant: 'neutral',
    kind: 'degree',
    degree: 'Bachelor of Science (BS)',
    field: 'Health Science \u2014 Community Health Option',
    institution: 'California State University Fresno',
  },
  {
    badge: 'National Credential',
    badgeVariant: 'teal',
    kind: 'credential',
    degree: 'Certified Health Education Specialist',
    field: 'CHES · NCHEC',
    fieldHighlight: true,
    institution: 'NCHEC',
  },
];

export const AI_FILES = [
  {
    eyebrow: 'Site manual for agents',
    filename: 'llms.txt',
    description: 'What this site is, what it is not, and what not to infer.',
  },
  {
    eyebrow: 'Whole page, one request',
    filename: 'llms-full.txt',
    description: 'The full résumé as Markdown, regenerated from this page on every build.',
  },
  {
    eyebrow: 'Guardrails, machine-readable',
    filename: 'facts.json',
    description: 'Privacy and evidence rules, as regexes with no private values.',
  },
  {
    eyebrow: 'Working in this repository',
    filename: 'AGENTS.md',
    description: 'Build commands, sources of truth, and claim rules for coding agents.',
  },
];
