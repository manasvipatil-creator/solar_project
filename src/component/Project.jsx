// src/component/Project.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const Project = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("*");
  const [visibleIds, setVisibleIds] = useState([]);
  const itemsRef = useRef({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            setVisibleIds((prev) => [...new Set([...prev, id])]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    Object.values(itemsRef.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading, filter]);

  const projects = [
    { id: 1, image: "img/img-600x400-6.jpg", category: "first", type: "Solar Panels", title: "We Are pioneers of solar & renewable energy industry" },
    { id: 2, image: "img/img-600x400-5.jpg", category: "second", type: "Wind Turbines", title: "We Are pioneers of solar & renewable energy industry" },
    { id: 3, image: "img/img-600x400-4.jpg", category: "third", type: "Hydropower Plants", title: "We Are pioneers of solar & renewable energy industry" },
    { id: 4, image: "img/img-600x400-3.jpg", category: "first", type: "Solar Panels", title: "We Are pioneers of solar & renewable energy industry" },
    { id: 5, image: "img/img-600x400-2.jpg", category: "second", type: "Wind Turbines", title: "We Are pioneers of solar & renewable energy industry" },
    { id: 6, image: "img/img-600x400-1.jpg", category: "third", type: "Hydropower Plants", title: "We Are pioneers of solar & renewable energy industry" },
  ];

  const filteredProjects = filter === "*" ? projects : projects.filter((p) => p.category === filter);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-black">
        <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }}></div>
      </div>
    );
  }

  // 🎭 Different animation variants
  const animations = [
    { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }, // Zoom
    { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } }, // Slide Left
    { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } }, // Slide Right
    { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } }, // Slide Up
    { hidden: { opacity: 0, rotate: -15 }, visible: { opacity: 1, rotate: 0 } }, // Rotate Left
    { hidden: { opacity: 0, rotate: 15 }, visible: { opacity: 1, rotate: 0 } }, // Rotate Right
  ];

  return (
    <div style={{ backgroundColor: "#000", color: "white", padding: "60px 0" }}>
      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-5"
        >
          <h6 className="text-danger">Our Projects</h6>
          <h1 className="fw-bold">Visit Our Latest Solar And Renewable Energy Projects</h1>
        </motion.div>

        {/* Filters */}
        <div className="text-center mb-4">
          <ul className="list-inline">
            {[
              { key: "*", label: "All" },
              { key: "first", label: "Solar Panels" },
              { key: "second", label: "Wind Turbines" },
              { key: "third", label: "Hydropower Plants" },
            ].map((f) => (
              <li
                key={f.key}
                className={`list-inline-item px-3 py-2 mx-1 mt-2 rounded-pill ${
                  filter === f.key ? "bg-danger text-white fw-bold" : "bg-dark text-light"
                }`}
                style={{ cursor: "pointer", transition: "0.3s" }}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Projects Grid */}
        <Row className="g-4">
          {filteredProjects.map((project, idx) => (
            <Col key={project.id} lg={4} md={6} data-id={project.id} ref={(el) => (itemsRef.current[project.id] = el)}>
              <motion.div
                variants={animations[idx % animations.length]} // pick different animation
                initial="hidden"
                animate={visibleIds.includes(project.id.toString()) ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="rounded shadow-lg h-100"
                style={{ backgroundColor: "#111", overflow: "hidden" }}
              >
                <div className="position-relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.type}
                    className="img-fluid w-100"
                    style={{ transition: "transform 0.6s ease" }}
                  />
                  <div
                    className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: "rgba(220,53,69,0.6)",
                      opacity: 0,
                      transition: "opacity 0.4s ease",
                    }}
                  >
                    <a href={project.image} className="btn btn-dark rounded-circle mx-2">
                      <i className="fa fa-eye"></i>
                    </a>
                    <a href="#" className="btn btn-dark rounded-circle mx-2">
                      <i className="fa fa-link"></i>
                    </a>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <p className="text-danger mb-1">{project.type}</p>
                  <hr className="text-danger w-25 mx-auto" />
                  <h5>{project.title}</h5>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Hover effect styles */}
      <style>
        {`
          .rounded:hover img {
            transform: scale(1.1);
          }
          .rounded:hover div[style*="rgba(220,53,69"] {
            opacity: 1 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Project;
