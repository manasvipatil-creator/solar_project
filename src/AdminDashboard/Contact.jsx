import React, { useEffect, useState } from "react";
import { Table, Button, Form, Card, Container, Row, Col, Badge, Modal, Alert, Spinner } from "react-bootstrap";
import { db } from "../firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

const Contact = () => {
  // contacts structure: { key, type, value, icon }
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, variant: "success", message: "" });

  const [formData, setFormData] = useState({
    type: "",
    value: "",
    icon: ""
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // User enquiries (submitted from main site Contact form)
  const [inquiries, setInquiries] = useState([]); // { key, name, email, subject, message, status, timestamp }
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", subject: "", message: "", status: "new" });
  const [inquiryEditKey, setInquiryEditKey] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Color scheme
  const primaryColor = "#4361ee";
  const secondaryColor = "#3a0ca3";
  const accentColor = "#f72585";
  const lightBg = "#f8f9fa";

  // Icon mapping based on type
  const getIconForType = (type) => {
    switch(type) {
      case "Call Us": return "bi-telephone-fill";
      case "Email Us": return "bi-envelope-fill";
      case "Visit Us": return "bi-geo-alt-fill";
      default: return "bi-info-circle-fill";
    }
  };

  // ===== User Enquiries handlers =====
  const handleInquiryOpenEdit = (item) => {
    setInquiryForm({
      name: item.name || "",
      email: item.email || "",
      subject: item.subject || "",
      message: item.message || "",
      status: item.status || "new",
    });
    setInquiryEditKey(item.key);
    setShowInquiryModal(true);
  };

  const handleInquiryUpdate = async (e) => {
    e?.preventDefault?.();
    if (!inquiryEditKey) return;
    try {
      await update(ref(db, `contacts/${inquiryEditKey}`), {
        ...inquiryForm,
      });
      setAlert({ show: true, variant: "success", message: "Inquiry updated." });
      setShowInquiryModal(false);
    } catch (err) {
      console.error("Inquiry update error:", err);
      setAlert({ show: true, variant: "danger", message: "Failed to update inquiry." });
    }
  };

  const handleInquiryDelete = async (key) => {
    try {
      await remove(ref(db, `contacts/${key}`));
      setAlert({ show: true, variant: "success", message: "Inquiry deleted." });
    } catch (err) {
      console.error("Inquiry delete error:", err);
      setAlert({ show: true, variant: "danger", message: "Failed to delete inquiry." });
    }
  };

  const handleInquiryMarkRead = async (key) => {
    try {
      await update(ref(db, `contacts/${key}`), { status: "read" });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // Load from Firebase
  useEffect(() => {
    const listRef = ref(db, "content/contactInfo");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
      }
      setContacts(list);
      setLoading(false);
    }, (err) => {
      console.error("Error loading contact info:", err);
      setAlert({ show: true, variant: "danger", message: "Failed to load contact info." });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load user enquiries from Firebase
  useEffect(() => {
    const msgsRef = ref(db, "contacts");
    const unsub = onValue(
      msgsRef,
      (snapshot) => {
        const data = snapshot.val();
        const list = [];
        if (data) {
          Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
        }
        // Latest first by timestamp if available
        list.sort((a, b) => (new Date(b.timestamp || 0)) - (new Date(a.timestamp || 0)));
        setInquiries(list);
        setInquiriesLoading(false);
      },
      (err) => {
        console.error("Error loading enquiries:", err);
        setInquiriesLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value,
      icon: name === "type" ? getIconForType(value) : formData.icon
    });
  };

  // handle add / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        const item = contacts[editIndex];
        if (!item?.key) return;
        await update(ref(db, `content/contactInfo/${item.key}`), {
          type: formData.type,
          value: formData.value,
          icon: formData.icon || getIconForType(formData.type)
        });
        setAlert({ show: true, variant: "success", message: "Contact method updated." });
        setEditIndex(null);
      } else {
        await push(ref(db, "content/contactInfo"), {
          type: formData.type,
          value: formData.value,
          icon: formData.icon || getIconForType(formData.type)
        });
        setAlert({ show: true, variant: "success", message: "Contact method added." });
      }
    } catch (err) {
      console.error("Save error:", err);
      setAlert({ show: true, variant: "danger", message: "Failed to save contact method." });
    } finally {
      setFormData({ type: "", value: "", icon: "" });
      setTimeout(() => setAlert({ show: false, variant: "success", message: "" }), 3000);
    }
  };

  // edit record
  const handleEdit = (index) => {
    setFormData(contacts[index]);
    setEditIndex(index);
  };

  // confirm delete
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // delete record
  const handleDelete = async () => {
    try {
      const item = contacts[deleteIndex];
      if (!item?.key) return;
      await remove(ref(db, `content/contactInfo/${item.key}`));
      setAlert({ show: true, variant: "success", message: "Contact method deleted." });
    } catch (err) {
      console.error("Delete error:", err);
      setAlert({ show: true, variant: "danger", message: "Failed to delete contact method." });
    } finally {
      setShowDeleteModal(false);
      setTimeout(() => setAlert({ show: false, variant: "success", message: "" }), 3000);
    }
  };

  // cancel edit
  const cancelEdit = () => {
    setFormData({ type: "", value: "", icon: "" });
    setEditIndex(null);
  };

  return (
    <Container fluid className="py-3 py-md-4" style={{ backgroundColor: lightBg, minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col xl={10}>
          {/* Header */}
          <div className="text-center mb-4 mb-md-5">
            <h1 className="fw-bold mb-2 fs-3 fs-md-2" style={{ color: primaryColor }}>Contact Information</h1>
            <p className="text-muted">Manage how customers can get in touch with your business</p>
          </div>

          {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({ show: false, variant: "success", message: "" })} dismissible>
              {alert.message}
            </Alert>
          )}

          <Row>
            {/* Form Section */}
            <Col lg={5} className="mb-4 order-2 order-lg-1">
              <Card className="shadow border-0 h-100">
                <Card.Header 
                  className="py-3" 
                  style={{ 
                    backgroundColor: primaryColor, 
                    color: "white",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem"
                  }}
                >
                  <h5 className="mb-0 fs-6 fs-md-5">
                    {editIndex !== null ? "Edit Contact Method" : "Add New Contact Method"}
                  </h5>
                </Card.Header>
                <Card.Body className="p-3 p-md-4">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Contact Type *</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="py-2"
                      >
                        <option value="">Select a type</option>
                        <option value="Call Us">Call Us</option>
                        <option value="Email Us">Email Us</option>
                        <option value="Visit Us">Visit Us</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Contact Details *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter phone, email, address, etc."
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        required
                        className="py-2"
                      />
                    </Form.Group>

                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        type="submit"
                        className="py-2 px-3 px-md-4 fw-semibold flex-grow-1 flex-md-grow-0"
                        style={{ 
                          backgroundColor: primaryColor, 
                          borderColor: primaryColor 
                        }}
                      >
                        {editIndex !== null ? "Update" : "Add Contact"}
                      </Button>
                      {editIndex !== null && (
                        <Button
                          variant="outline-secondary"
                          className="py-2 px-3 px-md-4 flex-grow-1 flex-md-grow-0"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Preview Section */}
            <Col lg={7} className="mb-4 order-1 order-lg-2">
              <Card className="shadow border-0 h-100">
                <Card.Header 
                  className="py-3" 
                  style={{ 
                    backgroundColor: secondaryColor, 
                    color: "white",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem"
                  }}
                >
                  <h5 className="mb-0 fs-6 fs-md-5">Live Preview</h5>
                </Card.Header>
                <Card.Body className="p-3 p-md-4">
                  {formData.type && formData.value ? (
                    <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: `${primaryColor}10` }}>
                      <div className="me-3 me-md-4">
                        <div 
                          className="p-2 p-md-3 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: primaryColor, width: "50px", height: "50px" }}
                        >
                          <i 
                            className={`bi ${formData.icon || "bi-info-circle-fill"} text-white`} 
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fs-6 fs-md-5" style={{ color: primaryColor }}>{formData.type}</h5>
                        <p className="mb-0 small">{formData.value}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 py-md-5 text-muted">
                      <i className="bi bi-chat-square-text fs-2 fs-md-1 d-block mb-2" style={{ color: secondaryColor }}></i>
                      <p className="mb-0">Fill out the form to see a preview</p>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <Row className="mt-4">
                    <Col md={6} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm">
                        <div className="me-3">
                          <div 
                            className="p-2 p-md-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: `${accentColor}20` }}
                          >
                            <i 
                              className="bi bi-telephone" 
                              style={{ color: accentColor, fontSize: "1.2rem" }}
                            ></i>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-0 fs-5 fs-md-4">
                            {contacts.filter(c => c.type === "Call Us").length}
                          </h4>
                          <p className="text-muted mb-0 small">Phone Contacts</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm">
                        <div className="me-3">
                          <div 
                            className="p-2 p-md-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            <i 
                              className="bi bi-envelope" 
                              style={{ color: primaryColor, fontSize: "1.2rem" }}
                            ></i>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-0 fs-5 fs-md-4">
                            {contacts.filter(c => c.type === "Email Us").length}
                          </h4>
                          <p className="text-muted mb-0 small">Email Contacts</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Contact Methods Table */}
          <Card className="shadow border-0 mt-4 order-3">
            <Card.Header 
              className="py-3" 
              style={{ 
                backgroundColor: "white", 
                borderBottom: `2px solid ${primaryColor}20`,
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem"
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fs-6 fs-md-5" style={{ color: primaryColor }}>Contact Methods</h5>
                <Badge bg="light" text="dark" className="fs-6 p-2">
                  {contacts.length} Methods
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5 text-muted">
                  <Spinner animation="border" role="status" size="sm" className="me-2" /> Loading...
                </div>
              ) : contacts.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: `${primaryColor}08` }}>
                      <tr>
                        <th className="ps-3 ps-md-4">Type</th>
                        <th>Details</th>
                        <th className="text-end pe-3 pe-md-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, index) => (
                        <tr key={index}>
                          <td className="ps-3 ps-md-4">
                            <div className="d-flex align-items-center">
                              <div 
                                className="p-2 rounded-circle me-2 me-md-3 d-flex align-items-center justify-content-center"
                                style={{ backgroundColor: `${primaryColor}20`, width: "36px", height: "36px" }}
                              >
                                <i 
                                  className={`bi ${contact.icon}`} 
                                  style={{ color: primaryColor, fontSize: "0.9rem" }}
                                ></i>
                              </div>
                              <div>
                                <h6 className="mb-0 fs-6">{contact.type}</h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="mb-0 small">{contact.value}</p>
                          </td>
                          <td className="text-end pe-3 pe-md-4">
                            <div className="d-flex justify-content-end gap-1 gap-md-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-0"
                                onClick={() => handleEdit(index)}
                              >
                                <i className="bi bi-pencil d-none d-md-inline"></i>
                                <span className="d-inline d-md-none">Edit</span>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => confirmDelete(index)}
                              >
                                <i className="bi bi-trash d-none d-md-inline"></i>
                                <span className="d-inline d-md-none">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                  <p>No contact methods added yet</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* User Enquiries Table */}
          <Card className="shadow border-0 mt-4">
            <Card.Header
              className="py-3"
              style={{
                backgroundColor: "white",
                borderBottom: `2px solid ${primaryColor}20`,
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fs-6 fs-md-5" style={{ color: primaryColor }}>User Enquiries</h5>
                <Badge bg="light" text="dark" className="fs-6 p-2">
                  {inquiries.length} Messages
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {inquiriesLoading ? (
                <div className="text-center py-5 text-muted">
                  <Spinner animation="border" role="status" size="sm" className="me-2" /> Loading...
                </div>
              ) : inquiries.length > 0 ? (
                <Row className="g-3 g-md-4">
                  {inquiries.map((m) => (
                    <Col key={m.key} xs={12} md={6} lg={4}>
                      <Card className="h-100 shadow-sm" style={{ backgroundColor: "#ffffff", border: "1px solid #000" }}>
                        <Card.Header className="bg-white border-0 pb-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0">{m.name || "-"}</h6>
                              <small className="text-muted">{new Date(m.timestamp || Date.now()).toLocaleString()}</small>
                            </div>
                            <Badge bg={m.status === "read" ? "success" : m.status === "closed" ? "secondary" : "warning"}>
                              {m.status || "new"}
                            </Badge>
                          </div>
                        </Card.Header>
                        <Card.Body className="pt-2">
                          <div className="mb-2">
                            <i className="bi bi-envelope me-2 text-primary"></i>
                            <span className="small">{m.email || "-"}</span>
                          </div>
                          <div className="mb-2">
                            <i className="bi bi-tag me-2 text-secondary"></i>
                            <span className="small">{m.subject || "-"}</span>
                          </div>
                          <div className="p-2 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                            <div className="small" style={{ whiteSpace: "pre-wrap" }}>{m.message || "-"}</div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white border-0">
                          <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline-success" size="sm" onClick={() => handleInquiryMarkRead(m.key)}>
                              <i className="bi bi-check2"></i>
                            </Button>
                            <Button variant="outline-primary" size="sm" onClick={() => handleInquiryOpenEdit(m)}>
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleInquiryDelete(m.key)}>
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  <p>No enquiries yet</p>
                </div>
              )}
            </Card.Body>
          </Card>

        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this contact method? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Inquiry Edit Modal */}
      <Modal show={showInquiryModal} onHide={() => setShowInquiryModal(false)} centered>
        <Form onSubmit={handleInquiryUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Inquiry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={inquiryForm.subject}
                onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={inquiryForm.status}
                onChange={(e) => setInquiryForm({ ...inquiryForm, status: e.target.value })}
              >
                <option value="new">new</option>
                <option value="read">read</option>
                <option value="closed">closed</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInquiryModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" />
    </Container>
  );
};

export default Contact;