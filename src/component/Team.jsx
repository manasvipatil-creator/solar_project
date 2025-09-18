// src/components/Team.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Team = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Loader state
  if (loading) {
    return (
      <div className="bg-black position-fixed w-100 vh-100 d-flex align-items-center justify-content-center">
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

  // Team members data
  const teamMembers = [
    { id: 1, image: "img/team-1.jpg", name: "John Doe", designation: "CEO", delay: 0.1 },
    { id: 2, image: "img/team-2.jpg", name: "Sarah Smith", designation: "Manager", delay: 0.3 },
    { id: 3, image: "img/team-3.jpg", name: "David Johnson", designation: "Engineer", delay: 0.5 },
    { id: 4, image: "img/team-2.jpg", name: "Emily Brown", designation: "Designer", delay: 0.1 },
    { id: 5, image: "img/team-3.jpg", name: "Michael Lee", designation: "Developer", delay: 0.3 },
    { id: 6, image: "img/team-1.jpg", name: "Sophia Wilson", designation: "Consultant", delay: 0.5 },
  ];

  return (
    <Container className="pt-3 pb-5">
      {/* Section Header */}
      <motion.div
        className="text-center mx-auto mb-4"
        style={{ maxWidth: "600px" }}
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h6 className="text-danger">Our Experts</h6>
        <h1 className="mb-4 text-danger">Meet the Team</h1>
      </motion.div>

      {/* Team Grid */}
      <Row className="g-4">
        {teamMembers.map((member) => (
          <Col key={member.id} lg={4} md={6}>
            <motion.div
              className="team-item rounded overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: member.delay }}
              viewport={{ once: true }}
              style={{ background: "#111", color: "white" }}
            >
              {/* Image */}
              <div className="position-relative">
                <img
                  className="img-fluid w-100"
                  src={member.image}
                  alt={member.name}
                  style={{ filter: "brightness(70%)" }}
                />
                <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-3 mb-3">
                  <a href="https://www.facebook.com/" className="social-btn">
                    <FaFacebookF />
                  </a>
                  <a href="https://x.com/" className="social-btn">
                    <FaTwitter />
                  </a>
                  <a href="https://www.instagram.com/" className="social-btn">
                    <FaInstagram />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 text-center">
                <h5 className="text-white">{member.name}</h5>
                <span className="text-danger">{member.designation}</span>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Extra Styling */}
      <style>
        {`
          .team-item {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #dc3545;
          }

          .team-item:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0px 10px 25px rgba(220, 53, 69, 0.5);
          }

          .social-btn {
            width: 45px;
            height: 45px;
            background: #dc3545;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 20px;
            transition: all 0.3s ease;
          }

          .social-btn:hover {
            background: white;
            color: #dc3545;
            transform: scale(1.2);
            box-shadow: 0px 0px 12px rgba(220, 53, 69, 0.8);
          }
        `}
      </style>
    </Container>
  );
};

export default Team;
