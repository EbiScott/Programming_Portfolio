import { skills } from "../content/site";
import SectionHeading from "./SectionHeading";

function Mark({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function Skills() {
  return (
    <section id="toolbox" className="section" aria-labelledby="toolbox-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="03 / Toolbox"
          title="Tools I use."
          titleId="toolbox-heading"
        />

        <div className="toolbox">
          {skills.map((g, i) => (
            <article className="toolbox__group" key={g.heading}>
              <div className="toolbox__head">
                <span className="toolbox__n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{g.heading}</h3>
              </div>
              <p className="toolbox__blurb">{g.blurb}</p>
              <ul className="tools">
                {g.skills.map((s) => (
                  <li className="tool" key={s.label}>
                    {s.icon ? <Mark path={s.icon} /> : null}
                    {s.label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
