import { profile } from "../content/site";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="07 / Contact"
          title="Get in touch."
          titleId="contact-heading"
        />

        <p className="contact__lead">
          I&apos;m open to backend, bot, and automation work. Email me with the
          problem and what should happen without a human.
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
