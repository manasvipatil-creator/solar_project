import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when a link is clicked (useful for mobile)
  const handleNavClick = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    navigate("/login", { replace: true });
  };

  // Lock background scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [sidebarOpen]);

  return (
    <div className="d-flex">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="d-lg-none bg-dark opacity-50 position-fixed w-100 h-100"
          style={{ zIndex: 999, left: 0, top: 0 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`bg-dark text-white vh-100 p-3 sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{ 
          width: "240px", 
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          transition: "transform 0.3s ease-in-out",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        role="navigation"
        aria-label="Admin sidebar"
        aria-hidden={!sidebarOpen && window.innerWidth < 992}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Admin Panel</h4>
          <Button 
            variant="link" 
            className="d-lg-none text-white p-0"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            ✕
          </Button>
        </div>
        <Nav className="flex-column">
          <Nav.Link 
            as={Link} 
            to="/admin/dashboard" 
            className={`text-white mb-2 ${location.pathname.startsWith('/admin/dashboard') ? 'fw-bold' : ''}`}
            onClick={handleNavClick}
          >
            Dashboard
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/admin/home" 
            className={`text-white mb-2 ${location.pathname.startsWith('/admin/home') ? 'fw-bold' : ''}`}
            onClick={handleNavClick}
          >
            Home Page
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/admin/services" 
            className={`text-white mb-2 ${location.pathname.startsWith('/admin/services') ? 'fw-bold' : ''}`}
            onClick={handleNavClick}
          >
            Services
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/admin/project" 
            className={`text-white mb-2 ${location.pathname.startsWith('/admin/project') ? 'fw-bold' : ''}`}
            onClick={handleNavClick}
          >
            Projects
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/admin/team" 
            className={`text-white mb-2 ${location.pathname.startsWith('/admin/team') ? 'fw-bold' : ''}`}
            onClick={handleNavClick}
          >
            Team
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/admin/contact" 
            className={`text-white ${location.pathname.startsWith('/admin/contact') ? 'fw-bold' : ''}`}
            onClick={handleNavClick}
          >
            Contact
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 main-content" style={{ marginLeft: "0", minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navbar bg="light" expand="lg" className="shadow-sm">
          <Container fluid>
            <Button 
              variant="outline-secondary" 
              className="d-lg-none me-2"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              ☰
            </Button>
            <Navbar.Brand className="fw-bold">🌞 Solar Admin</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-search" />
            <Navbar.Collapse id="navbar-search">
              <Form className="d-flex ms-lg-auto my-2 my-lg-0">
                <FormControl
                  type="search"
                  placeholder="Search Projects..."
                  className="me-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ minWidth: "150px" }}
                />
              </Form>
              <span className="fw-bold ms-lg-2 mt-2 mt-lg-0">Welcome, {localStorage.getItem('adminName') || 'Admin'}</span>
              <Button variant="outline-danger" className="ms-2 mt-2 mt-lg-0" onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid className="mt-4 px-3 px-md-4">
          <Outlet context={{ searchQuery }} />
        </Container>
      </div>

      {/* Add some custom CSS for responsive behavior */}
      <style>{`
        @media (max-width: 991.98px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .main-content {
            margin-left: 0 !important;
          }
        }
        @media (min-width: 992px) {
          .main-content {
            margin-left: 240px !important;
          }
          .sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;