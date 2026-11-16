import { writeFileSync } from "node:fs";
import {
  siGithub, siX, siHashnode,
  siPython, siTypescript, siJavascript, siNodedotjs, siReact, siNextdotjs,
  siVite, siTailwindcss, siFastapi, siFlask, siPostgresql, siSqlite, siRedis,
  siSupabase, siDocker, siLinux, siGit, siGithubactions, siVercel, siTelegram,
  siArduino, siEspressif, siSelenium, siScrapy, siMongodb, siMysql,
  siJsonwebtokens, siVitest, siGnubash, siFfmpeg, siPydantic,
  siSqlalchemy, siUbuntu,
} from "simple-icons";

const linkedinPath =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const ic = (si) => ({ label: si.title, icon: si.path });
const chip = (label) => ({ label });

const GH = "https://github.com/EbiScott";

const data = {
  profile: {
    name: "Eworitse Egbejule",
    handle: "0xK4M1",
    email: "egbejuleeworitse@gmail.com",
    location: "Lagos, NG",
    resume: "/resume-eworitse-egbejule.pdf",
    blog: "https://0xK4M1.hashnode.dev",
    links: [
      { label: "GitHub", handle: "EbiScott", href: GH, icon: siGithub.path },
      { label: "LinkedIn", handle: "eworitse-e", href: "https://linkedin.com/in/eworitse-e", icon: linkedinPath },
      { label: "X", handle: "@OxK4M1", href: "https://x.com/OxK4M1", icon: siX.path },
      { label: "Hashnode", handle: "0xK4M1", href: "https://0xK4M1.hashnode.dev", icon: siHashnode.path },
    ],
  },

  experience: [
    {
      role: "Independent Developer & Automation Engineer",
      org: "Self-directed / freelance",
      start: "2023-01",
      end: "",
      current: true,
      note: "Building full-stack tools and Python automations end to end: APIs, data stores, Telegram interfaces, scheduled jobs, and the front ends that sit on top. The projects below are the record.",
    },
    {
      role: "Track Lead, Cyber & Networking",
      org: "Google Developer Group (GDG)",
      start: "2025-09",
      end: "",
      current: true,
      note: "Lead technical sessions and mentor members, building demos that explain networking, APIs, and security to a general developer audience.",
    },
  ],

  projects: [
    {
      index: "P.01",
      title: "Tether",
      kind: "MCP bridge",
      status: "Shipped",
      summary: "A security-first bridge between LLMs and internet-connected microcontrollers.",
      detail: "A Model Context Protocol server that lets an LLM client read sensors from and send commands to ESP32/Arduino hardware without trusting the model, the host, or the device. Every call passes a deny-by-default policy engine, risk tiers, an anomaly detector, a data sanitizer, and a hash-chained audit log before anything physical happens.",
      stack: ["TypeScript", "Node.js", "MCP", "ESP32", "Vitest"],
      links: [{ label: "Repository", href: "https://github.com/EbiScott/Tether" }],
      image: "",
    },
    {
      index: "P.02",
      title: "NGX Watcher",
      kind: "Market bot",
      status: "Shipped",
      summary: "A serverless market-watching bot for the Nigerian Exchange.",
      detail: "Polls NGX data, evaluates dividend, technical, fundamental, and news rules, then sends Telegram alerts in two tiers: real-time for the time-sensitive and a digest at close. Every run is a short GitHub Actions batch job backed by Turso, so there is no resident process and state survives between ephemeral runners.",
      stack: ["Python", "GitHub Actions", "Turso", "Telegram", "Pydantic"],
      links: [{ label: "Code on request", href: "#contact" }],
      image: "",
    },
    {
      index: "P.03",
      title: "Hall Roll Call",
      kind: "Face verification",
      status: "Shipped",
      summary: "Face-verified roll call for hostel attendance.",
      detail: "A FastAPI app where a student enters a matric number, looks at the camera, and turns their head when asked. OpenCV YuNet detects the face, SFace turns it into an embedding, and cosine similarity verifies it against one stored template. A one-time head-turn challenge rejects still photos, and staff get an admin view with CSV export.",
      stack: ["Python", "FastAPI", "OpenCV", "SQLite"],
      links: [{ label: "Repository", href: "https://github.com/C-SharpMinor/Project-Power" }],
      image: "",
    },
    {
      index: "P.04",
      title: "Parrot",
      kind: "Offline PWA",
      status: "In progress",
      summary: "An audio and video journal that transcribes on the device.",
      detail: "A Vite + React PWA that records audio or video, stores blobs in IndexedDB, and runs Whisper in a Web Worker through transformers.js, so recordings never leave the phone. Includes a service worker for offline use, a small hash router, and tests around storage and transcript paragraphing.",
      stack: ["React", "Vite", "IndexedDB", "Whisper", "PWA"],
      links: [{ label: "Repository", href: "https://github.com/EbiScott/Parrot" }],
      image: "",
    },
    {
      index: "P.05",
      title: "Audio Ops Bots",
      kind: "Bot suite",
      status: "Shipped",
      summary: "A family of Telegram bots for audio cleanup and transcription.",
      detail: "Small Python services that each do one job: pull the audio out of a video, remove background noise, or transcribe a voice note. Built separately so they can be deployed, rate-limited, and replaced independently instead of becoming one fragile monolith.",
      stack: ["Python", "Telegram Bot API", "FFmpeg", "Whisper"],
      links: [
        { label: "Audio extraction", href: "https://github.com/EbiScott/audio-extraction-bot" },
        { label: "Noise remover", href: "https://github.com/EbiScott/Audio-Noise-Remover" },
        { label: "Transcriber", href: "https://github.com/EbiScott/Audio-Transkriptor" },
      ],
      image: "",
    },
    {
      index: "P.06",
      title: "HASH",
      kind: "CLI tool",
      status: "Shipped",
      summary: "A Python command-line toolkit for hashing and encryption.",
      detail: "A Linux CLI for generating and checking hashes, encrypting and decrypting files, and running dictionary attacks against hashes in a lab. Written to make the primitives understandable at the terminal instead of hiding them behind a GUI.",
      stack: ["Python", "Cryptography", "CLI", "Linux"],
      links: [{ label: "Repository", href: "https://github.com/EbiScott/HASH" }],
      image: "",
    },
    {
      index: "P.07",
      title: "Purple City Blog",
      kind: "Full-stack app",
      status: "In progress",
      summary: "A blog split into a Flask API and a React client.",
      detail: "A client/server build: Flask models, authentication, and REST endpoints on one side, a React front end consuming them on the other. Built to practise the boundary between a real backend and the product that sits on top of it, including the failure cases.",
      stack: ["Python", "Flask", "React", "REST", "SQLAlchemy"],
      links: [{ label: "Repository", href: "https://github.com/Purple-City-Blog/Purple-City-Blog" }],
      image: "",
    },
    {
      index: "P.08",
      title: "Company Site Series",
      kind: "Front-end collection",
      status: "Shipped",
      summary: "Six fictional company websites, each with its own design language.",
      detail: "A set of standalone, responsive sites for a boutique hotel, a garden spa, a construction firm, a fintech, a print studio, and a newspaper. Plain HTML, CSS, and JavaScript with no build step, and each one can be deployed to Vercel on its own.",
      stack: ["HTML", "CSS", "JavaScript", "Vercel"],
      links: [{ label: "Case studies on request", href: "#contact" }],
      image: "",
    },
  ],

  skills: [
    {
      heading: "Backend & APIs",
      blurb: "The part that has to keep working.",
      skills: [
        ic(siPython), ic(siFastapi), ic(siFlask), ic(siNodedotjs), ic(siTypescript),
        ic(siPostgresql), ic(siSqlite), ic(siRedis), ic(siPydantic), ic(siSqlalchemy),
        ic(siJsonwebtokens), chip("REST design"),
      ],
    },
    {
      heading: "Bots & automation",
      blurb: "Work that runs when nobody is watching.",
      skills: [
        ic(siTelegram), ic(siGithubactions), ic(siSelenium), ic(siScrapy),
        ic(siFfmpeg), ic(siGnubash), chip("Cron"), chip("Webhooks"),
        chip("Playwright"), chip("Beautiful Soup"),
      ],
    },
    {
      heading: "Frontend & product",
      blurb: "Enough front end to ship the whole thing.",
      skills: [
        ic(siReact), ic(siNextdotjs), ic(siVite), ic(siTailwindcss),
        ic(siJavascript), chip("HTML"), chip("CSS"), chip("IndexedDB"), chip("PWA"),
      ],
    },
    {
      heading: "Infrastructure & data",
      blurb: "Getting it deployed and keeping it observable.",
      skills: [
        ic(siLinux), ic(siUbuntu), ic(siGit), ic(siGithub), ic(siDocker),
        ic(siVercel), ic(siSupabase), ic(siMongodb), ic(siMysql),
        ic(siArduino), ic(siEspressif), ic(siVitest),
      ],
    },
  ],

  certs: {
    held: [
      { name: "API Security Fundamentals", issuer: "API Sec University", image: "" },
      { name: "API Gateway Security Best Practices", issuer: "API Sec University", image: "" },
      { name: "Certified in Cybersecurity (CC)", issuer: "ISC2", image: "" },
      { name: "CCNAv7", issuer: "Cisco NetAcad", image: "" },
      { name: "Introduction to Networking", issuer: "Cisco NetAcad", image: "" },
      { name: "Introduction to Cybersecurity", issuer: "Cisco NetAcad", image: "" },
    ],
    inProgress: [
      { name: "Securing API Servers", issuer: "API Sec University", image: "" },
      { name: "API Security for Connected Cars and Fleets", issuer: "API Sec University", image: "" },
    ],
    planned: [],
  },

  posts: [
    {
      title: "Building Tether, a governed bridge from LLMs to hardware",
      note: "Why an LLM that can flip a relay is an attack surface, and what a policy engine, sanitizer, and audit log actually buy you.",
      status: "In progress",
      href: "",
      image: "",
    },
    {
      title: "Running a Python bot with no server",
      note: "Scheduled GitHub Actions, a hosted SQLite database, and a Telegram interface: a bot that costs nothing between runs.",
      status: "Planned",
      href: "",
      image: "",
    },
    {
      title: "Building I_Sniff",
      note: "Designing and shipping an ARP man-in-the-middle sniffer, and why building the attack is the fastest way to understand the defence.",
      status: "Published",
      href: "https://0xk4m1.hashnode.dev/i-sniff-mitm-packet-sniffer-arp-spoofing",
      image: "",
    },
    {
      title: "Writing a network IP sweeper",
      note: "Mapping the subnets in a network, and how to enumerate hosts quickly without overcomplicating it.",
      status: "Published",
      href: "https://0xk4m1.hashnode.dev/https-0xk4m1-hashnode-dev-ipsweep-sh-a-host-discovery-recon-tool-on-a-24-network",
      image: "",
    },
    {
      title: "Designing Hall Roll Call's liveness check",
      note: "One-time head-turn challenges, cosine thresholds, and the attacks a camera-only flow still cannot stop.",
      status: "Planned",
      href: "",
      image: "",
    },
    {
      title: "What a face-verification API taught me about failure modes",
      note: "Thresholds, lighting, and the difference between a false reject and a false accept when the app is the only gate.",
      status: "Planned",
      href: "",
      image: "",
    },
  ],
};

writeFileSync(
  new URL("../app/content/site.json", import.meta.url),
  JSON.stringify(data, null, 2) + "\n",
  "utf-8",
);
console.log("Wrote app/content/site.json");
