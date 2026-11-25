import {
  BASICS,
  EDUCATIONS,
  EXPERIENCES,
  PROJECTS,
  SKILL_GROUPS,
  type ExperienceItem,
} from './portfolio';

/**
 * JSON Resume (https://jsonresume.org) export, derived from the same typed data the
 * page renders so the two cannot drift. Only fields already shown on the site are
 * emitted; employment type has no JSON Resume field and stays on the page only.
 */

interface JsonResumeProfile {
  network: string;
  username: string;
  url: string;
}

interface JsonResumeWork {
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  location?: string;
  highlights: string[];
}

interface JsonResumeEducation {
  institution: string;
  studyType: string;
  area: string;
}

interface JsonResumeSkill {
  name: string;
  keywords: string[];
}

interface JsonResumeProject {
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  url?: string;
}

interface JsonResumeCertificate {
  name: string;
  issuer: string;
}

export interface JsonResume {
  $schema: string;
  basics: {
    name: string;
    label: string;
    email: string;
    url: string;
    summary: string;
    location: { city: string; region: string };
    profiles: JsonResumeProfile[];
  };
  work: JsonResumeWork[];
  education: JsonResumeEducation[];
  certificates: JsonResumeCertificate[];
  skills: JsonResumeSkill[];
  projects: JsonResumeProject[];
  meta: { canonical: string; version: string };
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NUMBERS = new Map(MONTHS.map((name, index) => [name, index + 1]));

/** "September 2024" → "2024-09". Throws loudly on a label the data should never contain. */
function isoMonth(label: string): string {
  const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(label.trim());
  const month = match ? MONTH_NUMBERS.get(match[1]) : undefined;
  if (!match || month === undefined) {
    throw new Error(`JSON Resume: unrecognised month label "${label}"`);
  }
  return `${match[2]}-${String(month).padStart(2, '0')}`;
}

/** "September 2024 — Present" → { startDate: "2024-09" }. */
function periodToRange(period: string): { startDate: string; endDate?: string } {
  const [startLabel, endLabel] = period.split('\u2014').map((part) => part.trim());
  const endDate =
    endLabel && !/^present$/i.test(endLabel) ? isoMonth(endLabel) : undefined;
  return endDate
    ? { startDate: isoMonth(startLabel), endDate }
    : { startDate: isoMonth(startLabel) };
}

function bulletText(bullet: ExperienceItem['bullets'][number]): string {
  return `${bullet.before ?? ''}${bullet.strong ?? ''}${bullet.after ?? ''}`.trim();
}

const WORK: JsonResumeWork[] = EXPERIENCES.map((role) => ({
  name: role.organization,
  position: role.title,
  ...periodToRange(role.period),
  ...(role.location ? { location: role.location } : {}),
  highlights: role.bullets.map(bulletText),
}));

export const JSON_RESUME: JsonResume = {
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    name: BASICS.name,
    label: BASICS.headline,
    email: BASICS.email,
    url: BASICS.siteUrl,
    summary: BASICS.summary,
    location: { city: 'Denver', region: 'CO' },
    profiles: [
      { network: 'LinkedIn', username: BASICS.linkedinHandle, url: BASICS.linkedinUrl },
      { network: 'GitHub', username: BASICS.githubHandle, url: BASICS.githubUrl },
    ],
  },
  work: WORK,
  education: EDUCATIONS.filter((item) => item.kind === 'degree').map((item) => ({
    institution: item.institution,
    studyType: item.degree,
    area: item.field,
  })),
  certificates: EDUCATIONS.filter((item) => item.kind === 'credential').map((item) => ({
    name: item.degree,
    issuer: item.institution,
  })),
  skills: SKILL_GROUPS.map((group) => ({ name: group.title, keywords: group.skills })),
  projects: PROJECTS.map((project) => ({
    name: project.title,
    description: project.summary,
    highlights: [project.verifiedOutcome],
    keywords: project.tags,
    ...(project.isExternal && project.ctaHref.startsWith('https://')
      ? { url: project.ctaHref }
      : {}),
  })),
  meta: { canonical: BASICS.siteUrl, version: 'v1.0.0' },
};

export function serializeResumeJson(): string {
  return `${JSON.stringify(JSON_RESUME, null, 2)}\n`;
}

/** Browser-only download of the export; mirrors assets/resume.pdf as the JSON alternative. */
export function downloadResumeJson(): void {
  const blob = new Blob([serializeResumeJson()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'mars-cruz-resume.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
