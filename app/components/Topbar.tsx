import { profile } from "../content/site";

const SECTIONS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#toolbox", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a href="#top" className="brand" aria-label="Back to top">
          <span className="brand__mark">EE</span>
          <span className="brand__text">
            {profile.name}
            <small>{profile.handle}</small>
          </span>
        </a>

        <nav className="nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href}>
              {s.label}
            </a>
          ))}
        </nav>

        <details className="nav__mobile">
          <summary>Menu</summary>
          <div className="nav__mobile__panel">
            {SECTIONS.map((s) => (
              <a key={s.href} href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
        </details>

        <a className="topbar__cta" href="#contact">
          Hire me
        </a>
      </div>
    </header>
  );
}
