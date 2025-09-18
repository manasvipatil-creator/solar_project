// src/components/Index.jsx
import React from "react";
import { Container } from "react-bootstrap";

// Import only the sections that exist
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import Project from "./Project";
import Features from "./Features";
import Quote from "./Quote";
import Team from "./Team";
import Testimonial from "./Testimonial";
  

const Index = () => {
  return (
    <main>
      <marquee behavior="scroll" direction="left" scrollamount="8" style={{ color: "#111", backgroundColor: "#dc3545", padding: "10px", fontSize: "18px", fontWeight: "bold" }}>
        ⚡🌞 Join the Solar Revolution! Shine Bright, Save Energy, Go Green! 🌿🔋✨ Power Your Home with COFFO Solar – Reduce Bills, Protect Nature, and Harness Unlimited Sunshine! ☀️💰🌱💡
      </marquee>

      <section id="about" className="py-5">
        <About />
      </section>

      <section id="services" className="py-5 bg-light">
        <Services />
      </section>

      <section id="project " className="py-5 bg-light">
        <Project />
      </section>

       <section id="features" className="py-5">
        <Features />
      </section>

       <section id="quote" className="py-5">
        <Quote />
      </section>

       <section id="team " className="py-5">
        <Team />
      </section>

       <section id="testimonial" className="py-5">
        <Testimonial />
      </section>
       <section id="contact" className="py-5">
        <Contact />
      </section>
    </main>
  );
};

export default Index;