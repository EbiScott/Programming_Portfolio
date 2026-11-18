import { profile, projects, skills } from "../content/site";

const ROLE = "Full-stack developer · Backend · Python automation";
const HOOK = "I build APIs, bots, and automation, mostly in Python.";

export default function Hero() {
  const stackCount = skills.reduce((n, g) => n + g.skills.length, 0);
  const words = profile.name.split(" ");

  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__inner">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              BACKEND &nbsp;✦&nbsp; PYTHON BOTS &nbsp;✦&nbsp; APIS &nbsp;✦&nbsp;
              AUTOMATION &nbsp;✦&nbsp; FULL STACK &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section className="hero" id="top" aria-labelledby="hero-name">
        <span className="hero__ghost" aria-hidden="true">
          {profile.handle}
        </span>

        <p className="hero__kicker">
          <span className="dot" aria-hidden="true" />
          Available for backend and automation work
        </p>

        <h1 className="hero__name" id="hero-name">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className={`hero__line${i === 1 ? " hero__line--accent" : ""}`}
            >
              {w}
            </span>
          ))}
        </h1>

        <p className="hero__hook">{HOOK}</p>

        <div className="hero__meta">
          <span>{ROLE}</span>
          <span>{profile.location}</span>
          <span>{profile.handle}</span>
        </div>

        <div className="stats" aria-label="At a glance">
          <div className="stat">
            <span className="stat__num">{String(projects.length).padStart(2, "0")}</span>
            <span className="stat__label">selected projects</span>
          </div>
          <div className="stat">
            <span className="stat__num">{String(stackCount).padStart(2, "0")}</span>
            <span className="stat__label">tools used</span>
          </div>
          <div className="stat">
            <span className="stat__num">PY</span>
            <span className="stat__label">main language</span>
          </div>
          <div className="stat">
            <span className="stat__num">01</span>
            <span className="stat__label">end to end</span>
          </div>
        </div>
      </section>
    </>
  );
}
