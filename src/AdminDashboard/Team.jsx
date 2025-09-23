import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, Button, Table, Badge, Modal } from "react-bootstrap";
import { db } from "../firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const Team = () => {
  // Form states
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");

  // Stored team members (from Firebase)
  const [team, setTeam] = useState([]); // { key, name, designation, image, bio }

  // Editing state
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [viewIndex, setViewIndex] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Color scheme
  const primaryColor = "#4361ee";
  const secondaryColor = "#3a0ca3";
  const accentColor = "#f72585";
  const lightBg = "#f8f9fa";

  // Handle image upload (store base64 for preview and DB)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Add or Update member (Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !designation || !image) {
      alert("Please fill all required fields!");
      return;
    }

    const payload = { name, designation, image, bio: bio || "No bio provided" };
    try {
      const listRef = ref(db, "content/team");
      if (editIndex !== null) {
        const key = team[editIndex].key;
        await update(ref(db, `content/team/${key}`), {
          ...payload,
          updatedAt: new Date().toISOString(),
        });
        setEditIndex(null);
      } else {
        const newRef = push(listRef);
        await set(newRef, { ...payload, createdAt: new Date().toISOString() });
      }
      resetForm();
    } catch (err) {
      console.error("Error saving team member:", err);
      alert("Failed to save. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setDesignation("");
    setImage(null);
    setBio("");
  };

  // Edit member
  const handleEdit = (index) => {
    const member = team[index];
    setName(member.name);
    setDesignation(member.designation);
    setImage(member.image);
    setBio(member.bio);
    setEditIndex(index);
  };

  // Delete member confirmation
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // Execute delete (Firebase)
  const handleDelete = async () => {
    try {
      const key = team[deleteIndex].key;
      await remove(ref(db, `content/team/${key}`));
      setShowDeleteModal(false);
      setDeleteIndex(null);
    } catch (err) {
      console.error("Error deleting team member:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  // View member details
  const handleView = (index) => {
    setViewIndex(index);
    setShowViewModal(true);
  };

  // Subscribe to team list on mount
  useEffect(() => {
    const listRef = ref(db, "content/team");
    const unsub = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      const list = [];
      if (data) {
        Object.keys(data).forEach((key) => list.push({ key, ...data[key] }));
      }
      setTeam(list);
    });
    return () => unsub();
  }, []);

  return (
    <Container fluid className="py-3" style={{ backgroundColor: lightBg, minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col xl={10}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="fw-bold mb-0" style={{ color: primaryColor, fontSize: "1.5rem" }}>Team Management</h2>
              <p className="text-muted d-none d-md-block">Add, edit and manage your team members</p>
            </div>
            <Badge bg="light" text="dark" className="fs-6 p-2">
              {team.length} Members
            </Badge>
          </div>

          <Row>
            {/* Form Section */}
            <Col lg={5} className="mb-3">
              <Card className="shadow border-0">
                <Card.Header 
                  className="py-2" 
                  style={{ 
                    backgroundColor: primaryColor, 
                    color: "white",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem"
                  }}
                >
                  <h5 className="mb-0" style={{ fontSize: "1rem" }}>
                    {editIndex !== null ? "Edit Team Member" : "Add New Team Member"}
                  </h5>
                </Card.Header>
                <Card.Body className="p-3">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                      <Form.Label className="fw-semibold">Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter member name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label className="fw-semibold">Designation *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label className="fw-semibold">Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Short bio or description"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Profile Image *</Form.Label>
                      <Form.Control 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="py-2"
                      />
                    </Form.Group>

                    <div className="d-flex gap-2 flex-column flex-md-row">
                      <Button
                        type="submit"
                        className="py-2 px-3 fw-semibold"
                        style={{ 
                          backgroundColor: primaryColor, 
                          borderColor: primaryColor 
                        }}
                      >
                        {editIndex !== null ? "Update Member" : "Add Member"}
                      </Button>
                      {editIndex !== null && (
                        <Button
                          variant="outline-secondary"
                          className="py-2 px-3"
                          onClick={() => {
                            resetForm();
                            setEditIndex(null);
                          }}
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
            <Col lg={7}>
              <Row>
                <Col>
                  <Card className="shadow border-0 mb-3">
                    <Card.Header 
                      className="py-2" 
                      style={{ 
                        backgroundColor: secondaryColor, 
                        color: "white",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem"
                      }}
                    >
                      <h5 className="mb-0" style={{ fontSize: "1rem" }}>Member Preview</h5>
                    </Card.Header>
                    <Card.Body className="p-3">
                      {name && designation && image ? (
                        <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-start">
                          <div className="me-sm-3 mb-2 mb-sm-0">
                            <img
                              src={image}
                              alt="Preview"
                              className="rounded-circle"
                              style={{ 
                                width: "80px", 
                                height: "80px", 
                                objectFit: "cover",
                                border: `3px solid ${primaryColor}`
                              }}
                            />
                          </div>
                          <div>
                            <h5 style={{ color: primaryColor, fontSize: "1.1rem" }}>{name}</h5>
                            <Badge 
                              className="p-1 px-2 mb-1" 
                              style={{ backgroundColor: accentColor, fontSize: "0.75rem" }}
                            >
                              {designation}
                            </Badge>
                            <p className="text-muted mt-1 small">{bio || "No bio provided"}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-person-plus fs-4 d-block mb-1"></i>
                          <p className="small">Fill the form to see a preview</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Stats Section */}
              <Row>
                <Col xs={6} className="mb-2">
                  <Card className="border-0 shadow-sm bg-white">
                    <Card.Body className="p-2">
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          <div 
                            className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            <i 
                              className="bi bi-people-fill" 
                              style={{ color: primaryColor, fontSize: "1rem" }}
                            ></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{team.length}</h6>
                          <p className="text-muted mb-0 small">Total Members</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="mb-2">
                  <Card className="border-0 shadow-sm bg-white">
                    <Card.Body className="p-2">
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          <div 
                            className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: `${accentColor}20` }}
                          >
                            <i 
                              className="bi bi-pencil-square" 
                              style={{ color: accentColor, fontSize: "1rem" }}
                            ></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{editIndex !== null ? 1 : 0}</h6>
                          <p className="text-muted mb-0 small">Editing</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Team Members Table - Replaced with Cards for Mobile */}
          <Card className="shadow border-0 mt-3 d-md-none">
            <Card.Header 
              className="py-2" 
              style={{ 
                backgroundColor: "white", 
                borderBottom: `2px solid ${primaryColor}20`,
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem"
              }}
            >
              <h5 className="mb-0" style={{ color: primaryColor, fontSize: "1.1rem" }}>Team Members</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {team.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-people fs-4 d-block mb-2"></i>
                  <p className="small">No team members added yet</p>
                  <Button 
                    style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                    className="mt-1 py-1 px-3"
                    size="sm"
                    onClick={resetForm}
                  >
                    Add Your First Member
                  </Button>
                </div>
              ) : (
                <div className="p-2">
                  {team.map((member, index) => (
                    <Card key={member.key || index} className="mb-2 border">
                      <Card.Body className="p-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="rounded-circle me-2"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{member.name}</h6>
                            <Badge 
                              style={{ backgroundColor: accentColor }}
                              className="p-1 mt-1"
                              size="sm"
                            >
                              {member.designation}
                            </Badge>
                            <p className="text-muted mb-1 small truncate-text">
                              {member.bio.length > 60 ? `${member.bio.substring(0, 60)}...` : member.bio}
                            </p>
                          </div>
                          <div className="d-flex flex-column">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="mb-1"
                              onClick={() => handleView(index)}
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="mb-1"
                              onClick={() => handleEdit(index)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => confirmDelete(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Team Members Table for Desktop */}
          <Card className="shadow border-0 mt-3 d-none d-md-block">
            <Card.Header 
              className="py-2" 
              style={{ 
                backgroundColor: "white", 
                borderBottom: `2px solid ${primaryColor}20`,
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem"
              }}
            >
              <h5 className="mb-0" style={{ color: primaryColor }}>Team Members</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead style={{ backgroundColor: `${primaryColor}08` }}>
                  <tr>
                    <th className="ps-3">Member</th>
                    <th>Designation</th>
                    <th>Bio</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member, index) => (
                    <tr key={member.key || index}>
                      <td className="ps-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="rounded-circle me-2"
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                          <div>
                            <h6 className="mb-0">{member.name}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge 
                          style={{ backgroundColor: accentColor }}
                          className="p-1"
                        >
                          {member.designation}
                        </Badge>
                      </td>
                      <td>
                        <p className="text-muted mb-0 small truncate-text" style={{ maxWidth: "200px" }}>
                          {member.bio}
                        </p>
                      </td>
                      <td className="text-end pe-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleView(index)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEdit(index)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmDelete(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {team.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        <i className="bi bi-people fs-4 d-block mb-1"></i>
                        <p className="small">No team members added yet</p>
                        <Button 
                          style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                          className="mt-1 py-1 px-3"
                          size="sm"
                          onClick={resetForm}
                        >
                          Add Your First Member
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="py-2">
          <Modal.Title style={{ fontSize: "1.2rem" }}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-2">
          Are you sure you want to delete {deleteIndex !== null && team[deleteIndex]?.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Member Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
        <Modal.Header closeButton className="py-2">
          <Modal.Title style={{ fontSize: "1.2rem" }}>Member Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          {viewIndex !== null && (
            <div className="text-center">
              <img
                src={team[viewIndex].image}
                alt={team[viewIndex].name}
                className="rounded-circle mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <h4 style={{ fontSize: "1.3rem" }}>{team[viewIndex].name}</h4>
              <Badge 
                style={{ backgroundColor: accentColor }} 
                className="p-1 px-2 mb-2"
              >
                {team[viewIndex].designation}
              </Badge>
              <p className="text-muted mt-2">{team[viewIndex].bio}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Add Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" />
    </Container>
  );
};

export default Team;