import { certs } from "../content/site";
import SectionHeading from "./SectionHeading";
import Tile from "./Tile";

function Column({
  label,
  items,
  empty,
}: {
  label: string;
  items: { name: string; issuer: string; image?: string }[];
  empty?: boolean;
}) {
  return (
    <div className="cred__col">
      <h3 className="cred__head">{label}</h3>
      {items.length === 0 ? (
        <p className="cred__empty">{empty ? "Nothing listed here yet." : ""}</p>
      ) : (
        <ul className="cred__list">
          {items.map((c) => (
            <li className="cred" key={`${c.name}-${c.issuer}`}>
              {c.image ? (
                <Tile src={c.image} variant="thumb" alt={c.name} caption={c.name} />
              ) : null}
              <div>
                <span className="cred__name">{c.name}</span>
                <span className="cred__issuer">{c.issuer}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="credentials" className="section" aria-labelledby="credentials-heading">
      <div className="section__inner">
        <SectionHeading
          eyebrow="06 / Credentials"
          title="Certifications."
          titleId="credentials-heading"
        />

        <div className="creds">
          <Column label="Held" items={certs.held} />
          <Column label="In progress" items={certs.inProgress} empty />
          <Column label="Planned" items={certs.planned} empty />
        </div>
      </div>
    </section>
  );
}
