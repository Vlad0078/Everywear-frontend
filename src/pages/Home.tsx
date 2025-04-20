import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSellers from "../components/BestSellers";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      {/* <BestSellers /> */}
      {/* <OurPolicy /> */}
      <div className="h-[5rem]"></div>
      <NewsletterBox />
    </div>
  );
};

export default Home;
