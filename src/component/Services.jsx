// src/components/Services.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";

const Services = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  // Loader timeout
  useEffect(() => {
    const listRef = ref(db, "content/services");
    const callback = (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
      }
      setServices(list);
      setLoading(false);
    };
    onValue(listRef, callback);
    return () => off(listRef, "value", callback);
  }, []);

  // Show loader
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#000" }}>
        <Spinner
          animation="border"
          variant="danger"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // If no services in DB, show nothing (or we could add a fallback list)

  return (
    <>
      <style>
        {`
          @keyframes moveUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className="container-fluid" style={{ backgroundColor: "#000", paddingTop: "0", marginTop: "10px", paddingBottom: "5rem", marginBottom: "0" }}>
        <Container>
          {/* Section Header */}
          <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
            <h6 className="text-uppercase text-danger">Our Services</h6>
            <h1 className="mb-4 text-white">Comprehensive Solar Solutions</h1>
          </div>
          <p className="text-center text-light">
            We Are Pioneers In The World Of Renewable Energy
          </p>

        {/* Centered Logo Image */}
        <Row className="justify-content-center mb-5">
          <Col className="text-center">
            <img
              src="img/logo.jpg"
              alt="Logo"
              className="img-fluid"
              style={{
                maxHeight: "150px",
                border: "2px solid #dc3545",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(220, 53, 69, 0.3)",
                backgroundColor: "#111"
              }}
            />
          </Col>
        </Row>

        {/* Services Grid */}
        <Row className="g-4">
          {services.map((service, idx) => (
            <Col
              key={service.key || idx}
              md={6}
              lg={4}
              style={{
                opacity: 0,
                transform: "translateY(40px)",
                animation: `moveUp 0.8s ease-out forwards`,
                animationDelay: `${(idx % 4) * 0.2}s`,
              }}
            >
              <div className="service-item rounded overflow-hidden shadow-sm h-100" style={{ 
                backgroundColor: "#111", 
                border: "1px solid #333",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}>
                {/* Service Image */}
                <div className="img-container">
                  <img
                    className="img-fluid w-100"
                    src={service.image || "img/img-600x400-1.jpg"}
                    alt={service.title || "Service"}
                  />
                </div>

                {/* Service Content */}
                <div className="p-4">
                  <div className="service-icon mb-3 text-danger">
                    <i className={`${service.icon || 'fa fa-solar-panel'} fa-3x`}></i>
                  </div>
                  <h4 className="mb-3 text-white">{service.title || 'Service'}</h4>
                  <p className="text-light">{service.description || ''}</p>
                  <a
                    className="small fw-medium text-decoration-none text-danger"
                    href="#"
                  >
                    Read More <i className="fa fa-arrow-right ms-2"></i>
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        </Container>
      </div>
    </>
  );
};

export default Services;