import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Table, Button, Badge, ProgressBar, Dropdown, Modal } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";

import { 
  FiSun, 
  FiActivity, 
  FiCheckCircle, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch,
  FiTrendingUp,
  FiBarChart2,
  FiMenu,
  FiFilter,
  FiMoreVertical
} from "react-icons/fi";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Dashboard = () => {
  const { searchQuery } = useOutletContext();

  const [projects, setProjects] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const deleteProject = (id) => {
    setProjects(projects.filter(project => (project.id ?? project.key) !== id));
    setShowDeleteModal(false);
  };

  const confirmDelete = (id) => {
    setDeleteProjectId(id);
    setShowDeleteModal(true);
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => (p.status || "").toLowerCase() === "active").length;
  const completedProjects = projects.filter(p => (p.status || "").toLowerCase() === "completed").length;
  const totalCapacity = projects.reduce((sum, project) => {
    const raw = String(project.capacity || "0");
    const val = parseFloat(raw);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  // Load projects dynamically from Firebase
  useEffect(() => {
    const listRef = ref(db, "content/projects");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key, idx) => {
          const item = data[key] || {};
          list.push({
            key,
            id: item.id ?? key ?? idx,
            name: item.name || "Untitled Project",
            status: item.status || "Active",
            progress: typeof item.progress === "number" ? item.progress : 0,
            capacity: item.capacity || "0",
            location: item.location || "-",
            startDate: item.startDate || (item.createdAt ? item.createdAt.substring(0,10) : "-"),
            image: item.image,
            category: item.category,
            description: item.description,
          });
        });
      }
      setProjects(list);
    });
    return () => unsub();
  }, []);

  // Status badge color and icon
  const getStatusBadge = (status) => {
    switch(status) {
      case "Active": return { variant: "success", icon: <FiActivity size={14} /> };
      case "Pending": return { variant: "warning", icon: <FiBarChart2 size={14} /> };
      case "Completed": return { variant: "primary", icon: <FiCheckCircle size={14} /> };
      case "Planning": return { variant: "info", icon: <FiTrendingUp size={14} /> };
      default: return { variant: "secondary", icon: null };
    }
  }

  // Progress bar variant
  const getProgressVariant = (progress) => {
    if (progress === 100) return "success";
    if (progress > 70) return "info";
    if (progress > 40) return "primary";
    return "warning";
  }

  return (
    <Container fluid className="py-3 py-md-4">
      <Row className="mb-3 mb-md-4 align-items-center">
        <Col xs={8} md={6}>
          <h2 className="h4 mb-0 d-flex align-items-center">
            <FiSun className="me-2 text-warning" /> Solar Project Dashboard
          </h2>
          <p className="text-muted small d-none d-md-block">Monitor and manage all your renewable energy projects</p>
        </Col>
        <Col xs={4} md={6} className="text-end">
          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              className="d-none d-md-flex align-items-center me-2"
              size="sm"
            >
              <FiPlus className="me-1" /> New Project
            </Button>
            <Button 
              variant="outline-primary" 
              className="d-md-none align-items-center"
              size="sm"
            >
              <FiPlus size={16} />
            </Button>
            <Button 
              variant="outline-secondary" 
              className="ms-2 d-md-none"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FiFilter size={16} />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <Card className="mb-3 d-md-none">
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="outline-primary" size="sm" className="mb-1">All</Button>
              <Button variant="outline-success" size="sm" className="mb-1">Active</Button>
              <Button variant="outline-warning" size="sm" className="mb-1">Pending</Button>
              <Button variant="outline-info" size="sm" className="mb-1">Planning</Button>
              <Button variant="outline-primary" size="sm" className="mb-1">Completed</Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Summary Cards */}
      <Row className="mb-3 mb-md-4 g-2">
        <Col xs={6} md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="bg-primary bg-opacity-10 p-2 rounded">
                  <FiSun className="text-primary" size={18} />
                </div>
                <Badge bg="primary" className="fs-6">{totalProjects}</Badge>
              </div>
              <h6 className="card-title text-secondary mb-0 small">Total Projects</h6>
              <p className="text-muted mb-0 small d-none d-md-block">Across all locations</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6} md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="bg-success bg-opacity-10 p-2 rounded">
                  <FiActivity className="text-success" size={18} />
                </div>
                <Badge bg="success" className="fs-6">{activeProjects}</Badge>
              </div>
              <h6 className="card-title text-secondary mb-0 small">Active Projects</h6>
              <p className="text-muted mb-0 small d-none d-md-block">Currently in progress</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6} md={3} className="mt-2 mt-md-0">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="bg-info bg-opacity-10 p-2 rounded">
                  <FiCheckCircle className="text-info" size={18} />
                </div>
                <Badge bg="info" className="fs-6">{completedProjects}</Badge>
              </div>
              <h6 className="card-title text-secondary mb-0 small">Completed</h6>
              <p className="text-muted mb-0 small d-none d-md-block">Finished projects</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6} md={3} className="mt-2 mt-md-0">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="bg-warning bg-opacity-10 p-2 rounded">
                  <FiTrendingUp className="text-warning" size={18} />
                </div>
                <Badge bg="warning" className="fs-6">{totalCapacity.toFixed(1)} MW</Badge>
              </div>
              <h6 className="card-title text-secondary mb-0 small">Total Capacity</h6>
              <p className="text-muted mb-0 small d-none d-md-block">Combined output</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Project Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 border-0">
          <Row className="align-items-center">
            <Col xs={8} md={6}>
              <h5 className="h6 mb-0 d-flex align-items-center">
                <FiBarChart2 className="me-2 text-primary" /> Project List
              </h5>
            </Col>
            <Col xs={4} md={6} className="text-end">
              <div className="d-flex align-items-center justify-content-end bg-light rounded-pill px-2 py-1">
                <FiSearch className="text-muted me-1" size={14} />
                <span className="text-muted small d-none d-md-inline">{filteredProjects.length} projects</span>
                <span className="text-muted small d-md-none">{filteredProjects.length}</span>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light d-none d-md-table-header-group">
                <tr>
                  <th className="ps-4">Project Name</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Progress</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => {
                  const statusInfo = getStatusBadge(project.status);
                  return (
                    <React.Fragment key={project.key || project.id || index}>
                      {/* Desktop View */}
                      <tr className="d-none d-md-table-row">
                        <td className="ps-4">
                          <div>
                            <div className="fw-semibold">{project.name}</div>
                            <small className="text-muted">Started: {project.startDate}</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={statusInfo.variant} className="d-inline-flex align-items-center py-2">
                            {statusInfo.icon}
                            <span className="ms-1">{project.status}</span>
                          </Badge>
                        </td>
                        <td>{project.location}</td>
                        <td className="fw-semibold">{project.capacity}</td>
                        <td style={{ minWidth: '200px' }}>
                          <div className="d-flex align-items-center">
                            <ProgressBar 
                              now={project.progress} 
                              variant={getProgressVariant(project.progress)}
                              className="flex-grow-1 me-2"
                              style={{ height: '8px' }}
                            />
                            <span className="fw-semibold">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <Button variant="outline-primary" size="sm" className="me-2 d-inline-flex align-items-center">
                            <FiEdit className="me-1" /> Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="d-inline-flex align-items-center"
                            onClick={() => confirmDelete(project.id || project.key || index)}
                          >
                            <FiTrash2 className="me-1" /> Delete
                          </Button>
                        </td>
                      </tr>

                      {/* Mobile View */}
                      <tr className="d-md-none">
                        <td className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="fw-bold mb-1">{project.name}</h6>
                              <Badge bg={statusInfo.variant} className="d-inline-flex align-items-center mb-2">
                                {statusInfo.icon}
                                <span className="ms-1">{project.status}</span>
                              </Badge>
                            </div>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-light" size="sm" className="p-1 border-0">
                                <FiMoreVertical size={16} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <FiEdit className="me-2" /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => confirmDelete(project.id || project.key || index)}>
                                  <FiTrash2 className="me-2" /> Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Location:</span>
                            <span className="fw-semibold">{project.location}</span>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Capacity:</span>
                            <span className="fw-semibold">{project.capacity}</span>
                          </div>
                          
                          <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-muted small">Progress:</span>
                              <span className="fw-semibold">{project.progress}%</span>
                            </div>
                            <ProgressBar 
                              now={project.progress} 
                              variant={getProgressVariant(project.progress)}
                              style={{ height: '6px' }}
                            />
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Start Date:</span>
                            <span className="small">{project.startDate}</span>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <FiSearch size={48} className="mb-2" />
                      <p>No projects found matching your search</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this project? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteProject(deleteProjectId)}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;