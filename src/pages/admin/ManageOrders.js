import { useState, useEffect } from "react";
import { Container, Table, Badge, Form, Row, Col } from "react-bootstrap";
import { FaShoppingBag, FaSearch } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import AdminLayout from "../../components/layout/AdminLayout";
import "./AdminPages.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders/admin/all");
      setOrders(data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      Paid: "info",
      Delivered: "success",
      Cancelled: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Container className="mt-5">
          <Message variant="danger">{error}</Message>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container fluid className="py-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="admin-page-header">
              <div className="header-left">
                <h2 className="admin-page-title">
                  <FaShoppingBag className="me-2" />
                  Manage Orders
                </h2>
                <p className="text-muted mb-0">
                  Total Orders: <strong className="text-primary">{orders.length}</strong>
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="mb-4">
          <Col md={6}>
            <div className="cyber-search-box">
             
              <Form.Control
                type="text"
                placeholder="🔎 Search by user or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-search-input"
              />
            </div>
          </Col>
        </Row>

        {/* Orders Table */}
        <div className="cyber-card">
          <div className="cyber-card-header">
            <h5 className="mb-0">All Orders ({filteredOrders.length})</h5>
          </div>
          <div className="table-responsive">
            <Table hover className="cyber-table mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody >
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-monospace text-dark">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td  className= "text-dark">{order.user?.name || "N/A"}</td>
                    <td  className= "text-dark">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge bg="secondary">{order.games.length}</Badge>
                    </td>
                    <td className="text-success fw-bold">${order.total}</td>
                    <td  className= "text-dark">{order.paymentMethod}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="status-select"
                        style={{ minWidth: "130px" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
};

export default ManageOrders;