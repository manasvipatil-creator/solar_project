import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card, Spinner, Row, Col } from "react-bootstrap";
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
  const [loginType, setLoginType] = useState(""); // 'user' or 'admin'

  useEffect(() => {
    const run = async () => {
      try {
        const adminRef = ref(db, "admin");
        const snapshot = await get(adminRef);
        if (!snapshot.exists()) {
          await setupDefaultAdmin();
        } else {
          setHasAdmin(true);
        }
        setShowLoginForm(true);
        setStatusMessage("Please login to continue.");
      } catch (error) {
        console.error("Error checking admin:", error);
        setStatusMessage("Error checking admin status.");
      }
    };
    run();
  }, []);

  // (admin existence check now handled inside useEffect on mount)

  // Setup default admin
  const setupDefaultAdmin = async () => {
    try {
      await set(ref(db, "admin"), {
        email: "admin123@gmail.com",
        password: "1234567",
        name: "Admin User",
        address: "Admin Address",
        role: "admin",
        createdAt: new Date().toISOString(),
      });
      setHasAdmin(true);
      console.log("Default admin created");
    } catch (error) {
      console.error("Error creating default admin:", error);
    }
  };

  // User registration
  const handleRegister = async (e) => {
    e.preventDefault();
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
      await set(ref(db, `users/${Date.now()}`), {
        name,
        address,
        email: regEmail,
        password: regPassword,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      setStatusMessage("✅ User Registration Successful! Please Login.");
      setName("");
      setAddress("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
      setShowLoginForm(true);
    } catch (error) {
      console.error("Registration Error:", error);
      setStatusMessage("❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Admin registration
  const handleAdminRegister = async (e) => {
    e.preventDefault();
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
      const adminRef = ref(db, "admin");
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        setStatusMessage("❌ Admin already exists. Please login instead.");
        setLoading(false);
        return;
      }

      await set(ref(db, "admin"), {
        email: regEmail,
        password: regPassword,
        name: name || "Admin User",
        address: address || "Admin Address",
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      setStatusMessage("✅ Admin Registration Successful! Please Login.");
      setName("");
      setAddress("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
      setHasAdmin(true);
      setShowLoginForm(true);
    } catch (error) {
      console.error("Admin Registration Error:", error);
      setStatusMessage("❌ Admin registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e, type) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setStatusMessage("❌ Please enter both email and password!");
      return;
    }
    setLoading(true);
    setLoginType(type);

    try {
      if (type === "admin") {
        const adminRef = ref(db, "admin");
        const snapshot = await get(adminRef);
        if (snapshot.exists()) {
          const adminData = snapshot.val();
          if (loginEmail === adminData.email && loginPassword === adminData.password) {
            setStatusMessage("✅ Admin Login Successful!");
            // Persist simple admin session
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("adminEmail", loginEmail);
            if (adminData?.name) localStorage.setItem("adminName", adminData.name);
            navigate("/admin/dashboard", {
              replace: true,
              state: { email: loginEmail, name: adminData.name },
            });
            return;
          } else {
            setStatusMessage("❌ Invalid admin email or password!");
          }
        } else {
          setStatusMessage("❌ No admin account found!");
        }
      } else {
        const usersRef = ref(db, "users");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          let userFound = false;
          Object.keys(usersData).forEach((key) => {
            const user = usersData[key];
            if (user.email === loginEmail && user.password === loginPassword) {
              userFound = true;
              setStatusMessage("✅ User Login Successful!");
              navigate("/", { state: { email: loginEmail, name: user.name } });
            }
          });
          if (!userFound) setStatusMessage("❌ Invalid email or password!");
        } else {
          setStatusMessage("❌ No users found. Please register first.");
        }
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
        backgroundColor: "#ffffff",
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
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
            border: "1px solid #ddd",
            backgroundColor: "#000000",
          }}
        >
          <div
            style={{
              backgroundColor: "#000000",
              padding: "25px",
              color: "white",
              textAlign: "center",
              borderBottom: "2px solid #dc143c",
            }}
          >
            <h4
              className="mb-0 fw-bold"
              style={{
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {showLoginForm ? "Login" : "User Registration"}
            </h4>
          </div>

          <Card.Body className="p-4" style={{ backgroundColor: "#000000" }}>
            {statusMessage && (
              <Alert
                variant={
                  statusMessage.includes("✅") || statusMessage.includes("Please login")
                    ? "success"
                    : "danger"
                }
                className="mb-3"
                style={{
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {statusMessage}
              </Alert>
            )}

            {!showLoginForm ? (
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#f0f0f0" }}>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#f0f0f0" }}>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#f0f0f0" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#f0f0f0" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#f0f0f0" }}>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Register as User"}
                </Button>
                {!hasAdmin && (
                  <Button onClick={handleAdminRegister} className="w-100 mt-2" disabled={loading}>
                    Register as Admin
                  </Button>
                )}
                <div className="text-center mt-3">
                  <Button variant="link" onClick={toggleForm} style={{ color: "#dc143c" }}>
                    Login here
                  </Button>
                </div>
              </Form>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#f0f0f0" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={{ color: "#f0f0f0" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "6px" }}
                  />
                </Form.Group>

                <Row className="g-2 mb-3">
                  <Col>
                    <Button
                      className="w-100"
                      onClick={(e) => handleLogin(e, "user")}
                      disabled={loading}
                    >
                      {loading && loginType === "user" ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Login as User"
                      )}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="w-100"
                      onClick={(e) => handleLogin(e, "admin")}
                      disabled={loading}
                    >
                      {loading && loginType === "admin" ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Login as Admin"
                      )}
                    </Button>
                  </Col>
                </Row>

                <div className="text-center mt-3">
                  <Button variant="link" onClick={toggleForm} style={{ color: "#dc143c" }}>
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
