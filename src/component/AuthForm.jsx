import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, set } from "firebase/database";

const AuthForm = () => {
  const navigate = useNavigate();
  
  // Registration state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // App state
  const [statusMessage, setStatusMessage] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);

  // Check if admin exists on component mount
  useEffect(() => {
    checkAdminExists();
  }, []);

  // Check if admin exists in database
  const checkAdminExists = async () => {
    try {
      const adminRef = ref(db, "admin");
      const snapshot = await get(adminRef);
      setHasAdmin(snapshot.exists());
      
      // If admin exists, show login form by default
      if (snapshot.exists()) {
        setShowLoginForm(true);
        setStatusMessage("Admin exists. Please login.");
      }
    } catch (error) {
      console.error("Error checking admin:", error);
      setStatusMessage("Error checking admin status.");
    }
  };

  // -------- Registration Handler --------
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (regPassword !== confirmPassword) {
      setStatusMessage("❌ Passwords do not match!");
      return;
    }
    
    if (regPassword.length < 6) {
      setStatusMessage("❌ Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    
    try {
      // Check if admin already exists
      const adminRef = ref(db, "admin");
      const snapshot = await get(adminRef);
      
      if (snapshot.exists()) {
        setStatusMessage("❌ Admin already exists. Please login instead.");
        setShowLoginForm(true);
        setLoading(false);
        return;
      }

      // Create admin with a fixed ID instead of push (to ensure only one admin)
      await set(ref(db, "admin/adminUser"), { 
        name, 
        address, 
        email: regEmail, 
        password: regPassword,
        createdAt: new Date().toISOString()
      });

      setStatusMessage("✅ Registration Successful! Please Login.");
      setName("");
      setAddress("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
      setHasAdmin(true);
      setShowLoginForm(true);
    } catch (error) {
      console.error("Registration Error:", error);
      setStatusMessage("❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------- Login Handler --------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if credentials match admin123@gmail.com and 1234567
      if (loginEmail === "admin123@gmail.com" && loginPassword === "1234567") {
        setStatusMessage("✅ Login Successful!");
        // Navigate to dashboard route
        navigate("/dashboard", { state: { email: loginEmail, name: "Admin User" } });
      } else {
        setStatusMessage("❌ Invalid email or password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setStatusMessage("❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
    setStatusMessage("");
    setRegPassword("");
    setConfirmPassword("");
    setLoginPassword("");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card 
          style={{ 
            width: "100%", 
            maxWidth: "450px", 
            borderRadius: "20px", 
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)"
          }}
        >
          <div 
            style={{ 
              background: "linear-gradient(to right, #00c6ff, #0072ff)", 
              padding: "20px", 
              color: "white",
              textAlign: "center"
            }}
          >
            <h4 className="mb-0 fw-bold">
              {showLoginForm ? "Admin Login" : "Admin Registration"}
            </h4>
          </div>
          
          <Card.Body className="p-4">
            {statusMessage && (
              <Alert 
                variant={
                  statusMessage.includes("✅") || statusMessage.includes("Please login") 
                    ? "success" 
                    : statusMessage.includes("❌") 
                    ? "danger" 
                    : "info"
                }
                className="mb-3"
              >
                {statusMessage}
              </Alert>
            )}
            
            {!hasAdmin && !showLoginForm && (
              <Alert variant="info" className="mb-3">
                <strong>No admin found.</strong> Please register as the first admin.
              </Alert>
            )}

            {/* Registration Form */}
            {!showLoginForm && (
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create password (min 6 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 fw-bold rounded-pill py-2"
                  style={{
                    background: "linear-gradient(to right, #00c6ff, #0072ff)",
                    border: "none",
                  }}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                </Button>
                
                <div className="text-center mt-3">
                  <span>Already have an account? </span>
                  <Button 
                    variant="link" 
                    onClick={toggleForm}
                    className="p-0"
                  >
                    Login here
                  </Button>
                </div>
              </Form>
            )}

            {/* Login Form */}
            {showLoginForm && (
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter admin email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 fw-bold rounded-pill py-2"
                  style={{
                    background: "linear-gradient(to right, #00c6ff, #0072ff)",
                    border: "none",
                  }}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                </Button>
                
                <div className="text-center mt-3">
                  <span>Need an account? </span>
                  <Button 
                    variant="link" 
                    onClick={toggleForm}
                    className="p-0"
                  >
                    Register here
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AuthForm;