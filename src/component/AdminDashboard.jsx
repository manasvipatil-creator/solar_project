import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Badge
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// API service functions (mock implementation)
const apiService = {
  // Users API
  getUsers: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedUsers = localStorage.getItem('adminUsers');
    return storedUsers ? JSON.parse(storedUsers) : [
      { id: 1, name: "Manaswi", email: "manaswi@example.com", role: "admin", status: "active" },
      { id: 2, name: "Ravi", email: "ravi@example.com", role: "user", status: "active" }
    ];
  },
  
  saveUsers: async (users) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.setItem('adminUsers', JSON.stringify(users));
    return true;
  },
  
  // Projects API
  getProjects: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedProjects = localStorage.getItem('adminProjects');
    return storedProjects ? JSON.parse(storedProjects) : [
      { id: 1, title: "Solar Plant A", status: "Active", location: "Mumbai", capacity: "5MW", completion: 75 },
      { id: 2, title: "Solar Plant B", status: "Pending", location: "Delhi", capacity: "10MW", completion: 20 }
    ];
  },
  
  saveProjects: async (projects) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.setItem('adminProjects', JSON.stringify(projects));
    return true;
  },
  
  // Reports API
  getReports: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedReports = localStorage.getItem('adminReports');
    return storedReports ? JSON.parse(storedReports) : [
      { id: 1, title: "Monthly Energy Report", date: "2025-09-01", type: "Energy", downloads: 145 },
      { id: 2, title: "Annual Maintenance Report", date: "2025-01-15", type: "Maintenance", downloads: 87 }
    ];
  },
  
  // Dashboard stats
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const users = await apiService.getUsers();
    const projects = await apiService.getProjects();
    const reports = await apiService.getReports();
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === "active").length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === "Active").length,
      totalReports: reports.length,
      recentActivities: [
        { id: 1, action: "New user registered", time: "2 hours ago" },
        { id: 2, action: "Project Solar Plant A updated", time: "5 hours ago" },
        { id: 3, action: "Monthly report generated", time: "Yesterday" }
      ]
    };
  }
};

// ---------------- Sidebar ----------------
const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");
  
  const menuItems = [
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "users", label: "Users", path: "/dashboard/users" },
    { key: "projects", label: "Projects", path: "/dashboard/projects" },
    { key: "reports", label: "Reports", path: "/dashboard/reports" }
  ];
  
  const handleNavigation = (path, key) => {
    setActiveItem(key);
    navigate(path);
  };
  
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "220px" }}>
      <h4 className="text-center mb-4">⚡ Solar Admin</h4>
      <Nav className="flex-column">
        {menuItems.map(item => (
          <Nav.Link
            key={item.key}
            onClick={() => handleNavigation(item.path, item.key)}
            className={`text-white mb-2 ${activeItem === item.key ? 'bg-primary rounded' : ''}`}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </Nav.Link>
        ))}
        <Nav.Link
          onClick={() => navigate("/")}
          className="text-white mt-4"
          style={{ cursor: "pointer" }}
        >
          ← Back to Site
        </Nav.Link>
      </Nav>
    </div>
  );
};

// ---------------- Top Navbar ----------------
const TopNavbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-3">
      <Container fluid>
        <Navbar.Brand>Admin Panel</Navbar.Brand>
        <Nav>
          <Nav.Link href="#">Settings</Nav.Link>
          <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

