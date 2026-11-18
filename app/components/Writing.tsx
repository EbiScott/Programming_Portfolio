import { posts } from "../content/site";
import SectionHeading from "./SectionHeading";

export default function Writing() {
  return (
    <section id="writing" className="section" aria-labelledby="writing-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="05 / Writing"
          title="Writing."
          titleId="writing-heading"
        />

        <div className="writing">
          {posts.map((p) => (
            <article className="post" key={p.title}>
              <span className="post__status" data-status={p.status}>
                {p.status}
              </span>
              <div className="post__body">
                {p.href ? (
                  <a
                    className="post__title"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.title} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="post__title">{p.title}</span>
                )}
                <p className="post__note">{p.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
