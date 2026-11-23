export type DeckKey = 'fa1' | 'fa2' | 'gdg' | 'rads' | 'saam';

export interface SlideItem {
  src: string;
  thumb: string;
  title: string;
  purpose: string;
  talking: string;
  qa: string;
}

export interface DeckDefinition {
  key: DeckKey;
  tabLabel: string;
  badge: string;
  slides: SlideItem[];
}

export interface LearningObjective {
  initiative: string;
  initLabel: string;
  code: string;
  bloom: string;
  bloomLabel: string;
  statement: string;
  pre: string;
  post: string;
  construct: string;
}

export type ConstructKey = 'conflict' | 'leave' | 'bystander' | 'reporting';

export interface ConstructDetail {
  key: ConstructKey;
  label: string;
  pre: string;
  post: string;
  rationale: string;
}

export type ScenarioKey = 'f1' | 'far1' | 'far2' | 'rad6';

export interface ScenarioDefinition {
  key: ScenarioKey;
  cardLabel: string;
  cardTitle: string;
  cardSub: string;
  badge: string;
  ds: string;
  title: string;
  context: string;
  seats: Array<{ role: string; desc: string }>;
  dialogue: Array<{ speaker: string; line: string; italic?: boolean }>;
  freeze: string;
  publicRoom: { gives: string; takes: string; moves: string };
  privateRoom: { gives: string; takes: string; moves: string };
  layers: Array<{ layer: string; owner: string; action: string; channel: string }>;
}

export interface SvgDiagram {
  src: string;
  zoomTitle: string;
  alt: string;
  title: string;
  description: string;
}

export interface QaCard {
  src: string;
  alt: string;
  title: string;
  description: string;
  codeToken?: string;
}

function slide(
  dir: string,
  stem: string,
  title: string,
  purpose: string,
  talking: string,
  qa: string,
): SlideItem {
  return {
    src: `assets/education/${dir}/${stem}.webp`,
    thumb: `assets/education/${dir}/thumbs/${stem}.webp`,
    title,
    purpose,
    talking,
    qa,
  };
}

