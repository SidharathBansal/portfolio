import Nav from "@/components/Nav";
import StatusBar from "@/components/StatusBar";
import CommandPalette from "@/components/CommandPalette";
import Hero from "@/components/Hero";
import Uptime from "@/components/Uptime";
import Work from "@/components/Work";
import OpenSource from "@/components/OpenSource";
import Writing from "@/components/Writing";
import Changelog from "@/components/Changelog";
import Toolkit from "@/components/Toolkit";
import Words from "@/components/Words";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="md:pb-8">
        <Hero />
        <Uptime />
        <Work />
        <OpenSource />
        <Writing />
        <Changelog />
        <Toolkit />
        <Words />
        <Contact />
      </main>
      <Footer />
      <StatusBar />
      <CommandPalette />
    </>
  );
}
