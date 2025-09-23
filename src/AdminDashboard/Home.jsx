import React, { useEffect, useState } from "react";
import { Card, Form, Button, Table, Row, Col, Badge, Modal, Alert, Container } from "react-bootstrap";
import { FiHome, FiImage, FiEdit, FiTrash2, FiEye, FiPlus, FiX, FiArrowUp } from "react-icons/fi";
import { db } from "../firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const Home = () => {
  const [entries, setEntries] = useState([]); // { key, image, title, description, buttonType }
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    buttonType: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Color scheme
  const primaryColor = "#3B71CA";
  const secondaryColor = "#14A44D";
  const accentColor = "#E4A11B";
  const lightBg = "#f8f9fa";

  useEffect(() => {
    const listRef = ref(db, "content/homeEntries");
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const entries = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          entries.push({ key, ...data[key] });
        });
      }
      setEntries(entries);
    });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add / Update entry (persist to Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listRef = ref(db, "content/homeEntries");
      if (editIndex !== null) {
        const key = entries[editIndex].key;
        await update(ref(db, `content/homeEntries/${key}`), {
          image: formData.image,
          title: formData.title,
          description: formData.description,
          buttonType: formData.buttonType,
          updatedAt: new Date().toISOString(),
        });
        setEditIndex(null);
        setAlertMessage("Entry updated successfully!");
      } else {
        const newRef = push(listRef);
        await set(newRef, {
          image: formData.image,
          title: formData.title,
          description: formData.description,
          buttonType: formData.buttonType,
          createdAt: new Date().toISOString(),
        });
        setAlertMessage("New entry added successfully!");
      }
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setFormData({ image: "", title: "", description: "", buttonType: "" });
    } catch (err) {
      console.error("Error saving entry:", err);
      setAlertMessage("Failed to save. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Edit entry
  const handleEdit = (index) => {
    const { image, title, description, buttonType } = entries[index];
    setFormData({ image, title, description, buttonType });
    setEditIndex(index);
  };

  // Delete entry (from Firebase)
  const handleDelete = async (index) => {
    try {
      const key = entries[index].key;
      await remove(ref(db, `content/homeEntries/${key}`));
      setShowDeleteModal(false);
      setAlertMessage("Entry deleted successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error("Error deleting entry:", err);
      setAlertMessage("Failed to delete. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // Button variant based on type
  const getButtonVariant = (type) => {
    switch (type) {
      case "Learn More":
        return "outline-primary";
      case "Read More":
        return "outline-info";
      case "Get Started":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Container fluid className="px-2 px-md-3 py-3 py-md-4" style={{ backgroundColor: lightBg, minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col xl={10} className="px-0 px-md-3">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-4">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div className="p-2 p-md-3 rounded-circle me-2 me-md-3" style={{ backgroundColor: `${primaryColor}20` }}>
                <FiHome size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="h4 mb-0 fw-bold" style={{ color: primaryColor }}>Home Page Content</h1>
                <p className="text-muted mb-0 small d-none d-md-block">Create and manage content sections for your home page</p>
              </div>
            </div>
            <Badge bg="light" text="dark" className="ms-md-3 p-2 fs-6 align-self-start align-self-md-center">
              {entries.length} Entries
            </Badge>
          </div>

          {showAlert && (
            <Alert variant="success" className="d-flex align-items-center mb-4">
              <FiEdit className="me-2" />
              {alertMessage}
            </Alert>
          )}

          <Row className="mx-0">
            {/* Form Section */}
            <Col lg={5} className="mb-4 px-0 px-md-3">
              <Card className="shadow border-0">
                <Card.Header 
                  className="py-3 text-white" 
                  style={{ 
                    backgroundColor: primaryColor,
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem"
                  }}
                >
                  <h5 className="mb-0 d-flex align-items-center">
                    {editIndex !== null ? <FiEdit className="me-2" /> : <FiPlus className="me-2" />}
                    {editIndex !== null ? "Edit Content Entry" : "Add New Content Entry"}
                  </h5>
                </Card.Header>
                <Card.Body className="p-3 p-md-4">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold d-flex align-items-center">
                        <FiImage className="me-2" /> Upload Image
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleChange}
                        required={editIndex === null}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter section title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        placeholder="Enter section description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Button Type *</Form.Label>
                      <Form.Select
                        name="buttonType"
                        value={formData.buttonType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Button Type</option>
                        <option value="Learn More">Learn More</option>
                        <option value="Read More">Read More</option>
                        <option value="Get Started">Get Started</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button 
                        type="submit" 
                        size="lg"
                        style={{ 
                          backgroundColor: editIndex !== null ? accentColor : secondaryColor,
                          borderColor: editIndex !== null ? accentColor : secondaryColor
                        }}
                      >
                        {editIndex !== null ? "Update Entry" : "Add Entry"}
                      </Button>
                      {editIndex !== null && (
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => {
                            setEditIndex(null);
                            setFormData({
                              image: "",
                              title: "",
                              description: "",
                              buttonType: "",
                            });
                          }}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Preview Section */}
            <Col lg={7} className="px-0 px-md-3">
              <Card className="shadow border-0 h-100 mb-4 mb-lg-0">
                <Card.Header 
                  className="py-3 text-white" 
                  style={{ 
                    backgroundColor: secondaryColor,
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem"
                  }}
                >
                  <h5 className="mb-0 d-flex align-items-center">
                    <FiEye className="me-2" /> Content Preview
                  </h5>
                </Card.Header>
                <Card.Body className="p-3 p-md-4">
                  {formData.title || formData.description || formData.buttonType || formData.image ? (
                    <div className="text-center">
                      {formData.image && (
                        <img
                          src={formData.image}
                          alt="Preview"
                          style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                          className="mb-3 mb-md-4 rounded"
                        />
                      )}
                      <h3 className="h4 mb-2 mb-md-3" style={{ color: primaryColor }}>{formData.title}</h3>
                      <p className="text-muted mb-3 mb-md-4">{formData.description}</p>
                      {formData.buttonType && (
                        <Button 
                          variant={getButtonVariant(formData.buttonType)} 
                          size="lg"
                          className="w-100 w-md-auto"
                        >
                          {formData.buttonType}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 py-md-5 text-muted">
                      <FiImage size={40} className="mb-2 mb-md-3" />
                      <h5 className="h6">No Content to Preview</h5>
                      <p className="small">Fill out the form to see a preview of your content</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Stats Section */}
              <Row className="mt-4 mx-0">
                <Col xs={6} className="mb-3 mb-md-0 px-1">
                  <Card className="border-0 shadow-sm bg-white h-100">
                    <Card.Body className="p-2 p-md-3">
                      <div className="d-flex align-items-center">
                        <div className="me-2 me-md-3">
                          <div 
                            className="p-2 p-md-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            <FiImage size={16} style={{ color: primaryColor }} />
                          </div>
                        </div>
                        <div>
                          <h4 className="h5 mb-0">{entries.length}</h4>
                          <p className="text-muted mb-0 small">Total Entries</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="px-1">
                  <Card className="border-0 shadow-sm bg-white h-100">
                    <Card.Body className="p-2 p-md-3">
                      <div className="d-flex align-items-center">
                        <div className="me-2 me-md-3">
                          <div 
                            className="p-2 p-md-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: `${accentColor}20` }}
                          >
                            <FiEdit size={16} style={{ color: accentColor }} />
                          </div>
                        </div>
                        <div>
                          <h4 className="h5 mb-0">{editIndex !== null ? 1 : 0}</h4>
                          <p className="text-muted mb-0 small">Editing</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Entries Table - Desktop View */}
          <Card className="shadow border-0 mt-4 d-none d-md-block">
            <Card.Header 
              className="py-3" 
              style={{ 
                backgroundColor: "white", 
                borderBottom: `2px solid ${primaryColor}20`,
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem"
              }}
            >
              <h5 className="mb-0" style={{ color: primaryColor }}>Content Entries</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {entries.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: `${primaryColor}08` }}>
                      <tr>
                        <th className="ps-3">#</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Button</th>
                        <th className="text-end pe-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <tr key={index}>
                          <td className="ps-3 fw-semibold">{index + 1}</td>
                          <td>
                            {entry.image && (
                              <img
                                src={entry.image}
                                alt="uploaded"
                                style={{ width: "60px", height: "40px", objectFit: "cover" }}
                                className="rounded"
                              />
                            )}
                          </td>
                          <td>
                            <div className="fw-semibold">{entry.title}</div>
                          </td>
                          <td>
                            <p className="text-muted mb-0" style={{ maxWidth: '200px' }}>
                              {entry.description}
                            </p>
                          </td>
                          <td>
                            <Button variant={getButtonVariant(entry.buttonType)} size="sm">
                              {entry.buttonType}
                            </Button>
                          </td>
                          <td className="text-end pe-3">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(index)}
                            >
                              <FiEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => confirmDelete(index)}
                            >
                              <FiTrash2 />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FiImage size={40} className="text-muted mb-2" />
                  <h5 className="text-muted">No content entries yet</h5>
                  <p className="text-muted">Add your first content entry using the form</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Entries Cards - Mobile View */}
          <div className="d-md-none mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ color: primaryColor }}>Content Entries</h5>
              <Badge bg="light" text="dark">{entries.length}</Badge>
            </div>
            {entries.length > 0 ? (
              <div className="row mx-0">
                {entries.map((entry, index) => (
                  <div key={index} className="col-12 mb-3 px-1">
                    <Card className="shadow-sm border-0 h-100">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <span className="fw-semibold me-2">{index + 1}.</span>
                            <h6 className="mb-0">{entry.title}</h6>
                          </div>
                          <div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEdit(index)}
                            >
                              <FiEdit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => confirmDelete(index)}
                            >
                              <FiTrash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        {entry.image && (
                          <div className="text-center my-2">
                            <img
                              src={entry.image}
                              alt="uploaded"
                              style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
                              className="rounded"
                            />
                          </div>
                        )}
                        <p className="text-muted small mb-2">{entry.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button variant={getButtonVariant(entry.buttonType)} size="sm">
                            {entry.buttonType}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-0 text-center py-5">
                <FiImage size={40} className="text-muted mb-2 mx-auto" />
                <h5 className="text-muted">No content entries yet</h5>
                <p className="text-muted">Add your first content entry using the form</p>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="mobile-modal">
        <Modal.Header closeButton className="px-3 px-md-4">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-3 px-md-4">
          Are you sure you want to delete this content entry? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="px-3 px-md-4">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-fill flex-md-grow-0">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteIndex)} className="flex-fill flex-md-grow-0">
            Delete Entry
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" />
      {/* Custom CSS for mobile responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .table-responsive {
              font-size: 14px;
            }
            .btn {
              padding: 0.375rem 0.75rem;
            }
            .modal-dialog {
              margin: 10px;
            }
            .mobile-modal .modal-content {
              border-radius: 0.5rem;
            }
            .card-header h5 {
              font-size: 1.1rem;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Home;