export const DECKS: Record<DeckKey, DeckDefinition> = {
  fa1: {
    key: 'fa1',
    tabLabel: '1. Student Services Day 1 (9 Slides)',
    badge: 'Student Services · Day 1 (60 Min)',
    slides: [
      slide(
        'fa-day1',
        'page-02',
        'Why Workplace Norms Matter',
        'Sets psychological safety foundation during high-volume student registration and financial aid cycles.',
        'Connects everyday operational queue friction to Edmondson (1999) team psychological safety so staff view norms as workflow infrastructure rather than abstract policy.',
        '13.333 x 7.5 in widescreen canvas; >= 18pt body text; <= 40 words per slide face.',
      ),
      slide(
        'fa-day1',
        'page-03',
        'Day One Learning Objectives',
        'Establishes 3 measurable behavioral goals and opens with a low-stakes check-in prompt.',
        'Frames the day around diagnosing conflict types, practicing the 5 Ds, and running 4-role tabletop scenarios.',
        'Split from dense legacy slide into focused 3-bullet learning frame.',
      ),
      slide(
        'fa-day1',
        'page-04',
        'Four Types of Workplace Conflict',
        'Diagnostic framework distinguishing Task, Process, Status, and Relationship conflict.',
        'Highlights Jehn & Bendersky (2003) and Lamm et al. (2020): task/process disagreements can sharpen operations when respectful, whereas status/relationship friction erodes trust.',
        'Paired with deterministic conflict_four_types.svg; acronyms (SAP) expanded at first use.',
      ),
      slide(
        'fa-day1',
        'page-05',
        'Workplace Incivility and Escalation',
        'Illustrates how low-intensity incivility escalates into hostile environments when normalized.',
        'Cites Smith & Griffiths (2022) to clarify why interrupting early, low-intensity slights prevents downstream formal grievances.',
        'Paired with escalation_spectrum.svg; high-contrast WCAG AA palette.',
      ),
      slide(
        'fa-day1',
        'page-06',
        'Psychological Safety and Silence',
        'Examines why witnesses freeze or stay silent during public workplace friction.',
        'Uses Edmondson (1999, p. 354) verbatim definition to reframe bystander silence as a structural safety gap rather than personal apathy.',
        'Direct quote verified against primary PDF source.',
      ),
      slide(
        'fa-day1',
        'page-07',
        '5 Ds of Bystander Intervention',
        'Introduces Direct, Distract, Delegate, Delay, and Document with non-confrontational entry points.',
        'Emphasizes that four of the five Ds are indirect by design so junior or non-supervisory staff never feel forced into unsafe confrontation.',
        'Paired with five_ds_workplace.svg; clean reading order verified.',
      ),
      slide(
        'fa-day1',
        'page-08',
        'Activity: Four-Role Case Practice',
        'Launches the 15-minute tabletop breakout across Complainant, Respondent, Witness 1, and Witness 2.',
        'Assigns seats with clear ground rules: practice options, allow passing on any role, and never re-litigate real personnel cases.',
        'Paired with four_role_framework.svg; detailed scripts kept in speaker notes.',
      ),
      slide(
        'fa-day1',
        'page-09',
        'Day One Takeaways & Day Two Bridge',
        'Consolidates Day 1 lessons and previews Day 2 statutory contexts.',
        'Connects foundational norms to Day 2 focus on FMLA, ADA, PWFA accommodations, and Title VI front-counter equity.',
        'Acronyms expanded in notes; concise takeaway bullets.',
      ),
      slide(
        'fa-day1',
        'page-12',
        'APA 7 References (Day One)',
        'Provides transparent scholarly provenance for all Day 1 empirical claims.',
        'Every in-slide citation maps 1-to-1 to a verified peer-reviewed reference.',
        '100% APA 7 citation audit pass via Crossref/OpenAlex verification.',
      ),
    ],
  },
  fa2: {
    key: 'fa2',
    tabLabel: '2. Student Services Day 2 (11 Slides)',
    badge: 'Student Services · Day 2 (60 Min)',
    slides: [
      slide(
        'fa-day2',
        'page-02',
        'Why We Are Here: Dual Team Demands',
        'Acknowledges enrollment, census, and disbursement deadline strain on student services staff.',
        'Validates real operational workload bottlenecks before introducing legal and equity standards.',
        'Split from dense legacy slide; <= 40 words on face.',
      ),
      slide(
        'fa-day2',
        'page-03',
        'Day Two Session Goals',
        'Articulates statutory objectives across FMLA, ADA, PWFA, and Title VI.',
        'Links workplace accommodation climate (McMahon & McMahon, 2016; EEOC, 2024) directly to everyday team communication.',
        'All statutory acronyms expanded at first use.',
      ),
      slide(
        'fa-day2',
        'page-04',
        'Upstander Leadership in Student Services',
        'Connects proactive team coaching and psychological safety to staff retention.',
        'Synthesizes Cannon-Bowers et al. (2023), Lamm et al. (2020), and Strickland & Martins (2026) to frame everyday peer intervention as leadership.',
        'All citations verified against primary abstracts/PDFs.',
      ),
      slide(
        'fa-day2',
        'page-05',
        'Understanding VUCA in Student Services',
        'Spells out Volatility, Uncertainty, Complexity, and Ambiguity during peak periods.',
        'Explains how sudden regulatory shifts and queue spikes trigger reactive snap judgments unless teams build rehearsed scripts.',
        'Replaced unconfirmable 1987 attribution with verified Cernega et al. (2024).',
      ),
      slide(
        'fa-day2',
        'page-06',
        'Leave Resentment & Hostile Environment',
        'Clarifies legal boundaries under Title VII, FMLA, ADA, and Muldrow v. City of St. Louis (2024).',
        'Distinguishes legitimate coverage planning from punitive pressure or resentment aimed at colleagues taking protected medical/family leave.',
        'Legal audit verified statutory citations and Supreme Court precedent.',
      ),
      slide(
        'fa-day2',
        'page-07',
        'Frontline Bias & Title VI Profiling',
        'Addresses equitable policy enforcement at the student counter and appeal queue.',
        'Draws on Hypolite & Tichavakunda (2019) to examine how uneven administrative scrutiny affects protected student populations.',
        'Paraphrased cleanly to avoid unverified direct quotes.',
      ),
      slide(
        'fa-day2',
        'page-08',
        'Scenario Activity: Practicing the Redirect',
        'Guides tables through Diagnose -> Select -> Craft using the 5 Ds sequence.',
        'Pairs with Activity A cards so staff rehearse both public-floor and private-office interventions.',
        'Paired with five_ds_strip.svg; full role prompts stored in handout.',
      ),
      slide(
        'fa-day2',
        'page-09',
        'Resolving the Moment, Person & System',
        'Presents the three-layer accountability ladder from immediate redirect to leadership loop closure.',
        'Emphasizes that systemic workload redistribution belongs to leadership rather than peer resentment.',
        'Paired with resolution_layers.svg.',
      ),
      slide(
        'fa-day2',
        'page-10',
        'Duty to Report & Escalation Doors',
        'Maps affirmative reporting duties across Title VI, Title IX/PWFA, ADA/504, and HR.',
        'Clarifies that responsible employees cannot promise confidentiality and routes reports cleanly without stigma.',
        'Aligned to U.S. Department of Education (2024) and institutional procedures.',
      ),
      slide(
        'fa-day2',
        'page-13',
        'APA 7 References (Page 1 of 2)',
        'First reference spread for Day 2 empirical and statutory claims.',
        'Provides transparent verification trail for leadership and curriculum reviewers.',
        '1-to-1 match between slide citations and reference entries.',
      ),
      slide(
        'fa-day2',
        'page-14',
        'APA 7 References (Page 2 of 2)',
        'Second reference spread completing verified Day 2 bibliography.',
        'Documents corrected publication years and primary author lists verified via Crossref.',
        'Zero uncited or mismatched bibliography items.',
      ),
    ],
  },
  gdg: {
    key: 'gdg',
    tabLabel: '3. GDG Denver AI for Good (12 Slides)',
    badge: 'GDG Denver · AI for Good (Nov 2026)',
    slides: [
      slide(
        'gdg-ai',
        'gdg-slide-02',
        'Why Go Past a Chat Box?',
        'Contrasts ephemeral single-tab AI prompts against folder-grounded, reproducible workflows.',
        'Explains three limits of a plain chat window (amnesia, copy-paste drift, zero paper trail) vs. local checklists and repeatable checks.',
        '100% Public Sans typography; CU Denver x Mile High Five accessible contrast.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-03',
        'How I Keep People Safe',
        'Draws the bright data-governance boundary between institutional work tools and after-hours sandboxes.',
        'Private cases, PII, and credentials stay strictly inside approved work systems; off-hours learning uses public studies or synthetic scenarios.',
        '50/50 navy/snow contrast split with explicit data-firewall framing.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-04',
        'Four Real Projects, Plainly Mapped',
        'Overview matrix mapping 4 workflows, verification mechanisms, and final human decision gates.',
        'Demonstrates how non-developers embed scripts and independent reviewers across every educational artifact.',
        'Tabular reading order verified; high-contrast forest-green human gate column.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-05',
        'Case 1: Rebuilding a Student Course',
        'Walks through merging two Title IX prevention courses into a 52-page offline Canvas package.',
        'Shows the 4-step pipeline: Written Rules -> 21 Public Studies -> Citation & Access Checks -> 52-Page Ready Course.',
        'Official policy pages kept byte-identical and offline.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-06',
        'What Worked and What Silently Failed',
        'Shares concrete error catches from verification scripts vs. manual inspection.',
        'Verification caught 6 citation defects (1 altered study title, 5 invented initials) while manual reopening caught 220 shapes with blank alt text despite a script claiming success.',
        'Demonstrates skeptical audit culture: never trust a single pass without reopening the file.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-07',
        "Case 2: Fixing Generic 'AI Voice'",
        'Introduces the 6-step plain-text editorial board for preserving human educator tone.',
        'Drafts pass Genre Check, Pattern Counter, Voice Guard, Targeted Edit, Skeptical Reader, and Final Human Gate.',
        'Grounded in plain-language prose research; editable without coding.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-08',
        'Keeping Your Real Voice Intact',
        'Defines three hard rules that protect facts, hedged claims, and natural cadence during edits.',
        'Locks dates/quotes, prevents silent upgrading of cautious research findings, and caps revision loops at 2 tries.',
        'Accessible sandstone pull-quote card with high-contrast navy typography.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-09',
        'Case 3: Never Let One AI Grade Its Own Work',
        'Illustrates a two-round, 3-critic visual and content review over a 16-slide deck and handouts.',
        'Even after automated layout scripts passed, Critic 2 flagged a participant card leaking answers on Page 2 before Round 2 cleared the packet.',
        'Independent visual inspection across rendered slide images.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-10',
        'Scripts Check Layout. People Check Meaning.',
        'Separates deterministic script checks from irreplaceable human pedagogical judgment.',
        'Scripts check 18pt minimums, contrast, and privacy patterns; people catch awkward page breaks, screen-reader flow, and classroom warmth.',
        'Reinforces human-in-the-loop accountability.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-11',
        'Case 4: Knowing When to Skip AI',
        'Highlights a $0, zero-AI scheduled Python script for weekly workspace hygiene.',
        'Scans 43,802 files into a read-only Excel cleanup report with zero autonomous deletions—proving simple deterministic tools often outperform LLMs.',
        'Read-only safety architecture; zero destructive side effects.',
      ),
      slide(
        'gdg-ai',
        'gdg-slide-12',
        'Honest Post-Mortem: What Actually Broke',
        'Documents real technical failures candidly so learners expect friction and build guardrails.',
        "Covers runaway/vanishing cron schedules, frozen COM PDF exports under 12 GB RAM, and halted long-running subagents.",
        "Honest reporting builds practitioner trust; anchored by 'AI drafts. People decide.'",
      ),
      slide(
        'gdg-ai',
        'gdg-slide-13',
        'Steal This: Start Safely Monday',
        'Leaves attendees with 3 practical habits and a 5-check sticky note for reviewing outputs.',
        'Test on fake stories first, pair code math with human judgment, audit history weekly, and verify Goal, Power, Voice, Facts, Time.',
        'Actionable 5-point takeaway poster in high-contrast Public Sans.',
      ),
    ],
  },
  rads: {
    key: 'rads',
    tabLabel: '4. Academic Medicine Redirects (4 Slides)',
    badge: 'Academic Medicine · Clinical Faculty',
    slides: [
      slide(
        'clinical-rads',
        'slide_5',
        'Team Activity: VUCA-Powered Redirect',
        '3-minute clinical teamwork exercise translating VUCA stress dynamics into a spoken upstander redirect.',
        'Guides attending physicians, fellows, and residents to name the VUCA pressure, select a safe D, and craft one non-punitive sentence.',
        'Designed for high-hierarchy reading-room and inpatient clinical dynamics.',
      ),
      slide(
        'clinical-rads',
        'slide_6',
        'Every Scenario Has Three Layers',
        'Maps clinical intervention across Immediate Safety, Interpersonal Support, and Institutional Accountability.',
        'Demonstrates how executive coaching mindset bridges in-the-moment de-escalation to GME, ADA, and Title IX resolution ladders.',
        'High-contrast layered card layout with explicit time progression.',
      ),
      slide(
        'clinical-rads',
        'slide_7',
        'Academic & Clinical Citations (Page 1 of 2)',
        'Documents peer-reviewed clinical workplace mistreatment, coaching, and healthcare VUCA literature.',
        'Grounds training in Cannon-Bowers et al. (2023), Cernega et al. (2024), Dawdy et al. (2021), Fard et al. (2025), and Fu et al. (2022).',
        'APA 7 formatting with full DOIs.',
      ),
      slide(
        'clinical-rads',
        'slide_10',
        'Academic & Clinical Citations (Page 2 of 2)',
        'Completes peer-reviewed reference list covering cardiology, nursing, conflict longitudinal evaluation, and microaggressions.',
        'Includes Lamm et al. (2020), Mammen et al. (2023), McMahon & McMahon (2016), Mehta et al. (2025), Nicolau et al. (2023), Smith & Griffiths (2022), and Strickland & Martins (2026).',
        'Supports clinical credibility with evidence-driven medical audiences.',
      ),
    ],
  },
  saam: {
    key: 'saam',
    tabLabel: '5. Graduate Public Health & SAAM (5 Visuals)',
    badge: 'Graduate Public Health & SAAM Campaign',
    slides: [
      slide(
        'saam',
        '01_SAAM_Day_of_Action_Resource_Walk',
        'SAAM Day of Action & Resource Walk',
        'Interactive five-station resource walk connecting Denim Day solidarity to concrete campus support pathways.',
        "Includes explicit content note: 'Topics include sexual violence. Engage at your own pace. Sharing a personal experience is never required.'",
        'Trauma-informed opt-in language + clear visual hierarchy.',
      ),
      slide(
        'saam',
        '02_Healing_Science_and_Solidarity',
        'Healing, Science & Solidarity',
        'Pairs the Clothesline Project art installation with public health student and faculty prevention research posters.',
        'Bridges survivor-centered community solidarity with graduate public health practicum and research pathways.',
        'Non-carceral framing emphasizing choice and accessible campus connections.',
      ),
      slide(
        'saam',
        '03_It_Starts_Here_SAAM_Kickoff',
        'It Starts Here: SAAM Kickoff',
        'Low-barrier morning gathering with an optional community prevention pledge wall.',
        'Explicitly notes that participation and photography are optional so students and clinical trainees control their engagement.',
        'Clean typographic hierarchy with bold section signposts.',
      ),
      slide(
        'saam',
        '04_30_Days_of_SAAM_Teal_in_April',
        '30 Days of SAAM: Teal in April',
        'Month-long daily prevention prompt series featuring brief supportive scripts and resource spotlights.',
        'Incorporates explicit healthcare privacy reminders: avoid patient information and share images only with permission.',
        'Tailored for clinical/medical campus privacy standards (HIPAA-aware).',
      ),
      slide(
        'saam',
        '05_When_Youre_the_One_Who_Helps',
        "When You're the One Who Helps",
        'Provider-focused 4-part lunch-and-learn series for health sciences trainees, faculty, and clinicians.',
        'Covers medical forensic exam expectations, trauma-informed clinical referrals, academic/clinical harassment options, and LGBTQIA+/disabled survivor inclusion.',
        'Directly answers clinical provider disclosure-response gaps identified in literature.',
      ),
    ],
  },
};

