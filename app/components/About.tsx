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
          title="I like the unglamorous half of the product."
          titleId="about-heading"
        />

        <div className="about">
          <div className="about__copy">
            <p className="about__lead">
              I build full-stack tools, but the work I care about happens behind
              the interface: the API, the data model, the scheduled job, the bot
              that has to keep its promises at 3 a.m.
            </p>
            <p>
              My projects tend to start with a repeated task and end as a small
              service. A market watcher that runs on GitHub Actions with no
              server. A set of Telegram bots that each do one audio job well. A
              face-verification API that has to decide whether to trust a camera.
              I build the backend first, then add the front end that makes it
              usable.
            </p>
            <p>
              I work mostly in Python and TypeScript, with FastAPI, Flask,
              Node.js, React, and SQL. I care about clear failure modes, small
              services, and code that someone else can pick up without a call.
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
