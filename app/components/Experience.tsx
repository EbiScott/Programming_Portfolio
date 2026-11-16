import { experience } from "../content/site";
import SectionHeading from "./SectionHeading";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ym(v: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(v ?? "");
  return m ? `${MONTHS[+m[2] - 1] ?? m[2]} ${m[1]}` : v ?? "";
}

function range(e: { start: string; end: string; current: boolean }): string {
  const s = ym(e.start);
  return e.current ? `${s} / NOW` : `${s} / ${ym(e.end)}`;
}

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="04 / Experience"
          title="What I have been responsible for."
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