export const DECK_ORDER: DeckKey[] = ['fa1', 'fa2', 'gdg', 'rads', 'saam'];

export const OBJECTIVES: LearningObjective[] = [
  {
    initiative: 'day1',
    initLabel: 'Student Services Day 1',
    code: 'LO1',
    bloom: 'understand',
    bloomLabel: '1. Understand & Identify',
    statement:
      'Define healthy workplace norms and identify the four distinct types of workplace conflict (Task, Process, Status, Relationship), recognizing which poses the greatest systemic risk to team trust.',
    pre: 'Pre Q4 & Q5: Baseline understanding of healthy norms & 4 conflict types',
    post: 'Post Q3 & Q4: Increased norm awareness & distinguishing productive vs. toxic conflict',
    construct: 'Normative Culture & Conflict Taxonomy Literacy (Wilcoxon signed-rank)',
  },
  {
    initiative: 'day1',
    initLabel: 'Student Services Day 1',
    code: 'LO2',
    bloom: 'analyze',
    bloomLabel: '2. Analyze & Differentiate',
    statement:
      'Differentiate between productive professional debate (task/process) and toxic interpersonal friction (relationship/status), assessing how queue bottlenecks impact team communication.',
    pre: 'Pre Q6: Baseline autonomy to build respectful cross-role relationships',
    post: 'Post Q5: Enhanced confidence navigating difficult colleague conversations',
    construct: 'Relational Self-Efficacy & Diagnostic Acuity',
  },
  {
    initiative: 'day1',
    initLabel: 'Student Services Day 1',
    code: 'LO3',
    bloom: 'apply',
    bloomLabel: '3. Apply & Practice',
    statement:
      'Apply the 5 Ds of Bystander Intervention (Direct, Distract, Delegate, Delay, Document) to interrupt everyday incivility and de-escalate tension in peer and student encounters.',
    pre: 'Pre Q7 & Q8: Baseline de-escalation skills & readiness to step in',
    post: 'Post Q6 & Q7: Increased actionable verbal tools & 5 Ds self-efficacy',
    construct: 'Collaborative De-escalation & Upstander Self-Efficacy',
  },
  {
    initiative: 'day1',
    initLabel: 'Student Services Day 1',
    code: 'LO4',
    bloom: 'apply',
    bloomLabel: '3. Apply & Practice',
    statement:
      'Practice collaborative problem-solving across four tabletop perspectives (Complainant, Respondent, Witness 1, Witness 2) to build empathy and shared accountability.',
    pre: 'Pre Q3: Preferred experiential learning modalities',
    post: 'Activity evaluation: Perceived scenario realism & seat reflection',
    construct: 'Experiential Perspective-Taking Fidelity',
  },
  {
    initiative: 'day2',
    initLabel: 'Student Services Day 2',
    code: 'LO1',
    bloom: 'understand',
    bloomLabel: '1. Understand & Identify',
    statement:
      'Identify how peak-season operational pressures (VUCA) during registration, census date, and disbursement cutoffs amplify interpersonal friction, coverage resentment, and counter escalation.',
    pre: 'Pre Q1: Recognizing seasonal VUCA pressure on incivility',
    post: 'Post Q4: Understanding how VUCA surges affect team communication',
    construct: 'Situational Awareness & Stress Drivers (Cernega et al., 2024)',
  },
  {
    initiative: 'day2',
    initLabel: 'Student Services Day 2',
    code: 'LO2',
    bloom: 'apply',
    bloomLabel: '3. Apply & Practice',
    statement:
      'Apply the 5 Ds Upstander Framework to formulate an immediate, constructive verbal redirect when witnessing leave-related hostility (FMLA/ADA/PWFA) or frontline student profiling (Title VI).',
    pre: 'Pre Q2 & Q3: Recognizing subtle leave hostility & redirect confidence',
    post: 'Post Q3 & Q5: Hostile environment acuity & 5 Ds redirect self-efficacy',
    construct: 'Accommodation Climate & Active Upstander Self-Efficacy',
  },
  {
    initiative: 'day2',
    initLabel: 'Student Services Day 2',
    code: 'LO3',
    bloom: 'evaluate',
    bloomLabel: '4. Evaluate & Resolve',
    statement:
      'Distinguish between immediate de-escalation (The Moment), empathetic peer check-ins (The Person), and leadership loop-closure (The System) to fix workload bottlenecks without targeting accommodated peers.',
    pre: 'Pre Q4: Understanding systemic resolution & leadership loop-closure',
    post: 'Post Q6: Navigating all three layers (Moment, Person, System)',
    construct: 'Systems-Based Accountability',
  },
  {
    initiative: 'day2',
    initLabel: 'Student Services Day 2',
    code: 'LO4',
    bloom: 'navigate',
    bloomLabel: '5. Navigate & Report',
    statement:
      'Understand the affirmative Duty to Report under Title VI, Title IX, PWFA, and ADA, navigating department leadership, Ombuds, and Office of Equity while recognizing strict anti-retaliation protections.',
    pre: 'Pre Q5: Clarity on Duty to Report & anti-retaliation rules',
    post: 'Post Q7: Confidence in reporting doors & supportive measures',
    construct: 'Institutional Compliance Literacy (APS 5065)',
  },
  {
    initiative: 'clinical',
    initLabel: 'Academic Medicine',
    code: 'RAD-LO1',
    bloom: 'understand',
    bloomLabel: '1. Understand & Identify',
    statement:
      'Identify how clinical VUCA conditions (stat add-on surges, sign-out handoffs, hierarchy) amplify workplace incivility and create psychological barriers to intervening.',
    pre: 'Pre Item 1: Recognizing VUCA impact in clinical care',
    post: 'Post Item 4: Knowledge gain on clinical VUCA communication',
    construct: 'Clinical Situational Awareness',
  },
  {
    initiative: 'clinical',
    initLabel: 'Academic Medicine',
    code: 'RAD-LO2',
    bloom: 'apply',
    bloomLabel: '3. Apply & Practice',
    statement:
      'Apply executive coaching principles and the 5 Ds to formulate an immediate, constructive redirect in response to a microaggression in both public/group and one-on-one settings.',
    pre: 'Pre Item 2 & 3: Microaggression recognition & coaching confidence',
    post: 'Post Item 3 & 5: Subtle slight recognition & setting-adapted redirect',
    construct: 'Executive Coaching & Upstander Self-Efficacy',
  },
  {
    initiative: 'clinical',
    initLabel: 'Academic Medicine',
    code: 'RAD-LO3',
    bloom: 'evaluate',
    bloomLabel: '4. Evaluate & Resolve',
    statement:
      'Evaluate multi-layered resolution pathways (Immediate, Same-Day, Systemic) to move beyond temporary fixes toward clinical departmental accountability.',
    pre: 'Pre Item 4: Baseline understanding of post-incident follow-through',
    post: 'Post Item 6: Ability to articulate 3-layer accountability',
    construct: 'ACGME Systems-Based Practice',
  },
  {
    initiative: 'clinical',
    initLabel: 'Academic Medicine',
    code: 'RAD-LO4',
    bloom: 'navigate',
    bloomLabel: '5. Navigate & Report',
    statement:
      'Identify the designated Department Trusted Advisor and institutional escalation channels (Office of Equity, GME, Title IX, ADA/504) for confidential or formal support.',
    pre: 'Pre Item 5: Baseline knowledge of local reporting doors',
    post: 'Post Item 7: Clarity on Trusted Advisor & escalation paths',
    construct: 'Clinical Resource Literacy (Fard et al., 2025)',
  },
  {
    initiative: 'csph',
    initLabel: 'CSPH Graduate Public Health',
    code: 'CEQ-3',
    bloom: 'analyze',
    bloomLabel: '2. Analyze & Differentiate',
    statement:
      'Evaluate whether Title IX jurisdiction (34 C.F.R. Part 106) covers off-campus digital harassment and non-consensual AI-generated synthetic imagery limiting equal program access.',
    pre: 'Pre KNOW1-2: Binary legal knowledge items (SGIC paired)',
    post: 'Post KNOW1-2: Paired McNemar / Wilcoxon legal accuracy gain',
    construct: 'Digital Title IX & AI Harassment Literacy',
  },
  {
    initiative: 'csph',
    initLabel: 'CSPH Graduate Public Health',
    code: 'CEQ-4',
    bloom: 'apply',
    bloomLabel: '3. Apply & Practice',
    statement:
      'Demonstrate digital bystander intervention self-efficacy (EFF1-6) and behavioral intent (INT1-4), including forensic screenshot documentation and indirect distraction in group chats.',
    pre: 'Pre EFF1-6 & INT1-4 (5-pt scales)',
    post: "Post EFF1-6 & INT1-4 (Target Cohen's d >= 0.40, N >= 48)",
    construct: 'Digital Bystander Efficacy (Banyard 2007; Kettrey 2019)',
  },
  {
    initiative: 'csph',
    initLabel: 'CSPH Graduate Public Health',
    code: 'CEQ-5',
    bloom: 'navigate',
    bloomLabel: '5. Navigate & Report',
    statement:
      'Differentiate 100% legally confidential resources (Campus Ombuds, Mental Health) from private reporting channels and explain standalone supportive measures for GTAs/GRAs.',
    pre: 'Pre KNOW3-5 & DIS1-4 (Retaliation fear subscale)',
    post: 'Post KNOW3-5 & DIS1-4 (Reduced retaliation fear)',
    construct: 'Disclosure Attitude & Retaliation Safety (Fard et al., 2025)',
  },
  {
    initiative: 'canvas',
    initLabel: 'Canvas Respect Expected 3.0',
    code: 'LMS-1',
    bloom: 'understand',
    bloomLabel: '1. Understand & Identify',
    statement:
      'Unify the 5 Ds bystander model with BRAVE trauma-informed support principles across 52 Common Cartridge (.imscc) pages tailored to both students and clinical trainees.',
    pre: 'Baseline course audit across two legacy sandboxes',
    post: 'Merged 52-page course with woven APA 7 research evidence',
    construct: 'Evidence-Informed Curriculum Synthesis',
  },
  {
    initiative: 'canvas',
    initLabel: 'Canvas Respect Expected 3.0',
    code: 'LMS-2',
    bloom: 'evaluate',
    bloomLabel: '4. Evaluate & Resolve',
    statement:
      'Audit 100% of curriculum research citations against live Crossref/OpenAlex records and Section 508 / WCAG 2.2 semantic HTML rules while locking policy statements verbatim.',
    pre: 'Pre-audit unverified citations & inaccessible layouts',
    post: '100% verified citations + zero-drift policy preservation',
    construct: 'Chain-of-Evidence & Accessibility Governance',
  },
];

