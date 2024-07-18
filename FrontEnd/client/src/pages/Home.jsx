import React from "react";

import HeroSection from "../components/ui/HeroSection";
import LiveAuction from "../components/ui/liveAuction/LiveAuction";
import StepSection from "../components/ui/Step-section/StepSection";
import Trending from "../components/ui/TrendingSection/TrendingSection";
const Home = () => {
  return (
    <>
      <HeroSection />
      <LiveAuction />
      <StepSection />
      <Trending />
    </>
  );
};

export default Home;
