// src/components/Testimonial.jsx
import React, { useState, useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";
import { motion } from "framer-motion";

const Testimonial = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  const testimonials = [
    {
      id: 1,
      image: "img/testimonial-1.jpg",
      text: "Clita clita tempor justo dolor ipsum amet kasd amet duo justo duo duo labore sed sed.",
      name: "John Doe",
      profession: "Businessman",
    },
    {
      id: 2,
      image: "img/testimonial-2.jpg",
      text: "Magna ut diam sit et amet stet eos sed clita erat magna elitr erat sit sit erat.",
      name: "Sarah Smith",
      profession: "Entrepreneur",
    },
    {
      id: 3,
      image: "img/testimonial-3.jpg",
      text: "Rebum justo sea clita lorem ipsum amet duo labore sed duo duo magna ut diam.",
      name: "Michael Lee",
      profession: "Engineer",
    },
  ];

  return (
    <div style={{ background: "#000", color: "#fff" }}>
      <Container className="py-5">
        {/* Section Header */}
        <motion.div
          className="text-center mx-auto mb-5"
          style={{ maxWidth: "600px" }}
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h6 className="text-danger">Testimonial</h6>
          <h1 className="mb-4 text-white">What Our Clients Say!</h1>
        </motion.div>

        {/* Carousel */}
        <Carousel
          indicators={false}
          interval={3000}
          nextIcon={
            <span
              className="btn btn-danger rounded-circle shadow d-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="fa fa-chevron-right text-white"></i>
            </span>
          }
          prevIcon={
            <span
              className="btn btn-danger rounded-circle shadow d-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="fa fa-chevron-left text-white"></i>
            </span>
          }
          className="testimonial-carousel"
        >
          {testimonials.map((testimonial) => (
            <Carousel.Item key={testimonial.id}>
              <motion.div
                className="testimonial-item text-center p-5 rounded shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{ background: "#111", border: "1px solid #dc3545" }}
              >
                {/* Image */}
                <div className="position-relative mb-4">
                  <img
                    className="img-fluid rounded-circle shadow-lg"
                    src={testimonial.image}
                    alt="Testimonial"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "3px solid #dc3545",
                    }}
                  />
                  <div
                    className="bg-danger rounded-circle position-absolute top-0 start-100 translate-middle shadow d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fa fa-quote-left text-white"></i>
                  </div>
                </div>

                {/* Text */}
                <p className="fst-italic text-light">{testimonial.text}</p>
                <h5 className="mt-3 mb-1 text-danger">{testimonial.name}</h5>
                <span className="text-white-50">{testimonial.profession}</span>
              </motion.div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default Testimonial;
