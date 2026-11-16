import { profile } from "../content/site";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="07 / Contact"
          title="Have something that should run by itself?"
          titleId="contact-heading"
        />

        <p className="contact__lead">
          I am open to backend work, bot builds, and automation projects. The
          fastest way to reach me is email. Include the shape of the problem and
          what has to happen without a human.
        </p>

        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>

        <div className="contact__actions">
          <a className="btn" href={`mailto:${profile.email}`}>
            Start an email <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn--ghost" href={profile.resume} download>
            Download résumé <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="contact__links">
          {profile.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{l.label}</span>
              {l.handle}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
