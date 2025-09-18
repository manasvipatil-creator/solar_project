// src/component/Feature.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const Feature = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-black position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div
          className="spinner-border text-danger"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Features data
  const features = [
    { icon: "fa fa-solar-panel", title: "Efficient Panels", description: "Cutting-edge solar technology" },
    { icon: "fa fa-bolt", title: "Reliable Power", description: "24/7 clean energy" },
    { icon: "fa fa-hand-holding-usd", title: "Cost Effective", description: "Save more with solar" },
    { icon: "fa fa-headset", title: "24/7 Support", description: "Always here for you" },
  ];

  return (
    <>
      <section className="py-5" style={{ background: "#1a1a1a" }}>
        <Container>
          <Row className="align-items-center g-5">
            {/* Text */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h6 className="text-uppercase text-danger mb-2">Why Choose Us</h6>
                <h2 className="fw-bold mb-4 text-white">
                  Powering Homes & Businesses with Red Energy
                </h2>
                <p className="mb-4 text-light">
                  Switch to a smarter, cleaner, and more powerful future. 
                  With our cutting-edge solar systems, you get maximum 
                  performance, reliability, and savings.
                </p>
                <Row className="g-4">
                  {features.map((feature, index) => (
                    <Col xs={6} key={index}>
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 1 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        className="d-flex align-items-start"
                      >
                        <div
                          className="d-flex align-items-center justify-content-center shadow"
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "#dc3545",
                          }}
                        >
                          <i
                            className={`${feature.icon} text-white`}
                            style={{ fontSize: "32px" }} // ✅ Bigger icons
                          ></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="fw-bold text-white mb-1">{feature.title}</h6>
                          <p className="mb-0 text-light small">{feature.description}</p>
                        </div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </Col>

            {/* Image */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="rounded-4 overflow-hidden shadow-lg"
              >
                <img
                  src="img/feature.jpg"
                  alt="Solar Feature"
                  className="img-fluid w-100"
                  style={{
                    objectFit: "cover",
                    maxHeight: "450px",
                    borderRadius: "15px",
                    border: "3px solid red",
                  }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Feature;
