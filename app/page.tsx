import About from "./components/About";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Lightbox from "./components/Lightbox";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Topbar from "./components/Topbar";
import Writing from "./components/Writing";

export default function Home() {
  return (
    <>
      <Topbar />

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Writing />
        <Certifications />
        <Contact />
      </main>

      <Footer />

      {/* One overlay for every proof image on the page. */}
      <Lightbox />
    </>
  );
}
