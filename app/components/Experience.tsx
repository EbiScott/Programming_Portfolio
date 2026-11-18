import { experience } from "../content/site";
import { range } from "../content/format.mjs";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="04 / Experience"
          title="Experience."
          titleId="experience-heading"
        />

        <div className="exp">
          {experience.map((e) => (
            <article className="exp__item" key={`${e.role}-${e.org}`}>
              <span className="exp__when">{range(e)}</span>
              <div className="exp__body">
                <h3 className="exp__role">{e.role}</h3>
                <p className="exp__org">{e.org}</p>
                <p className="exp__note">{e.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
