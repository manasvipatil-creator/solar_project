// src/components/Quote.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const Quote = () => {
  const [loading, setLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    mobile: "",
    service: "",
    note: "",
  });

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Quote form submitted:", quoteForm);
    alert("✅ Thank you for your request! We will contact you soon.");
    setQuoteForm({
      name: "",
      email: "",
      mobile: "",
      service: "",
      note: "",
    });
  };

  // Loader
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
    <>
      <div className="container-fluid px-0" style={{ margin: "3rem 0" }}>
        <div className="quote" style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <Row className="g-0">
            {/* Left Image */}
            <Col
              lg={7}
              className="ps-0"
              style={{
                minHeight: "500px",
                animation: "fadeInLeft 1s ease forwards",
              }}
            >
              <div className="position-relative h-100">
                <img
                  className="position-absolute w-100 h-100"
                  src="img/quote.jpg"
                  style={{
                    objectFit: "cover",
                    filter: "brightness(70%)",
                  }}
                  alt="Quote"
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                  <h2 className="fw-bold display-6">Switch to Solar</h2>
                  <p className="mb-0">Power your future with clean energy</p>
                </div>
              </div>
            </Col>

            {/* Right Form */}
            <Col
              lg={5}
              className="quote-text py-1"
              style={{
                background: "#111",
                color: "white",
                animation: "fadeInRight 1s ease 0.3s forwards",
              }}
            >
              <div className="p-5 pe-4">
                <h6 className="text-danger">Free Quote</h6>
                <h1 className="mb-4 text-white">Get A Free Quote</h1>
                <p className="mb-4 text-light">
                  Ready to save with solar? Fill in the details and our experts
                  will reach out to design a plan tailored for you.
                </p>

                {/* Form */}
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col xs={12} sm={6}>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="bg-dark text-white border-danger"
                        style={{ height: "55px" }}
                        value={quoteForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="bg-dark text-white border-danger"
                        style={{ height: "55px" }}
                        value={quoteForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Control
                        type="text"
                        name="mobile"
                        placeholder="Your Mobile"
                        className="bg-dark text-white border-danger"
                        style={{ height: "55px" }}
                        value={quoteForm.mobile}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Select
                        name="service"
                        className="bg-dark text-white border-danger"
                        style={{ height: "55px" }}
                        value={quoteForm.service}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select A Service</option>
                        <option value="solar-panels">Solar Panels</option>
                        <option value="wind-turbines">Wind Turbines</option>
                        <option value="hydropower">Hydropower Plants</option>
                      </Form.Select>
                    </Col>
                    <Col xs={12}>
                      <Form.Control
                        as="textarea"
                        name="note"
                        placeholder="Special Note"
                        className="bg-dark text-white border-danger"
                        style={{ minHeight: "100px" }}
                        value={quoteForm.note}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs={12}>
                      <Button
                        type="submit"
                        className="rounded-pill py-3 px-5 fw-bold"
                        style={{
                          background: "#dc3545",
                          border: "none",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#b02a37")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#dc3545")
                        }
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Animations & Placeholder Styling */}
      <style>
        {`
          @keyframes fadeInLeft {
            from { transform: translateX(-60px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeInRight {
            from { transform: translateX(60px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          /* Placeholder color for dark background */
          .quote-text input::placeholder,
          .quote-text textarea::placeholder,
          .quote-text select::placeholder {
            color: #ccc;
            opacity: 1;
          }
        `}
      </style>
    </>
  );
};

export default Quote;
