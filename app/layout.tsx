import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import ScrollReveal from "./components/ScrollReveal";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ebi-programming.vercel.app"),
  title: {
    default: "Ebi, Full-Stack Developer & Automation Engineer",
    template: "%s | Ebi",
  },
  description:
    "Eworitse Egbejule (Ebi), full-stack developer in Lagos. Backend systems, Python bots, and the automation that keeps them running. Handle: 0xK4M1.",
  authors: [{ name: "Eworitse Egbejule" }],
  creator: "Eworitse Egbejule",
  openGraph: {
    title: "Ebi - Full-Stack Developer & Automation Engineer",
    description:
      "Backend systems, Python bots, and automation. Building the part that runs when nobody is watching. Handle: 0xK4M1.",
    type: "website",
    locale: "en_GB",
    siteName: "Ebi, Eworitse Egbejule",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ebi, Full-Stack Developer & Automation Engineer",
    description:
      "Backend systems, Python bots, and automation. Handle: 0xK4M1.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f3ee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
