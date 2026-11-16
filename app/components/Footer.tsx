import { profile } from "../content/site";

export default function Footer() {
  return (
    <footer className="foot">
      <span>{profile.name.toUpperCase()}</span>
      <span>
        {profile.handle} / {new Date().getUTCFullYear()}
      </span>
      <span>Built with Next.js. Deployed on Vercel.</span>
    </footer>
  );
}