export const INITIATIVE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Initiatives (17 Objectives)' },
  { value: 'day1', label: 'Student Services Day 1 (Foundational Norms)' },
  { value: 'day2', label: 'Student Services Day 2 (VUCA, Leave & Title VI)' },
  { value: 'clinical', label: 'Academic Medicine Faculty (Clinical Hierarchy)' },
  { value: 'csph', label: 'CSPH Graduate Public Health (CDC 6-Step & AI Safety)' },
  { value: 'canvas', label: 'Canvas LMS Course Redesign (Respect Expected 3.0)' },
];

export const BLOOM_FILTER_OPTIONS = [
  { value: 'all', label: 'All Cognitive & Behavioral Tiers' },
  { value: 'understand', label: '1. Understand & Identify' },
  { value: 'analyze', label: '2. Analyze & Differentiate' },
  { value: 'apply', label: '3. Apply & Practice' },
  { value: 'evaluate', label: '4. Evaluate & Resolve' },
  { value: 'navigate', label: '5. Navigate & Report' },
];

export const CONSTRUCTS: ConstructDetail[] = [
  {
    key: 'conflict',
    label: 'Conflict Taxonomy Literacy',
    pre: "Pre-Test Item (Q5): 'I can identify the four distinct types of workplace conflict (task, process, status, relationship) and recognize which type poses the greatest danger to team morale.' (5-pt Likert)",
    post: "Post-Test Matched Item (Q4): 'This session improved my ability to distinguish productive task/process debate from destructive relationship conflict.' (Wilcoxon signed-rank paired test)",
    rationale:
      'Why pair anonymously via SGIC? Pairing pre/post items with a non-reversible Self-Generated Identification Code (2 letters of guardian first name + 2-digit birth day + last 2 digits of mobile) measures genuine within-person shift without collecting names or student IDs.',
  },
  {
    key: 'leave',
    label: 'Accommodation & Leave Climate',
    pre: "Pre-Test Item (Day 2 Q2): 'I can readily recognize subtle hostility, passive-aggressive remarks, or workload resentment directed at colleagues utilizing approved medical or family leave (FMLA, ADA, PWFA).'",
    post: "Post-Test Matched Item (Day 2 Q3): 'I have increased awareness of hostile work environment and retaliation risks surrounding protected accommodations and leave.'",
    rationale:
      'Methodological rigor: Separates compliance completion outputs from attitudinal and behavioral shifts, preventing teams from treating attendance counts as proof of culture change.',
  },
  {
    key: 'bystander',
    label: 'Digital & Clinical Bystander Efficacy',
    pre: "Pre-Test Item (CSPH EFF5 & INT): 'How confident do you feel preserving digital forensic evidence (uncompressed screenshots with timestamps and metadata) and applying indirect Ds (Distract, Delay) in a group chat?'",
    post: "Post-Test Matched Item (T3 & 90-Day T4 Booster): Same 6-item Digital Bystander Efficacy scale adapted from Banyard et al. (2007) & Coker et al. (2011), powered for Cohen's d >= 0.40.",
    rationale:
      'Grounded in CDC Step 4 & Creswell Convergent Mixed-Methods: Quantitative Likert shifts are integrated in a joint display with qualitative open-ended vignette coding.',
  },
  {
    key: 'reporting',
    label: 'Duty to Report vs. Confidentiality',
    pre: "Pre-Test Knowledge Item (KNOW4): 'Which campus resource provides 100% LEGAL CONFIDENTIALITY (will NOT trigger a mandatory report to the Office of Equity)?'",
    post: 'Post-Test Matched Check + Retaliation Subscale (DIS): Measures correct differentiation of Campus Ombuds / Mental Health vs. Responsible Employees alongside reductions in retaliation fear (Fard et al., 2025).',
    rationale:
      'Direct corrective feedback: Reduces disclosure hesitation by proving that supportive accommodations do not require initiating a formal disciplinary investigation.',
  },
];

