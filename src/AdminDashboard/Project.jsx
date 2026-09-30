import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Badge,
  Modal,
  Alert,
  InputGroup
} from "react-bootstrap";

import {
  FiSun,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiImage,
  FiEye,
  FiSearch,
  FiX,
  FiUploadCloud,
  FiAward
} from "react-icons/fi";
import { db } from "../firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const Project = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]); // { key, name, category, description, image }
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Blue theme colors
  const themeColors = {
    primary: "#0d6efd",
    secondary: "#e9ecef",
    gradient: "linear-gradient(135deg, #0d6efd 0%, #6ea8fe 100%)",
    light: "#f8f9fa",
    dark: "#0a58ca"
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // store as base64 data URL similar to Services
      };
      reader.readAsDataURL(file);
    }
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !description || !image) {
      showAlertMessage("Please fill all fields!");
      return;
    }
    try {
      const listRef = ref(db, "content/projects");
      if (editIndex !== null) {
        const key = projects[editIndex].key;
        await update(ref(db, `content/projects/${key}`), {
          name,
          category,
          description,
          image,
          updatedAt: new Date().toISOString(),
        });
        setEditIndex(null);
        showAlertMessage("Project updated successfully!");
      } else {
        const newRef = push(listRef);
        await set(newRef, {
          name,
          category,
          description,
          image,
          createdAt: new Date().toISOString(),
        });
        showAlertMessage("Project added successfully!");
      }
      resetForm();
    } catch (err) {
      console.error("Error saving project:", err);
      showAlertMessage("Failed to save. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setDescription("");
    setImage(null);
    setImageFile(null);
  };

  const handleDelete = async (index) => {
    try {
      const key = projects[index].key;
      await remove(ref(db, `content/projects/${key}`));
      setShowDeleteModal(false);
      showAlertMessage("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      showAlertMessage("Failed to delete. Please try again.");
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setName(project.name);
    setCategory(project.category);
    setDescription(project.description);
    setImage(project.image);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditIndex(null);
    resetForm();
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Subscribe to projects on mount
  useEffect(() => {
    const listRef = ref(db, "content/projects");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
      }
      setProjects(list);
      
      if (location.state?.editProject && list.length > 0) {
        const pKey = location.state.editProject.key;
        const idx = list.findIndex(p => p.key === pKey);
        if (idx !== -1) {
          setName(list[idx].name);
          setCategory(list[idx].category);
          setDescription(list[idx].description);
          setImage(list[idx].image);
          setEditIndex(idx);
          window.scrollTo({ top: 0, behavior: "smooth" });
          navigate(location.pathname, { replace: true });
        }
      }
    });
    return () => unsub();
  }, [location.state, location.pathname, navigate]);

  return (
    <Container fluid className="py-3 py-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Row className="align-items-center mb-3 mb-md-4">
        <Col>
          <div className="d-flex align-items-center">
            <div className="bg-primary p-2 p-md-3 rounded-circle me-2 me-md-3">
              <FiSun size={24} className="text-white" />
            </div>
            <div>
              <h1 className="mb-0 fw-bold text-dark fs-4 fs-md-2">Solar Project Manager</h1>
              <p className="text-muted mb-0 small d-none d-md-block">Manage your solar energy projects efficiently</p>
            </div>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert 
          variant="success" 
          className="d-flex align-items-center shadow-sm mb-3"
          style={{ 
            borderLeft: `4px solid ${themeColors.primary}`,
            borderRadius: '10px'
          }}
        >
          <FiAward className="me-2" />
          {alertMessage}
        </Alert>
      )}

      <Row>
        {/* Form Left */}
        <Col lg={5} className="mb-3 mb-md-4">
          <Card
            className="p-3 p-md-4 shadow-lg border-0 mb-3 mb-md-4"
            style={{ 
              borderTop: `4px solid ${themeColors.primary}`,
              borderRadius: '15px',
              background: 'white'
            }}
          >
            <div className="d-flex align-items-center mb-3 mb-md-4">
              <div 
                className="p-2 rounded-circle me-2 me-md-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: themeColors.secondary, color: themeColors.primary, width: '40px', height: '40px' }}
              >
                {editIndex !== null ? <FiEdit size={18} /> : <FiPlus size={18} />}
              </div>
              <h4 className="mb-0 fw-bold fs-5 fs-md-4">
                {editIndex !== null ? "Edit Project" : "Add New Project"}
              </h4>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark">Project Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Solar Panel Installation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ 
                    borderColor: themeColors.primary,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark">Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ 
                    borderColor: themeColors.primary,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Solar Panels">Solar Panels</option>
                  <option value="Wind Turbines">Wind Turbines</option>
                  <option value="Hydropower Plants">Hydropower Plants</option>
                  <option value="Energy Storage">Energy Storage</option>
                  <option value="Grid Integration">Grid Integration</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe the project in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ 
                    borderColor: themeColors.primary,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark d-flex align-items-center">
                  <FiImage className="me-2" /> Project Image
                </Form.Label>
                <div className="border rounded p-3 text-center" style={{ borderStyle: 'dashed', borderColor: themeColors.primary }}>
                  <FiUploadCloud size={20} className="text-muted mb-2" />
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <Form.Label htmlFor="image-upload" className="btn btn-outline-primary rounded-pill btn-sm">
                    Choose Image
                  </Form.Label>
                  {imageFile && (
                    <p className="text-success mt-2 mb-0 small text-truncate">{imageFile.name}</p>
                  )}
                </div>
                <Form.Text className="text-muted small">
                  Recommended: Landscape image, at least 800x600 pixels
                </Form.Text>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-pill fw-semibold py-2"
                  style={{ 
                    backgroundColor: themeColors.primary, 
                    borderColor: themeColors.primary,
                    fontSize: '16px'
                  }}
                >
                  {editIndex !== null ? "Update Project" : "Add Project"}
                </Button>
                {editIndex !== null && (
                  <Button
                    variant="outline-secondary"
                    onClick={cancelEdit}
                    className="rounded-pill py-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </Form>
          </Card>
        </Col>

        {/* Preview Right */}
        <Col lg={7}>
          {name || description || image ? (
            <Card
              className="p-3 p-md-4 shadow-lg border-0 mb-3 mb-md-4"
              style={{ 
                borderLeft: `4px solid ${themeColors.primary}`,
                borderRadius: '15px',
                background: 'white'
              }}
            >
              <div className="d-flex align-items-center mb-3 mb-md-4">
                <div 
                  className="p-2 rounded-circle me-2 me-md-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: themeColors.secondary, color: themeColors.primary, width: '40px', height: '40px' }}
                >
                  <FiEye size={18} />
                </div>
                <h4 className="mb-0 fw-bold fs-5 fs-md-4">Project Preview</h4>
              </div>

              <div className="text-center">
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="img-fluid rounded mb-3"
                    style={{ 
                      height: "200px", 
                      width: "100%",
                      objectFit: "cover",
                      border: `3px solid ${themeColors.primary}`,
                      boxShadow: `0 8px 16px ${themeColors.primary}40`,
                      borderRadius: '12px'
                    }}
                  />
                )}
                {name && (
                  <h3 className="fw-bold mb-2 fs-5 fs-md-4" style={{ color: themeColors.primary }}>{name}</h3>
                )}
                {category && (
                  <Badge 
                    className="p-2 mb-2 rounded-pill"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      fontSize: '0.9rem'
                    }}
                  >
                    {category}
                  </Badge>
                )}
                {description && (
                  <p className="text-muted mb-3 fs-6">{description}</p>
                )}
                <Button
                  className="rounded-pill px-3 py-2 fw-semibold"
                  style={{ 
                    backgroundColor: themeColors.primary, 
                    borderColor: themeColors.primary 
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ) : (
            <Card
              className="p-4 text-center shadow-lg border-0 mb-3 mb-md-4"
              style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: `3px dashed ${themeColors.primary}`,
                borderRadius: '15px'
              }}
            >
              <FiImage size={48} className="text-muted mb-3 opacity-50" />
              <h4 className="fs-5" style={{ color: themeColors.primary }}>Project Preview</h4>
              <p className="text-muted fs-6">Fill out the form to see a preview of your project</p>
            </Card>
          )}
        </Col>
      </Row>

      {/* Projects Table */}
      <Row>
        <Col>
          <Card className="shadow-lg border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
            <Card.Header 
              className="py-3 py-md-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-center"
              style={{ 
                background: themeColors.gradient,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <h4 className="mb-2 mb-md-0 d-flex align-items-center fs-5 fs-md-4">
                <FiSun className="me-2" /> Solar Projects ({projects.length})
              </h4>
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <InputGroup>
                  <InputGroup.Text style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    border: 'none',
                    borderTopLeftRadius: '25px',
                    borderBottomLeftRadius: '25px'
                  }}>
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      border: 'none',
                      borderTopRightRadius: '25px',
                      borderBottomRightRadius: '25px'
                    }}
                  />
                  {searchQuery && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchQuery("")}
                      style={{ color: 'white' }}
                    >
                      <FiX />
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredProjects.length > 0 ? (
                <div className="table-responsive">
                  <Table hover responsive className="mb-0">
                    <thead style={{ backgroundColor: themeColors.secondary }}>
                      <tr>
                        <th style={{ color: themeColors.primary, padding: '12px 8px' }}>#</th>
                        <th style={{ color: themeColors.primary, padding: '12px 8px' }}>Image</th>
                        <th style={{ color: themeColors.primary, padding: '12px 8px' }}>Project Name</th>
                        <th style={{ color: themeColors.primary, padding: '12px 8px' }}>Category</th>
                        <th style={{ color: themeColors.primary, padding: '12px 8px' }} className="d-none d-md-table-cell">Description</th>
                        <th style={{ color: themeColors.primary, padding: '12px 8px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project, index) => (
                        <tr key={project.key || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                          <td className="fw-bold align-middle" style={{ padding: '12px 8px' }}>{index + 1}</td>
                          <td className="align-middle" style={{ padding: '12px 8px' }}>
                            <img
                              src={project.image}
                              alt="Project"
                              className="rounded shadow-sm"
                              style={{ 
                                width: "60px", 
                                height: "45px", 
                                objectFit: "cover",
                                border: `2px solid ${themeColors.primary}`
                              }}
                            />
                          </td>
                          <td className="align-middle" style={{ padding: '12px 8px' }}>
                            <div className="fw-semibold">{project.name}</div>
                          </td>
                          <td className="align-middle" style={{ padding: '12px 8px' }}>
                            <Badge 
                              className="p-1 p-md-2 rounded-pill"
                              style={{ 
                                backgroundColor: themeColors.primary,
                                fontSize: '0.8rem'
                              }}
                            >
                              {project.category}
                            </Badge>
                          </td>
                          <td className="align-middle d-none d-md-table-cell" style={{ padding: '12px 8px' }}>
                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                              {project.description}
                            </div>
                          </td>
                          <td className="align-middle" style={{ padding: '12px 8px' }}>
                            <div className="d-flex flex-wrap gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill px-2"
                                onClick={() => handleEdit(index)}
                                style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                              >
                                <FiEdit className="me-0 me-md-1" /> 
                                <span className="d-none d-md-inline">Edit</span>
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill px-2"
                                onClick={() => confirmDelete(index)}
                              >
                                <FiTrash2 className="me-0 me-md-1" /> 
                                <span className="d-none d-md-inline">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FiSun size={48} className="text-muted mb-3 opacity-50" />
                  <h4 className="text-muted fs-5">
                    {searchQuery ? "No projects found" : "No projects added yet"}
                  </h4>
                  <p className="text-muted fs-6">
                    {searchQuery ? "Try a different search term" : "Add your first project using the form above"}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center">
            <FiTrash2 size={48} className="text-primary mb-3" />
            <h5>Are you sure you want to delete this project?</h5>
            <p className="text-muted">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(deleteIndex)}
            style={{ backgroundColor: themeColors.primary, borderColor: themeColors.primary }}
            className="px-4"
          >
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Project;