import data from "./site.json";

/* ---------------------------------------------------------------------------
   Typed access to the site's content.

   `site.json` is the single source of truth for everything on the page that
   changes over time: profile, experience, projects, toolbox, certifications,
   and writing. The local editor (run `npm run edit`) writes that file; every
   component reads from here, so adding or removing an entry never means
   touching component code.

   Icons are stored as raw SVG path strings (baked from the icon set at build
   time by `scripts/gen-site.mjs`), so nothing here pulls the whole icon
   package into the browser bundle.
--------------------------------------------------------------------------- */

export type ProfileLink = {
  label: string;
  handle: string;
  href: string;
  icon: string;
};

export type Profile = {
  name: string;
  handle: string;
  email: string;
  location: string;
  resume: string;
  blog: string;
  links: ProfileLink[];
};

export type Experience = {
  role: string;
  org: string;
  /** "YYYY-MM" (from a month picker), or "" if unset. */
  start: string;
  /** "YYYY-MM"; ignored when `current` is true. */
  end: string;
  /** When true, the role is ongoing and renders as "… to present". */
  current: boolean;
  note: string;
};

export type ProjectStatus = "Shipped" | "In progress";

export type Project = {
  index: string;
  title: string;
  kind: string;
  status: ProjectStatus;
  summary: string;
  detail: string;
  stack: string[];
  links: { label: string; href: string }[];
  image?: string;
};

export type Skill = { label: string; icon?: string };
export type SkillGroup = { heading: string; blurb: string; skills: Skill[] };

export type Cert = { name: string; issuer: string; image?: string };
export type Certs = { held: Cert[]; inProgress: Cert[]; planned: Cert[] };

export type PostStatus = "Published" | "In progress" | "Planned";
export type Post = {
  title: string;
  note: string;
  status: PostStatus;
  href?: string;
  image?: string;
};

export type Site = {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  certs: Certs;
  posts: Post[];
};

export const site = data as Site;

export const {
  profile,
  experience,
  projects,
  skills,
  certs,
  posts,
} = site;