export const SCENARIOS: Record<ScenarioKey, ScenarioDefinition> = {
  f1: {
    key: 'f1',
    cardLabel: 'Card F1 · FMLA / FAMLI',
    cardTitle: '\u201cThe Coverage Plan\u201d',
    cardSub: 'Staff meeting joke \u2192 private leave pressure',
    badge: 'Employee-Employee · FMLA / FAMLI Bonding Leave',
    ds: 'Best-Fit Ds: Distract, Direct, Delay, Document, Delegate',
    title: 'Card F1: "The Coverage Plan"',
    context:
      "Registrar's office. Denise, a records specialist, has an approved FMLA/FAMLI bonding leave starting in two weeks. During a public staff meeting, her supervisor jokes about 'all taking a leave.' Later, privately in an office, the supervisor pressures her to delay leave until after the audit and hints her projects may change.",
    seats: [
      { role: 'Complainant', desc: 'Denise — records specialist with approved bonding leave' },
      { role: 'Respondent', desc: 'Marcus — assistant registrar pressuring leave timing' },
      { role: 'Witness A', desc: 'Tanya — office lead who heard the meeting remark; influences scheduling' },
      { role: 'Witness B', desc: 'Priya — colleague who knows the timeline & leave emails; peer rank' },
    ],
    dialogue: [
      {
        speaker: 'Supervisor (staff meeting):',
        line: '"So who\'s actually doing the work while Denise is out? Maybe we should all take a leave."',
      },
      {
        speaker: 'Denise:',
        line: '(looks down at her notes; says nothing)',
        italic: true,
      },
      {
        speaker: 'Supervisor (private office, later):',
        line: '"Hold the leave until after the audit — it\'s only six weeks. Honestly, maybe take less time. I can\'t promise your projects will look the same when you\'re back."',
      },
    ],
    freeze: 'FREEZE POINT — The supervisor waits for an answer. The coverage calendar is on the wall.',
    publicRoom: {
      gives: 'Social proof, multiple witnesses in earshot, and an immediate chance to reset office norms.',
      takes: 'Denise is exposed in front of peers; awkward silence spreads if nobody redirects.',
      moves:
        "Use Distract ('Let's walk through the cross-training coverage schedule') or a brief calm Direct ('Leave approval belongs to Employee Services, not this meeting'). Document afterward.",
    },
    privateRoom: {
      gives: 'A private conversation free of audience performance and a clear moment for honest support.',
      takes: "No third-party witnesses; high deniability ('my word against yours') when power is asymmetric.",
      moves:
        'Distract is unavailable. Document (dates, exact words, approved leave confirmation) + Delay (check in with Denise, ask what she wants) + Delegate (Employee Services Leave Team & [Institutional Office of Equity] / HR).',
    },
    layers: [
      {
        layer: '1. Immediate — The Moment',
        owner: 'Witness A (Office Lead) or Witness B',
        action:
          'Interrupt public coverage joke by pivoting to objective cross-training planning; pause pressure without escalating publicly.',
        channel: 'Staff meeting / direct floor conversation',
      },
      {
        layer: '2. Same Day — The Person',
        owner: 'Witness B (Peer Colleague)',
        action:
          "Private Delay check-in with Denise; validate that coverage planning is leadership's job, not hers; log exact dates and verbatim statements.",
        channel: 'Private 1-on-1 check-in + timestamped personal notes',
      },
      {
        layer: '3. Systemic — The Institution',
        owner: 'Department Leadership + [Institutional Office of Equity]',
        action:
          'Clarify unit policy: supervisors never negotiate approved FMLA/FAMLI timing; redistribute peak workload equitably without penalizing returning staff.',
        channel: 'Employee Services Leave Team · HR · [Institutional Office of Equity]',
      },
    ],
  },
  far1: {
    key: 'far1',
    cardLabel: 'Card SC-FAR-001 · Student Services',
    cardTitle: '\u201cQueue Backlog Handoff\u201d',
    cardSub: 'Peak census week cross-unit escalation',
    badge: 'Student Services · Interdepartmental Census Week Friction',
    ds: 'Best-Fit Ds: Direct, Distract, Delay, Delegate',
    title: 'Card SC-FAR-001: "The Registration Hold & Queue Backlog Handoff"',
    context:
      'Day four of add/drop week. Student queues are backed up at both the Registrar and Financial Aid counters. A senior registrar specialist walks across an open service floor and loudly blames a newer counselor for a batch sync delay.',
    seats: [
      { role: 'Complainant', desc: 'Jordan — Financial Aid counselor (6 months in role) following verification protocol' },
      { role: 'Respondent', desc: 'Pat — Senior Registrar specialist venting publicly over hold backlog' },
      { role: 'Witness A', desc: 'Adjacent Registrar peer with direct proximity and social capital' },
      { role: 'Witness B', desc: 'Dual-Services lead overseeing cross-departmental handoffs' },
    ],
    dialogue: [
      {
        speaker: 'Senior Specialist:',
        line: '"Jordan, I have thirty students waiting in line because your team sits on approvals. You\'ve been here six months and still don\'t know how to click manual release?"',
      },
      {
        speaker: 'Counselor:',
        line: '"I just received the verification document twenty minutes ago; the batch runs at 1:00 PM..."',
      },
      {
        speaker: 'Senior Specialist:',
        line: '"Checklist? Give me a break! Just do your job so the rest of us don\'t clean up your mess."',
      },
    ],
    freeze: 'FREEZE POINT — Senior specialist prepares to storm back to the counter; counselor stares silently at monitor.',
    publicRoom: {
      gives: 'Proximity to interrupt before students or junior staff absorb the blowup.',
      takes: 'Public humiliation damages newer staff credibility and signals toleration of shouting.',
      moves:
        "Witness A uses Distract ('Pat, step into the nook — I have the batch override screen open') or Lead uses calm Direct ('Jordan is following compliance verification; walk with me to resolve the hold').",
    },
    privateRoom: {
      gives: 'Space to distinguish Task/Process friction (batch timing) from Relationship attack.',
      takes: 'If mirrored in a shared Teams thread or group email, escalation lingers permanently in writing.',
      moves:
        "Do not reply-all. Pull to a 1-on-1 huddle, Delay with Jordan privately ('You followed protocol; want a 10-minute breather while I watch your queue?'), and route batch-sync SOP fix to leads.",
    },
    layers: [
      {
        layer: '1. Immediate — The Moment',
        owner: 'Witness A (Adjacent Peer) & Witness B (Lead)',
        action:
          "Remove audience pressure immediately; pivot from personal blame to clearing the student's provisional registration status.",
        channel: 'Conference nook / Lead desk',
      },
      {
        layer: '2. Same Day — The Person',
        owner: 'Witness A or Dual-Services Lead',
        action:
          'Check in 15 minutes later (Delay); affirm compliance accuracy and offer brief queue relief.',
        channel: 'Private check-in',
      },
      {
        layer: '3. Systemic — The Institution',
        owner: 'Financial Aid & Registrar Supervisors',
        action:
          'Hold brief cross-unit SOP huddle on add/drop manual release timing; establish norm that workflow disputes never happen on the service floor.',
        channel: 'Departmental Leadership Huddle · HR if pattern persists',
      },
    ],
  },
  far2: {
    key: 'far2',
    cardLabel: 'Card SC-FAR-002 · PWFA / ADA',
    cardTitle: '\u201cAccommodation Resentment\u201d',
    cardSub: 'Breakroom remarks \u2192 shift coverage hostility',
    badge: 'Workplace Equity · PWFA / ADA Accommodation Climate',
    ds: 'Best-Fit Ds: Direct, Distract, Delay, Delegate, Document',
    title: 'Card SC-FAR-002: "Peak Season Coverage & Accommodation Resentment"',
    context:
      "Morning breakroom before peak disbursement prep. A teammate utilizes an approved PWFA/ADA modified morning schedule. Colleagues complain aloud that 'some people get special treatment while the rest of us carry the counter.'",
    seats: [
      { role: 'Complainant', desc: 'Accommodated teammate arriving at approved modified shift start' },
      { role: 'Respondent', desc: 'Colleague voicing resentment about shift coverage in breakroom' },
      { role: 'Witness A', desc: 'Peer in breakroom hearing remarks before accommodated peer walks in' },
      { role: 'Witness B', desc: 'Unit supervisor responsible for confidential workload balancing' },
    ],
    dialogue: [
      {
        speaker: 'Colleague A:',
        line: '"Must be nice strolling in at 9:30 every day during peak week while everyone else opens the counter."',
      },
      {
        speaker: 'Colleague B:',
        line: '"Seriously — if you can\'t work normal hours, maybe transfer to a back-office desk instead of dumping morning queues on us."',
      },
    ],
    freeze: 'FREEZE POINT — The accommodated teammate steps into the doorway holding a coffee cup and freezes.',
    publicRoom: {
      gives: 'Immediate opportunity to shut down peer gossip and prevent a hostile breakroom norm.',
      takes: 'Risk of accidentally disclosing confidential medical/pregnancy details while trying to defend the teammate.',
      moves:
        "Use Direct without sharing private info ('Schedules are coordinated with leadership and HR — let's keep comments respectful') or Distract ('Walk with me to grab the morning counter binder').",
    },
    privateRoom: {
      gives: 'Safe space to validate the teammate without putting their health condition on display.',
      takes: 'If unaddressed by supervisors, quiet exclusion continues in shift assignments.',
      moves:
        "Delay privately ('I'm glad you're here — I'll back you up on the morning queue'), Document pattern if repeated, and Delegate staffing coverage concerns to leadership without naming medical status.",
    },
    layers: [
      {
        layer: '1. Immediate — The Moment',
        owner: 'Witness A (Peer in Breakroom)',
        action:
          "Interrupt breakroom chatter cleanly without disclosing or speculating on anyone's accommodation reason.",
        channel: 'Breakroom reset',
      },
      {
        layer: '2. Same Day — The Person',
        owner: 'Witness A + Unit Supervisor',
        action:
          'Private Delay check-in; confirm the accommodated colleague feels supported and safe on shift.',
        channel: 'Private check-in + contemporaneous note',
      },
      {
        layer: '3. Systemic — The Institution',
        owner: 'Unit Supervisor & ADA / PWFA Coordinator',
        action:
          'Audit front-counter staffing formula so approved accommodations are backed by planned coverage rather than uncompensated peer spillover.',
        channel: 'ADA / 504 Coordinator · [Institutional Office of Equity] · HR',
      },
    ],
  },
  rad6: {
    key: 'rad6',
    cardLabel: 'Card SC-RAD-006 · Clinical',
    cardTitle: '\u201cResearch Day Hierarchy\u201d',
    cardSub: 'Senior power-holder stereotype jab',
    badge: 'Academic Medicine · Hierarchy & Sex-Stereotype Bias (OCR Case Adaptation)',
    ds: 'Best-Fit Ds: Distract, Direct, Delay, Document, Delegate',
    title: 'Card SC-RAD-006: "Division Research Day Power Differential"',
    context:
      "Adapted from public federal civil-rights resolution patterns into a clinical learning setting. At division research day, a senior professor on the progress-review committee interrupts a second-year fellow's presentation with a sex-stereotype jab tied to his upcoming evaluation—the second such remark this term.",
    seats: [
      { role: 'Complainant', desc: 'Second-year fellow presenting research at podium' },
      { role: 'Respondent', desc: 'Senior professor sitting on the progress-review committee' },
      { role: 'Witness A', desc: 'Co-fellow in audience holding full detail of both incidents, junior rank' },
      { role: 'Witness B', desc: "Faculty mentor who privately called an earlier remark 'unacceptable' via email, then stopped" },
    ],
    dialogue: [
      {
        speaker: 'Senior Professor:',
        line: '"Of course you took the project in this direction — soft methods for a soft guy. We\'ll see how that holds up at your review."',
      },
      {
        speaker: 'Fellow:',
        line: '(stops mid-slide; laser pointer drops; conference room goes silent)',
        italic: true,
      },
      {
        speaker: 'Faculty Mentor:',
        line: '(opens printed agenda; avoids looking up)',
        italic: true,
      },
    ],
    freeze: 'FREEZE POINT — The room is silent. The fellow is mid-slide waiting to see if anyone speaks up.',
    publicRoom: {
      gives: "Audience witnesses establish corroboration; a peer can restore the presenter's floor immediately.",
      takes: 'Junior co-fellows fear career retaliation on review committees if forced into direct confrontation.',
      moves:
        "Junior Witness A uses Distract ('Before we leave this slide, walk us through the comparative methods and why'); Senior Faculty B uses brief Direct ('That's not feedback — keep comments on the research').",
    },
    privateRoom: {
      gives: 'Mentor can turn private email sympathy into active partnership and documentation.',
      takes: 'Without contemporaneous notes from witnesses, pattern cases stall (in source OCR case, witnesses feared going on record).',
      moves:
        "Delay within the hour ('What he said wasn't about your science; what do you want next?'), Document both dates verbatim with mentor's earlier email attached, and Delegate with trainee consent.",
    },
    layers: [
      {
        layer: '1. Immediate — The Moment',
        owner: 'Witness A (Distract) or Witness B (Direct)',
        action: "Ensure the presenter finishes the talk and isn't left stranded in silence.",
        channel: 'Conference room floor',
      },
      {
        layer: '2. Same Day — The Person',
        owner: 'Co-fellow & Faculty Mentor',
        action: 'Private check-in; document both incidents with dates/exact words; offer accompaniment.',
        channel: 'Timestamped notes + Mentor check-in',
      },
      {
        layer: '3. Systemic — The Institution',
        owner: 'Program Leadership & [Institutional Office of Equity]',
        action:
          'Single intake route for protected-class complaints; adjust review-committee composition as interim protective measure so trainee does not bear retaliation risk.',
        channel: 'Program Director · GME · Department Trusted Advisor · [Institutional Office of Equity]',
      },
    ],
  },
};

