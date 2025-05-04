import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Features from "../components/Features";

const Home = () => {
  return (
    <div className="bg-[rgba(16,4,37,1)] text-white min-h-screen">
      <section id="Navbar" className="absolute top-0">
        <Navbar />
      </section>

      <section id="home" className=" mt-10">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