// ---------------- Dashboard Page ----------------
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalReports: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h3 className="mt-3">Dashboard</h3>
      
      <Row className="mt-4">
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="fs-3">{stats.totalUsers}</Card.Text>
              <Badge bg="success">Active: {stats.activeUsers}</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <Card.Text className="fs-3">{stats.totalProjects}</Card.Text>
              <Badge bg="success">Running: {stats.activeProjects}</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Card.Title>Reports Generated</Card.Title>
              <Card.Text className="fs-3">{stats.totalReports}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Card.Title>System Status</Card.Title>
              <Card.Text>
                <Badge bg="success">Operational</Badge>
              </Card.Text>
              <small className="text-muted">Last updated: Today</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentActivities.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.recentActivities.map(activity => (
                    <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {activity.action}
                      <small className="text-muted">{activity.time}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No recent activities</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">Generate Report</Button>
                <Button variant="outline-success">Add New User</Button>
                <Button variant="outline-info">Create Project</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// ---------------- Users Page ----------------
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ 
    id: null, 
    name: "", 
    email: "", 
    role: "user", 
    status: "active" 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentUser({ id: null, name: "", email: "", role: "user", status: "active" });
  };

  const handleShow = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setEditMode(true);
    } else {
      setCurrentUser({ id: null, name: "", email: "", role: "user", status: "active" });
      setEditMode(false);
    }
    setShow(true);
  };

  const handleSubmit = async () => {
    try {
      let updatedUsers;
      
      if (editMode) {
        // Update existing user
        updatedUsers = users.map(u => 
          u.id === currentUser.id ? currentUser : u
        );
      } else {
        // Add new user
        const newUser = { ...currentUser, id: Date.now() };
        updatedUsers = [...users, newUser];
      }
      
      await apiService.saveUsers(updatedUsers);
      setUsers(updatedUsers);
      handleClose();
    } catch (err) {
      setError("Failed to save user");
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const updatedUsers = users.filter(u => u.id !== id);
        await apiService.saveUsers(updatedUsers);
        setUsers(updatedUsers);
      } catch (err) {
        setError("Failed to delete user");
        console.error(err);
      }
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, status: u.status === "active" ? "inactive" : "active" } 
          : u
      );
      
      await apiService.saveUsers(updatedUsers);
      setUsers(updatedUsers);
    } catch (err) {
      setError("Failed to update user status");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h3>Manage Users</h3>
        <Button onClick={() => handleShow()}>
          + Add User
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "admin" ? "primary" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Badge bg={user.status === "active" ? "success" : "secondary"}>
                  {user.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShow(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => toggleUserStatus(user)}
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit User Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentUser.status}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// ---------------- Projects Page ----------------
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState({ 
    id: null, 
    title: "", 
    status: "Active", 
    location: "", 
    capacity: "", 
    completion: 0 
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentProject({ id: null, title: "", status: "Active", location: "", capacity: "", completion: 0 });
  };

  const handleShow = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setEditMode(true);
    } else {
      setCurrentProject({ id: null, title: "", status: "Active", location: "", capacity: "", completion: 0 });
      setEditMode(false);
    }
    setShow(true);
  };

  const handleSubmit = async () => {
    try {
      let updatedProjects;
      
      if (editMode) {
        // Update existing project
        updatedProjects = projects.map(p => 
          p.id === currentProject.id ? currentProject : p
        );
      } else {
        // Add new project
        const newProject = { ...currentProject, id: Date.now() };
        updatedProjects = [...projects, newProject];
      }
      
      await apiService.saveProjects(updatedProjects);
      setProjects(updatedProjects);
      handleClose();
    } catch (err) {
      setError("Failed to save project");
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const updatedProjects = projects.filter(p => p.id !== id);
        await apiService.saveProjects(updatedProjects);
        setProjects(updatedProjects);
      } catch (err) {
        setError("Failed to delete project");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h3>Manage Projects</h3>
        <Button onClick={() => handleShow()}>
          + Add Project
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Completion</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.title}</td>
              <td>{project.location}</td>
              <td>{project.capacity}</td>
              <td>
                <div className="progress" style={{ height: "10px" }}>
                  <div 
                    className={`progress-bar ${project.completion < 50 ? "bg-warning" : "bg-success"}`}
                    role="progressbar" 
                    style={{ width: `${project.completion}%` }}
                    aria-valuenow={project.completion}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {project.completion}%
                  </div>
                </div>
              </td>
              <td>
                <Badge bg={
                  project.status === "Active" ? "success" : 
                  project.status === "Pending" ? "warning" : "secondary"
                }>
                  {project.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShow(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Project Modal */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProject.title}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, title: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={currentProject.status}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, status: e.target.value })
                    }
                  >
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProject.location}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, location: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentProject.capacity}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, capacity: e.target.value })
                    }
                    placeholder="e.g., 5MW"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Completion: {currentProject.completion}%</Form.Label>
              <Form.Range
                min="0"
                max="100"
                value={currentProject.completion}
                onChange={(e) =>
                  setCurrentProject({ ...currentProject, completion: parseInt(e.target.value) })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// ---------------- Reports Page ----------------
const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await apiService.getReports();
      setReports(data);
    } catch (err) {
      setError("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report) => {
    // Simulate download
    alert(`Downloading report: ${report.title}`);
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h3>Reports</h3>
        <Button variant="success">
          Generate New Report
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Date</th>
            <th>Downloads</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.title}</td>
              <td>
                <Badge bg="info">{report.type}</Badge>
              </td>
              <td>{report.date}</td>
              <td>{report.downloads}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => downloadReport(report)}
                >
                  Download
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

// ---------------- Main Admin Dashboard ----------------
const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <TopNavbar />
        <div className="p-3">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;