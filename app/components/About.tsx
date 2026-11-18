import { profile } from "../content/site";
import SectionHeading from "./SectionHeading";

const FACTS = [
  ["Based in", profile.location],
  ["Focus", "Backend, bots, automation"],
  ["Default stack", "Python, FastAPI, Node.js"],
  ["Also", "React, Next.js, SQL"],
  ["Handle", profile.handle],
];

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="01 / About"
          title="Backend, bots, and automation."
          titleId="about-heading"
        />

        <div className="about">
          <div className="about__copy">
            <p className="about__lead">
              I build full-stack tools, but most of the work is on the backend:
              APIs, data models, scheduled jobs, and Telegram bots.
            </p>
            <p>
              I work mostly in Python and TypeScript, with FastAPI, Flask,
              Node.js, React, and SQL. I build the backend first, then the front
              end that makes it usable.
            </p>
          </div>

          <dl className="facts">
            {FACTS.map(([k, v]) => (
              <div className="fact" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <a className="resume-link" href={profile.resume} download>
          Download résumé <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
