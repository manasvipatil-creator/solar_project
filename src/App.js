import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, Container, Row, Col, Button } from "react-bootstrap";

// Import components
import Index from "./component/Index";
import About from "./component/About";
import Services from "./component/Services";
import Project from "./component/Project";
import Features from "./component/Features";
import Quote from "./component/Quote";
import Team from "./component/Team";
import Contact from "./component/Contact";
import Testimonial from "./component/Testimonial";
import HomeCarousel, { slides } from "./component/HomeCarousel";
import FloatingThumbnails from "./component/FloatingThumbnails";
import AuthForm from "./component/AuthForm";
import AdminDashboard from "./component/AdminDashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ✅ Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Project", link: "/project" },
    { name: "Feature", link: "/features" },
    { name: "Free Quote", link: "/quote" },
    { name: "Team", link: "/team" },
    { name: "Contact", link: "/contact" },
    { name: "Testimonial", link: "/testimonial" },
  ];

  const handleNavClick = () => setIsOpen(false);

  return (
    <motion.nav
      className="navbar navbar-expand-lg sticky-top shadow"
      style={{ backgroundColor: "#000", padding: "10px 20px" }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <Container fluid>
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <span className="fw-bold text-white fs-2">SOLAR</span>
          <img
            src={`${process.env.PUBLIC_URL}/img/logo.jpg`}
            alt="logo"
            width="40"
            height="40"
            className="ms-2 rounded-circle"
          />
        </NavLink>

        {/* ✅ Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ✅ Nav Items */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <div className="navbar-nav ms-auto text-center">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mx-1"
              >
                <NavLink
                  to={item.link}
                  onClick={handleNavClick}
                  className="nav-link fw-bold text-white"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "#dc3545" : "transparent",
                    borderRadius: "4px",
                  })}
                >
                  {item.name}
                </NavLink>
              </motion.div>
            ))}
            <NavLink
              to="/login"
              onClick={handleNavClick}
              className="nav-link text-white mt-2 mt-lg-0"
            >
              <i className="fa fa-user me-1"></i> Login
            </NavLink>
          </div>
        </div>
      </Container>
    </motion.nav>
  );
};

// ✅ Responsive Footer
const Footer = () => (
  <div style={{ position: "relative", marginTop: "50px" }}>
    {/* Curved Top */}
    <div
      style={{
        position: "absolute",
        top: "-80px",
        left: 0,
        width: "100%",
        height: "80px",
        backgroundColor: "#111",
        borderTopLeftRadius: "50% 100px",
        borderTopRightRadius: "50% 100px",
      }}
    ></div>

    <div
      className="container-fluid text-white pt-5"
      style={{ backgroundColor: "#111", zIndex: 1, position: "relative" }}
    >
      <Container className="py-5">
        <Row className="g-4 text-center text-md-start">
          {/* Address */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-4 text-danger">Address</h5>
            <p>
              <i className="fa fa-map-marker-alt me-2 text-danger"></i>123
              Street, USA
            </p>
            <p>
              <i className="fa fa-phone-alt me-2 text-danger"></i>+012 345 67890
            </p>
            <p>
              <i className="fa fa-envelope me-2 text-danger"></i>
              info@example.com
            </p>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-4 text-danger">Quick Links</h5>
            <NavLink className="d-block text-white mb-2" to="/about">
              - About Us
            </NavLink>
            <NavLink className="d-block text-white mb-2" to="/services">
              - Our Services
            </NavLink>
            <NavLink className="d-block text-white mb-2" to="/testimonial">
              - Testimonial
            </NavLink>
            <NavLink className="d-block text-white mb-2" to="/team">
              - Support
            </NavLink>
          </Col>

          {/* Gallery */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-4 text-danger">Gallery</h5>
            <Row className="g-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Col xs={4} key={n}>
                  <img
                    className="img-fluid rounded"
                    src={`img/gallery-${n}.jpg`}
                    alt={`Gallery ${n}`}
                  />
                </Col>
              ))}
            </Row>
          </Col>

          {/* Newsletter */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-4 text-danger">Newsletter</h5>
            <p>Subscribe to get our latest solar updates.</p>
            <div
              className="position-relative mx-auto"
              style={{ maxWidth: "400px" }}
            >
              <Form.Control
                className="border-0 w-100 py-2 ps-3 pe-5 mb-2 mb-md-0"
                type="text"
                placeholder="Your email"
              />
              <Button
                type="button"
                className="btn btn-danger py-2 w-100 w-md-auto position-md-absolute top-0 end-0 mt-md-1 me-md-2"
              >
                SignUp
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Copyright */}
      <div className="text-center py-3" style={{ borderTop: "1px solid #444" }}>
        © <span className="text-danger">SOLAR</span> | All Rights Reserved
      </div>
    </div>
  </div>
);

// ✅ Home Content
const HomePageContent = ({ index, setIndex }) => {
  return (
    <>
      <HomeCarousel index={index} setIndex={setIndex} />
      <FloatingThumbnails slides={slides} index={index} setIndex={setIndex} />
      <Index />
    </>
  );
};

// ✅ Main App
function App() {
  const [index, setIndex] = useState(0);

  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePageContent index={index} setIndex={setIndex} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/project" element={<Project />} />
        <Route path="/features" element={<Features />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/team" element={<Team />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
