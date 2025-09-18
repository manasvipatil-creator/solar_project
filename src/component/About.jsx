// src/components/About.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  if (loading) {
    return (
      <div
        className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#111" }}
      >
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem", color: "#dc3545" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="about-section py-2" style={{ backgroundColor: "#111", color: "#eee" }}>
      <Container>
        <Row className="align-items-center">
          {/* Image Column */}
          <Col lg={6} className="mb-4 mb-lg-0 order-1 order-lg-0" data-aos="fade-down" data-aos-delay="200">
            <div className="rounded overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
                alt="Solar panels and renewable energy"
                className="img-fluid w-100"
                style={{ objectFit: "cover", minHeight: "450px" }}
              />
            </div>
          </Col>

          {/* Text Column */}
          <Col lg={6} className="mb-4 mb-lg-0 ps-lg-5 order-0 order-lg-1" data-aos="fade-down" data-aos-delay="400">
            <h6 className="text-uppercase fw-bold" style={{ color: "#dc3545" }}>
              About Us
            </h6>
            <h2 className="fw-bold mb-4 display-5">
              25+ Years Experience In Solar & Renewable Energy Industry
            </h2>
            <p className="mb-4 fs-5 text-light">
              For over a quarter century, we've been at the forefront of the renewable energy revolution, providing sustainable energy solutions to thousands of homes and businesses across the country.
            </p>

            <ul className="list-unstyled mb-4">
              <li className="mb-3 d-flex align-items-center">
                <i className="fa fa-check-circle me-3 fs-5" style={{ color: "#dc3545" }}></i>
                <span className="fs-5">Expert solar panel installation and maintenance</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fa fa-check-circle me-3 fs-5" style={{ color: "#dc3545" }}></i>
                <span className="fs-5">Energy storage solutions for maximum efficiency</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fa fa-check-circle me-3 fs-5" style={{ color: "#dc3545" }}></i>
                <span className="fs-5">Government incentive program assistance</span>
              </li>
            </ul>

            {/* Buttons */}
            <div className="d-flex flex-wrap gap-3">
              <Button
                style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                size="lg"
                className="rounded-pill px-4 py-3 fw-bold"
              >
                Explore More
              </Button>

              {/* NavLink to Contact Page */}
              <NavLink to="/contact" style={{ textDecoration: "none" }}>
                <Button
                  variant="outline-danger"
                  size="lg"
                  className="rounded-pill px-4 py-3 fw-bold"
                >
                  Contact Us
                </Button>
              </NavLink>
            </div>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="mt-5 pt-4" data-aos="fade-down" data-aos-delay="600">
          <Col md={3} className="text-center mb-4">
            <div className="border-end border-2 pe-md-3" style={{ borderColor: "#dc3545" }}>
              <h2 className="display-4 fw-bold" style={{ color: "#dc3545" }}>25+</h2>
              <p className="fs-5 text-light">Years Experience</p>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="border-end border-2 pe-md-3" style={{ borderColor: "#dc3545" }}>
              <h2 className="display-4 fw-bold" style={{ color: "#dc3545" }}>5,240+</h2>
              <p className="fs-5 text-light">Projects Completed</p>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="border-end border-2 pe-md-3" style={{ borderColor: "#dc3545" }}>
              <h2 className="display-4 fw-bold" style={{ color: "#dc3545" }}>12,580+</h2>
              <p className="fs-5 text-light">Happy Customers</p>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <h2 className="display-4 fw-bold" style={{ color: "#dc3545" }}>24/7</h2>
            <p className="fs-5 text-light">Support Available</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
