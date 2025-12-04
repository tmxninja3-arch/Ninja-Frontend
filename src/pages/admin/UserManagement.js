import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaUsers, FaPlus, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";
import "./AdminPages.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // You'll need to create this endpoint in backend
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("User added successfully!");
      setShowAddModal(false);
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'user' });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <div className="page-header">
                <h2 className="page-title">
                  <FaUsers className="me-2" />
                  User Management
                </h2>
                <Button 
                  variant="primary" 
                  className="cyber-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus className="me-2" />
                  Add User
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="cyber-card">
                <div className="card-header">
                  <h5>All Users ({users.length})</h5>
                </div>
                <div className="table-responsive">
                  <Table hover className="cyber-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg={user.role === 'admin' ? 'warning' : 'info'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button variant="outline-danger" size="sm">
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Add User Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton className="cyber-modal-header">
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAddUser}>
            <Modal.Body className="cyber-modal-body">
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="cyber-modal-footer">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add User
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;