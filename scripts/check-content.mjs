import { readFileSync } from "node:fs";

const site = JSON.parse(
  readFileSync(new URL("../app/content/site.json", import.meta.url), "utf-8"),
);

const errors = [];
const need = (value, label) => {
  if (value === undefined || value === null || value === "") {
    errors.push(`Missing ${label}`);
  }
};

for (const key of ["profile", "experience", "projects", "skills", "certs", "posts"]) {
  if (!(key in site)) errors.push(`Missing top-level key: ${key}`);
}

need(site.profile?.name, "profile.name");
need(site.profile?.email, "profile.email");
need(site.profile?.resume, "profile.resume");

const indexes = new Set();
site.projects?.forEach((project, i) => {
  need(project.index, `projects[${i}].index`);
  need(project.title, `projects[${i}].title`);
  need(project.summary, `projects[${i}].summary`);
  if (project.status !== "Shipped" && project.status !== "In progress") {
    errors.push(`projects[${i}].status must be Shipped or In progress`);
  }
  if (!Array.isArray(project.stack) || project.stack.length === 0) {
    errors.push(`projects[${i}].stack must not be empty`);
  }
  if (!Array.isArray(project.links) || project.links.length === 0) {
    errors.push(`projects[${i}].links must not be empty`);
  }
  if (indexes.has(project.index)) {
    errors.push(`Duplicate project index: ${project.index}`);
  }
  indexes.add(project.index);
});

site.posts?.forEach((post, i) => {
  need(post.title, `posts[${i}].title`);
  if (!["Published", "In progress", "Planned"].includes(post.status)) {
    errors.push(`posts[${i}].status is not valid`);
  }
});

site.certs?.held?.forEach((cert, i) => {
  need(cert.name, `certs.held[${i}].name`);
  need(cert.issuer, `certs.held[${i}].issuer`);
});

if (errors.length) {
  console.error("Content check failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `Content check passed: ${site.projects.length} projects, ${site.posts.length} posts, ${site.skills.length} tool groups.`,
);
