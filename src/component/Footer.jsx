import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="position-relative text-center bg-white">
      {/* ✅ Curved Background */}
      <div
        className="position-absolute top-0 start-0 w-100"
        style={{
          height: "120px",
          background: "black",
          borderBottomLeftRadius: "50% 100%",
          borderBottomRightRadius: "50% 100%",
        }}
      ></div>

      {/* ✅ Content */}
      <Container className="pt-5 position-relative">
        {/* Social Title */}
        <h5 className="fw-bold mb-4">FOLLOW NOW</h5>

        {/* Social Links */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          <a href="#" className="text-dark fs-4">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-dark fs-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-dark fs-4">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="text-dark fs-4">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-dark fs-4">
            <i className="fab fa-youtube"></i>
          </a>
        </div>

        {/* Contact Info */}
        <Row className="text-muted mb-4 gy-3">
          <Col xs={12} md={4} className="d-flex align-items-center justify-content-center">
            <i className="fa fa-map-marker-alt me-2 text-danger"></i>
            Location
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-center justify-content-center">
            <i className="fa fa-envelope me-2 text-danger"></i>
            demo@gmail.com
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-center justify-content-center">
            <i className="fa fa-phone-alt me-2 text-danger"></i>
            Call +01 1234567890
          </Col>
        </Row>

        {/* Copyright */}
        <p className="small text-muted mb-0 px-2">
          2020 All Rights Reserved. Design by Free HTML Templates | Distributed by{" "}
          <a href="https://themewagon.com" className="text-dark text-decoration-none">
            ThemeWagon
          </a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
