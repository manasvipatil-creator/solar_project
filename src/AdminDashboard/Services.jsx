import React, { useEffect, useState } from "react";
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
  FiDroplet,
  FiSearch,
  FiX,
  FiUploadCloud,
  FiAward
} from "react-icons/fi";
import { db } from "../firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const Services = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [services, setServices] = useState([]); // { key, title, description, image }

  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Theme colors
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
        setImage(reader.result); // base64 data URL for Firebase storage
      };
      reader.readAsDataURL(file);
    }
  };

  // Subscribe to services in Firebase
  useEffect(() => {
    const listRef = ref(db, "content/services");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
      }
      setServices(list);
    });
    return () => unsub();
  }, []);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      showAlertMessage("Please fill all fields!", "danger");
      return;
    }
    try {
      const listRef = ref(db, "content/services");
      if (editIndex !== null) {
        const key = services[editIndex].key;
        await update(ref(db, `content/services/${key}`), {
          title,
          description,
          image,
          updatedAt: new Date().toISOString(),
        });
        setEditIndex(null);
        showAlertMessage("Service updated successfully!");
      } else {
        const newRef = push(listRef);
        await set(newRef, {
          title,
          description,
          image,
          createdAt: new Date().toISOString(),
        });
        showAlertMessage("Service added successfully!");
      }
      resetForm();
    } catch (err) {
      console.error("Error saving service:", err);
      showAlertMessage("Failed to save. Please try again.", "danger");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImageFile(null);
  };

  const handleDelete = async (index) => {
    try {
      const key = services[index].key;
      await remove(ref(db, `content/services/${key}`));
      setShowDeleteModal(false);
      showAlertMessage("Service deleted successfully!");
    } catch (err) {
      console.error("Error deleting service:", err);
      showAlertMessage("Failed to delete. Please try again.", "danger");
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleEdit = (index) => {
    const service = services[index];
    setTitle(service.title);
    setDescription(service.description);
    setImage(service.image);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditIndex(null);
    resetForm();
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="py-3 py-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={9} className="mb-3 mb-md-0">
          <div className="d-flex align-items-center">
            <div className="bg-primary p-2 p-md-3 rounded-circle me-2 me-md-3">
              <FiSun size={24} className="text-white" />
            </div>
            <div>
              <h1 className="h4 mb-0 fw-bold text-dark">Solar Services Manager</h1>
              <p className="text-muted mb-0 d-none d-md-block">Manage your solar energy services efficiently</p>
            </div>
          </div>
        </Col>
        <Col xs={12} md={3}>
        </Col>
      </Row>

      {showAlert && (
        <Alert 
          variant="success" 
          className="d-flex align-items-center shadow-sm mb-3 mb-md-4"
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
        <Col lg={5} className="mb-4">
          <Card
            className="p-3 p-md-4 shadow-lg border-0 mb-4"
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
              <h4 className="h5 mb-0 fw-bold">
                {editIndex !== null ? "Edit Service" : "Add New Service"}
              </h4>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark">Service Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Solar Panel Installation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ 
                    borderColor: themeColors.primary,
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '16px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Describe the service in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ 
                    borderColor: themeColors.primary,
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '16px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 mb-md-4">
                <Form.Label className="fw-semibold text-dark d-flex align-items-center">
                  <FiImage className="me-2" /> Service Image
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
                    <p className="text-success mt-2 mb-0 small">{imageFile.name}</p>
                  )}
                </div>
                <Form.Text className="text-muted">
                  Recommended: Square image, at least 500x500 pixels
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
                  {editIndex !== null ? "Update Service" : "Add Service"}
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
          {title || description || image ? (
            <Card
              className="p-3 p-md-4 shadow-lg border-0 mb-4"
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
                <h4 className="h5 mb-0 fw-bold">Service Preview</h4>
              </div>

              <div className="text-center">
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="img-fluid rounded mb-3 mb-md-4"
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
                {title && (
                  <h3 className="h4 fw-bold mb-2 mb-md-3" style={{ color: themeColors.primary }}>{title}</h3>
                )}
                {description && (
                  <p className="text-muted mb-3 mb-md-4">{description}</p>
                )}
                <Button
                  className="rounded-pill px-3 px-md-4 py-2 fw-semibold"
                  style={{ 
                    backgroundColor: themeColors.primary, 
                    borderColor: themeColors.primary 
                  }}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          ) : (
            <Card
              className="p-4 p-md-5 text-center shadow-lg border-0 mb-4"
              style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: `3px dashed ${themeColors.primary}`,
                borderRadius: '15px'
              }}
            >
              <FiImage size={48} className="text-muted mb-3 opacity-50" />
              <h4 className="h5" style={{ color: themeColors.primary }}>Service Preview</h4>
              <p className="text-muted">Fill out the form to see a preview of your service</p>
            </Card>
          )}
        </Col>
      </Row>

      {/* Services Table */}
      <Row>
        <Col>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <Card.Header 
              className="py-3 py-md-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-center"
              style={{ 
                background: themeColors.gradient,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
            >
              <h4 className="h5 mb-2 mb-md-0 d-flex align-items-center">
                <FiSun className="me-2" /> Solar Services ({services.length})
              </h4>
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <InputGroup size="sm">
                  <InputGroup.Text style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    border: 'none',
                    borderTopLeftRadius: '25px',
                    borderBottomLeftRadius: '25px'
                  }}>
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      border: 'none',
                    }}
                  />
                  {searchQuery && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchQuery("")}
                      style={{ color: 'white' }}
                      className="pe-2"
                    >
                      <FiX />
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredServices.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: themeColors.secondary }}>
                      <tr>
                        <th style={{ color: themeColors.primary, padding: '12px' }}>#</th>
                        <th style={{ color: themeColors.primary, padding: '12px' }}>Image</th>
                        <th style={{ color: themeColors.primary, padding: '12px' }}>Title</th>
                        <th style={{ color: themeColors.primary, padding: '12px' }} className="d-none d-md-table-cell">Description</th>
                        <th style={{ color: themeColors.primary, padding: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service, index) => (
                        <tr key={service.key || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                          <td className="fw-bold align-middle" style={{ padding: '12px' }}>{index + 1}</td>
                          <td className="align-middle" style={{ padding: '12px' }}>
                            <img
                              src={service.image}
                              alt="Service"
                              className="rounded shadow-sm"
                              style={{ 
                                width: "60px", 
                                height: "45px", 
                                objectFit: "cover",
                                border: `2px solid ${themeColors.primary}`
                              }}
                            />
                          </td>
                          <td className="align-middle" style={{ padding: '12px' }}>
                            <Badge 
                              className="p-2 rounded-pill"
                              style={{ 
                                backgroundColor: themeColors.primary,
                                fontSize: '0.8rem'
                              }}
                            >
                              {service.title}
                            </Badge>
                            <div className="text-muted small mt-1 d-md-none">
                              {service.description.length > 50 
                                ? `${service.description.substring(0, 50)}...` 
                                : service.description}
                            </div>
                          </td>
                          <td className="align-middle d-none d-md-table-cell" style={{ padding: '12px' }}>
                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                              {service.description}
                            </div>
                          </td>
                          <td className="align-middle" style={{ padding: '12px' }}>
                            <div className="d-flex flex-wrap gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill px-2"
                                onClick={() => handleEdit(index)}
                                style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                              >
                                <FiEdit className="me-1" /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-pill px-2"
                                onClick={() => confirmDelete(index)}
                              >
                                <FiTrash2 className="me-1" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 py-md-5">
                  <FiSun size={48} className="text-muted mb-2 opacity-50" />
                  <h4 className="h5 text-muted">
                    {searchQuery ? "No services found" : "No services added yet"}
                  </h4>
                  <p className="text-muted">
                    {searchQuery ? "Try a different search term" : "Add your first service using the form above"}
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
            <FiTrash2 size={40} className="text-primary mb-3" />
            <h5>Are you sure you want to delete this service?</h5>
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
            className="px-3"
          >
            Delete Service
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Services;