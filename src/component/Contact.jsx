// src/components/Contact.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("✅ Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
    <section className="contact-section py-2" style={{ background: "#111" }}>
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h6 className="text-danger">Get In Touch</h6>
          <h1 className="text-white">Contact Us</h1>
        </motion.div>

        <Row className="g-4">
          {/* Left Side: Info Cards */}
          <Col lg={5}>
            <Row className="g-4">
              <Col xs={12}>
                <Card className="bg-dark text-white shadow-lg border-0 rounded-4 p-3 d-flex flex-row align-items-center">
                  <FaPhoneAlt className="text-danger fs-3 me-3" />
                  <div>
                    <h6 className="text-danger mb-1">Call Us</h6>
                    <p className="mb-0">+91 98765 43210</p>
                  </div>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="bg-dark text-white shadow-lg border-0 rounded-4 p-3 d-flex flex-row align-items-center">
                  <FaEnvelope className="text-danger fs-3 me-3" />
                  <div>
                    <h6 className="text-danger mb-1">Email Us</h6>
                    <p className="mb-0">info@example.com</p>
                  </div>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="bg-dark text-white shadow-lg border-0 rounded-4 p-3 d-flex flex-row align-items-center">
                  <FaMapMarkerAlt className="text-danger fs-3 me-3" />
                  <div>
                    <h6 className="text-danger mb-1">Visit Us</h6>
                    <p className="mb-0">123 Solar Street, Mumbai, India</p>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right Side: Contact Form */}
          <Col lg={7}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card
                className="shadow-lg border-0 rounded-4"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #dc3545",
                  boxShadow: "0px 0px 20px rgba(220, 53, 69, 0.3)",
                }}
              >
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Floating>
                          <Form.Control
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-dark text-white border-danger"
                          />
                          <label
                            htmlFor="name"
                            style={{ color: "#aaa" }}
                          >
                            Your Name
                          </label>
                        </Form.Floating>
                      </Col>
                      <Col md={6}>
                        <Form.Floating>
                          <Form.Control
                            type="email"
                            id="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-dark text-white border-danger"
                          />
                          <label
                            htmlFor="email"
                            style={{ color: "#aaa" }}
                          >
                            Your Email
                          </label>
                        </Form.Floating>
                      </Col>
                      <Col xs={12}>
                        <Form.Floating>
                          <Form.Control
                            type="text"
                            id="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="bg-dark text-white border-danger"
                          />
                          <label
                            htmlFor="subject"
                            style={{ color: "#aaa" }}
                          >
                            Subject
                          </label>
                        </Form.Floating>
                      </Col>
                      <Col xs={12}>
                        <Form.Floating>
                          <Form.Control
                            as="textarea"
                            id="message"
                            placeholder="Message"
                            style={{ height: "120px" }}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            className="bg-dark text-white border-danger"
                          />
                          <label
                            htmlFor="message"
                            style={{ color: "#aaa" }}
                          >
                            Message
                          </label>
                        </Form.Floating>
                      </Col>
                      <Col xs={12}>
                        <Button
                          type="submit"
                          className="rounded-pill px-4 py-2 mt-2"
                          style={{
                            background: "#dc3545",
                            border: "none",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#a71d2a")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#dc3545")
                          }
                        >
                          Send Message
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Map Section */}
       {/* Map Section */}
<Row className="mt-5">
  <Col xs={12}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="rounded-4 overflow-hidden shadow-lg"
      style={{
        height: "450px", // ✅ FIXED height
        border: "2px solid #dc3545",
      }}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609728304!2d72.74109854469163!3d19.082197838494215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63f6d9f8c2f%3A0x8f4f4f4f4f4f4f4f!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1694355445678!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
    </motion.div>
  </Col>
</Row>

      </Container>
    </section>
  );
};

export default Contact;
