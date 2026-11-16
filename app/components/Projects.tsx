import { projects } from "../content/site";
import SectionHeading from "./SectionHeading";
import Tile from "./Tile";

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="02 / Selected work"
          title="Things I built, and what they had to survive."
          titleId="projects-heading"
        />

        <ol className="work">
          {projects.map((p) => (
            <li className="work__item" key={p.index}>
              <div className="work__meta">
                <span className="work__index">{p.index}</span>
                <span className="work__kind">{p.kind}</span>
                <span
                  className={`work__status${p.status === "Shipped" ? " is-shipped" : ""}`}
                >
                  {p.status}
                </span>
              </div>

              <div className="work__body">
                <h3 className="work__title">{p.title}</h3>
                <p className="work__summary">{p.summary}</p>
                <p className="work__detail">{p.detail}</p>

                {p.image ? (
                  <div className="work__shot">
                    <Tile
                      src={p.image}
                      variant="wide"
                      alt={`${p.title}, ${p.kind}`}
                      caption={p.title}
                    />
                  </div>
                ) : null}

                <ul className="stack" aria-label={`${p.title} stack`}>
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                <div className="work__links">
                  {p.links.map((l) =>
                    l.href.startsWith("#") ? (
                      <a key={l.label} href={l.href} className="work__soon">
                        {l.label} <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="work__more">
          More repositories on{" "}
          <a href="https://github.com/EbiScott" target="_blank" rel="noopener noreferrer">
            github.com/EbiScott <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </section>
  );
}