export const SCENARIO_ORDER: ScenarioKey[] = ['f1', 'far1', 'far2', 'rad6'];

export const COACHING_PROMPTS = [
  {
    q: '"What did you see and hear?"',
    obj: 'Grounds the conversation in observable facts before assumptions or emotions drive the reporting route.',
  },
  {
    q: '"Which of the 5 Ds feels safe for you — in public, and one-on-one?"',
    obj: 'Normalizes indirect intervention options and helps the colleague notice how room safety shifts.',
  },
  {
    q: '"What is ONE thing you could do before you leave today?"',
    obj: 'Translates awareness into a concrete, time-bound micro-commitment (e.g., Delay check-in or writing dated notes).',
  },
  {
    q: '"Who else should know — and what do you need to go with them?"',
    obj: 'Prepares consent-first Delegation and accompaniment so no affected person walks to a reporting office alone.',
  },
];

export const SVG_DIAGRAMS: SvgDiagram[] = [
  {
    src: 'assets/education/diagrams/conflict_four_types.svg',
    zoomTitle: 'Four Types of Workplace Conflict',
    alt: 'Diagram comparing Task, Process, Status, and Relationship workplace conflict',
    title: 'Four Conflict Types',
    description: 'Separates productive task debate from status and relationship harm.',
  },
  {
    src: 'assets/education/diagrams/escalation_spectrum.svg',
    zoomTitle: 'Workplace Incivility Escalation Spectrum',
    alt: 'Spectrum diagram showing progression from workplace incivility to hostile environment',
    title: 'Escalation Spectrum',
    description: 'Shows how unaddressed micro-behaviors accumulate into pattern risk.',
  },
  {
    src: 'assets/education/diagrams/five_ds_workplace.svg',
    zoomTitle: '5 Ds of Bystander Intervention in the Workplace',
    alt: '5 Ds bystander framework: Direct, Distract, Delegate, Delay, Document',
    title: 'The 5 Ds Framework',
    description: 'Highlights 4 indirect options so safety never requires public confrontation.',
  },
  {
    src: 'assets/education/diagrams/four_role_framework.svg',
    zoomTitle: 'Four-Role Tabletop Practice Framework',
    alt: 'Four tabletop roles: Complainant, Respondent, Witness 1, and Witness 2',
    title: 'Four-Role Tabletop',
    description: 'Structures perspective-taking across impacted, actor, and witness seats.',
  },
  {
    src: 'assets/education/diagrams/vuca_quadrant.svg',
    zoomTitle: 'VUCA Peak-Season Operational Quadrant',
    alt: 'VUCA quadrant showing Volatility, Uncertainty, Complexity, and Ambiguity',
    title: 'VUCA Stress Quadrant',
    description: 'Maps peak census, disbursement, and clinical surge friction drivers.',
  },
  {
    src: 'assets/education/diagrams/five_ds_strip.svg',
    zoomTitle: '5 Ds Quick-Reference Sequence Strip',
    alt: 'Quick-reference horizontal strip of the 5 Ds intervention sequence',
    title: '5 Ds Sequence Strip',
    description: 'Distract in the moment \u2192 Delay that day \u2192 Document \u2192 Delegate.',
  },
  {
    src: 'assets/education/diagrams/resolution_layers.svg',
    zoomTitle: 'Three Layers of Resolution',
    alt: 'Three-layer resolution model: Immediate Moment, Same-Day Person, Systemic Institution',
    title: '3 Resolution Layers',
    description: 'Links immediate safety to peer check-in and structural loop closure.',
  },
  {
    src: 'assets/education/diagrams/action_framework.svg',
    zoomTitle: 'Notice, Name, Document, Delegate Action Framework',
    alt: 'Four-step action loop: Notice, Name, Document, Delegate',
    title: 'Upstander Action Loop',
    description: 'Notice patterns, name policy rights, document facts, delegate cleanly.',
  },
];

