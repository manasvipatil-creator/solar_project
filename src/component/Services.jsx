// src/components/Services.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";

const Services = () => {
  const [loading, setLoading] = useState(true);

  // Loader timeout
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
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

  // Services data
  const services = [
    {
      id: 1,
      image: "img/img-600x400-1.jpg",
      icon: "fa fa-solar-panel",
      title: "Solar Panels",
      description:
        "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
      delay: "0s",
    },
    {
      id: 2,
      image: "img/img-600x400-2.jpg",
      icon: "fa fa-wind",
      title: "Wind Turbines",
      description:
        "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
      delay: "0.2s",
    },
    {
      id: 3,
      image: "img/img-600x400-3.jpg",
      icon: "fa fa-lightbulb",
      title: "Hydropower Plants",
      description:
        "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
      delay: "0.4s",
    },
    {
      id: 4,
      image: "img/img-600x400-4.jpg",
      icon: "fa fa-solar-panel",
      title: "Solar Panels",
      description:
        "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
      delay: "0.6s",
    },
    {
      id: 5,
      image: "img/img-600x400-5.jpg",
      icon: "fa fa-wind",
      title: "Wind Turbines",
      description:
        "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
      delay: "0.8s",
    },
    {
      id: 6,
      image: "img/img-600x400-6.jpg",
      icon: "fa fa-lightbulb",
      title: "Hydropower Plants",
      description:
        "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
      delay: "1s",
    },
  ];

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <Container className="py-5">
        {/* Section Title */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
          <h6 className="text-danger">Our Services</h6>
          <h1 className="mb-4 text-white">
            We Are Pioneers In The World Of Renewable Energy
          </h1>
        </div>

        {/* Centered Logo Image */}
        <Row className="justify-content-center mb-5">
          <Col xs={6} md={4} lg={3} className="text-center">
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
          {services.map((service) => (
            <Col
              key={service.id}
              md={6}
              lg={4}
              style={{
                opacity: 0,
                transform: "translateY(40px)",
                animation: `moveUp 0.8s ease-out forwards`,
                animationDelay: service.delay,
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
                    src={service.image}
                    alt={service.title}
                  />
                </div>

                {/* Service Content */}
                <div className="p-4">
                  <div className="service-icon mb-3 text-danger">
                    <i className={`${service.icon} fa-3x`}></i>
                  </div>
                  <h4 className="mb-3 text-white">{service.title}</h4>
                  <p className="text-light">{service.description}</p>
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

        {/* Animations + Hover Effects */}
        <style>
          {`
            @keyframes moveUp {
              from { transform: translateY(40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }

            .img-container {
              overflow: hidden;
            }

            .img-container img {
              transition: transform 0.5s ease;
            }

            .img-container:hover img {
              transform: scale(1.1);
            }
            
            .service-item:hover {
              transform: translateY(-5px) !important;
              box-shadow: 0 10px 20px rgba(220, 53, 69, 0.2) !important;
              border-color: #dc3545 !important;
            }
          `}
        </style>
      </Container>
    </div>
  );
};

export default Services;