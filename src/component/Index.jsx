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
      <marquee behavior="scroll" direction="left" scrollamount="8" style={{ color: "#111", backgroundColor: "#dc3545", padding: "10px", fontSize: "18px", fontWeight: "bold", width: "100%", maxWidth: "100vw", overflow: "hidden", margin: "0", marginBottom: "0" }}>
        ⚡🌞 Join the Solar Revolution! Shine Bright, Save Energy, Go Green! 🌿🔋✨ Power Your Home with COFFO Solar – Reduce Bills, Protect Nature, and Harness Unlimited Sunshine! ☀️💰🌱💡
      </marquee>

      <section id="about" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <About />
      </section>

      <section id="services" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Services />
      </section>

      <section id="project" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Project />
      </section>

       <section id="features" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Features />
      </section>

       <section id="quote" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Quote />
      </section>

       <section id="team" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Team />
      </section>

       <section id="testimonial" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Testimonial />
      </section>
       <section id="contact" style={{ marginTop: "10px", marginBottom: 0, padding: 0 }}>
        <Contact />
      </section>
    </main>
  );
};

export default Index;