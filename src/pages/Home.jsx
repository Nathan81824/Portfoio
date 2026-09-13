import Hero from "../components/Home/Hero";
import SkillsMarquee from "../components/Home/SkillsMarquee";
import AboutPreview from "../components/Home/AboutPreview";
import WhatIDo from "../components/Home/WhatIDo";
import AvatarSection from "../components/Home/AvaterSection";
import TechUniverse from "../components/Home/TechUniverse";
import AboutJourney from "../components/Home/AboutJourney";

function Home() {
  return (
    <main>
      <Hero />

      <SkillsMarquee/>

      <AboutPreview />

      <WhatIDo />

      <AvatarSection />

      <TechUniverse/>

      <AboutJourney/>


    </main>
  );
}

export default Home;