export const QA_CARDS: QaCard[] = [
  {
    src: 'assets/education/gdg-ai/slide5_course_flow.webp',
    alt: '4-stage Canvas LMS course redesign workflow from written rules to 52-page offline IMSCC package',
    title: 'Stage-Gated Course Redesign (Respect Expected 3.0)',
    codeToken: '.imscc',
    description:
      'Separated written scope rules, 21 peer-reviewed PDFs, live Crossref/OpenAlex citation checks, and 52-page Common Cartridge (.imscc) packaging while keeping official statutory policy pages byte-locked.',
  },
  {
    src: 'assets/education/gdg-ai/slide7_editorial_board.webp',
    alt: '6-step editorial voice guard stepper from genre check to human final gate',
    title: '6-Step Editorial Voice & Accuracy Guard',
    description:
      'Combines deterministic text-pattern counting with 6 plain-text editorial gates across 8 communication modes so educational handouts keep human warmth without silently inflating hedged research claims.',
  },
  {
    src: 'assets/education/gdg-ai/slide9_three_critics.webp',
    alt: 'Two-round 3-critic visual and content verification card catching leaked answers on page 2',
    title: 'Three-Critic Independent Audit Loop',
    description:
      'Runs deterministic layout checks (18pt minimum slide body font, contrast, bounds) alongside 3 independent visual critics that caught participant handouts accidentally printing facilitator answers before distribution.',
  },
  {
    src: 'assets/education/gdg-ai/slide11_cleanup_card.webp',
    alt: 'Read-only zero-AI file hygiene report card scanning 43,802 files with zero deletions',
    title: 'Knowing When to Skip AI ($0 Deterministic Hygiene)',
    description:
      'Audits 43,802 local workspace files into a read-only Excel report with zero autonomous deletions and zero LLM token cost—reinforcing that deterministic scripts handle housekeeping while educators own judgment.',
  },
];
