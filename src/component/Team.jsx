// src/components/Team.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Team = () => {
  const [loading, setLoading] = useState(true);

  // Subscribe to team data from Firebase
  const [teamMembers, setTeamMembers] = useState([]); // { key, name, designation, image, bio }
  useEffect(() => {
    const listRef = ref(db, "content/team");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
      }
      setTeamMembers(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Animation delays for staggered effect
  const animationDelays = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

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

  return (
    <Container style={{ paddingTop: "0", paddingBottom: "5rem", marginTop: "10px", marginBottom: "0" }}>
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
        {teamMembers.length === 0 && (
          <div className="text-center text-muted py-5">No team members added yet.</div>
        )}
        {teamMembers.map((member, idx) => (
          <Col key={member.key || member.id || idx} lg={4} md={6}>
            <motion.div
              className="team-item rounded overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: animationDelays[idx % animationDelays.length] }}
              viewport={{ once: true }}
              style={{ background: "#111", color: "white" }}
            >
              {/* Image */}
              <div className="position-relative">
                <img
                  className="img-fluid w-100"
                  src={member.image}
                  alt={member.name}
                  style={{ filter: "brightness(70%)", height: "330px", objectFit: "cover" }}
                />
                <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-3 mb-3">
                  <a 
                    href="https://www.facebook.com/" 
                    className="d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "rgba(220, 53, 69, 0.8)",
                      borderRadius: "50%",
                      textDecoration: "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <FaFacebookF />
                  </a>
                  <a 
                    href="https://x.com/" 
                    className="d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "rgba(220, 53, 69, 0.8)",
                      borderRadius: "50%",
                      textDecoration: "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <FaTwitter />
                  </a>
                  <a 
                    href="https://www.instagram.com/" 
                    className="d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "rgba(220, 53, 69, 0.8)",
                      borderRadius: "50%",
                      textDecoration: "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 text-center">
                <h5 className="text-white">{member.name}</h5>
                <span className="text-danger">{member.designation}</span>
                {member.bio && (
                  <p className="mt-2 mb-0" style={{ color: "rgba(255,255,255,0.9)" }}>{member.bio}</p>
                )}
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
