// src/component/Project.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Project = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("*");
  const [projects, setProjects] = useState([]); // { key, name, category, description, image }
  const [categories, setCategories] = useState([]);
  const [visibleIds, setVisibleIds] = useState([]);
  const itemsRef = useRef({});

  // Subscribe to projects from Firebase
  useEffect(() => {
    const listRef = ref(db, "content/projects");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      const cats = new Set();
      if (data) {
        Object.keys(data).forEach((key) => {
          const item = { key, ...data[key] };
          list.push(item);
          if (item.category) cats.add(item.category);
        });
      }
      setProjects(list);
      setCategories(["*", ...Array.from(cats)]);
      setLoading(false);
    });
    return () => unsub();
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
  }, [loading, filter, projects]);

  const filteredProjects = filter === "*" ? projects : projects.filter((p) => (p.category || "").toLowerCase() === filter.toLowerCase());

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
            {categories.map((cat) => (
              <li
                key={cat}
                className={`list-inline-item px-3 py-2 mx-1 mt-2 rounded-pill ${
                  filter === cat ? "bg-danger text-white fw-bold" : "bg-dark text-light"
                }`}
                style={{ cursor: "pointer", transition: "0.3s" }}
                onClick={() => setFilter(cat)}
              >
                {cat === "*" ? "All" : cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Projects Grid */}
        <Row className="g-4">
          {filteredProjects.map((project, idx) => {
            const id = project.key || project.id || idx;
            return (
            <Col key={id} lg={4} md={6} data-id={id} ref={(el) => (itemsRef.current[id] = el)}>
              <motion.div
                variants={animations[idx % animations.length]} // pick different animation
                initial="hidden"
                animate={visibleIds.includes(String(id)) ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="rounded shadow-lg h-100"
                style={{ backgroundColor: "#111", overflow: "hidden" }}
              >
                <div className="position-relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name || project.category || "Project"}
                    className="img-fluid w-100"
                    style={{ transition: "transform 0.6s ease", height: "240px", objectFit: "cover" }}
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
                  <p className="text-danger mb-1">{project.category}</p>
                  <hr className="text-danger w-25 mx-auto" />
                  <h5>{project.name || project.title}</h5>
                  {project.description && (
                    <p className="mt-2 mb-0" style={{ minHeight: "1.5em", color: "rgba(255,255,255,0.92)" }}>
                      {project.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </Col>
          );
          })}
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
