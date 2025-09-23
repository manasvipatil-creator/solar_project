// src/components/Quote.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { ref, set, get, update } from "firebase/database";
import { db } from "../firebase";

const Quote = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
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

  // Function to create a valid Firebase key from a name
  const createValidKey = (name) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')  // Replace special characters with underscores
      .substring(0, 100); // Limit length for Firebase keys
  };

  // Check if a quote already exists for this name
  const checkExistingQuote = async (nameKey) => {
    try {
      const quoteRef = ref(db, `quotes/${nameKey}`);
      const snapshot = await get(quoteRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking existing quote: ", error);
      return false;
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create a valid key from the name
      const nameKey = createValidKey(quoteForm.name);
      
      // Check if a quote already exists for this name
      const quoteExists = await checkExistingQuote(nameKey);
      
      if (quoteExists) {
        // Update existing quote
        const quoteRef = ref(db, `quotes/${nameKey}`);
        await update(quoteRef, {
          ...quoteForm,
          timestamp: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        setAlertMessage("✅ Your quote request has been updated! We will contact you soon.");
      } else {
        // Create new quote with name as key
        const quoteRef = ref(db, `quotes/${nameKey}`);
        await set(quoteRef, {
          ...quoteForm,
          timestamp: new Date().toISOString(),
        });
        
        setAlertMessage("✅ Thank you for your request! We will contact you soon.");
      }
      
      setAlertVariant("success");
      setShowAlert(true);
      
      // Reset form
      setQuoteForm({
        name: "",
        email: "",
        mobile: "",
        service: "",
        note: "",
      });
      
      // Hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error("Error saving quote: ", error);
      setAlertMessage("❌ There was an error submitting your request. Please try again.");
      setAlertVariant("danger");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
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

                {/* Alert Message */}
                {showAlert && (
                  <Alert variant={alertVariant} className="mb-4">
                    {alertMessage}
                  </Alert>
                )}

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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit"}
                        {submitting && (
                          <div className="spinner-border spinner-border-sm ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
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