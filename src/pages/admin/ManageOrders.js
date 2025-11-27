import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Card,
} from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = ['Pending', 'Paid', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/admin/all');
      setOrders(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
  filterStatus === 'All' ? true : order.status === filterStatus
);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
      });
      toast.success('Order status updated successfully!');
      handleCloseModal();
      fetchOrders();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update status';
      toast.error(message);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: 'warning',
      Paid: 'info',
      Delivered: 'success',
      Cancelled: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Message variant="danger">{error}</Message>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">📦 Manage Orders</h1>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <h4>{orders.length}</h4>
              <small className="text-muted">Total Orders</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <h4>
                {orders.filter((o) => o.status === 'Pending').length}
              </h4>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <h4>
                {orders.filter((o) => o.status === 'Delivered').length}
              </h4>
              <small className="text-muted">Delivered</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center">
            <Card.Body>
              <h4>
                $
                {orders
                  .reduce((sum, order) => sum + order.total, 0)
                  .toFixed(2)}
              </h4>
              <small className="text-muted">Total Revenue</small>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Add this before the table */}
<div className="mb-3">
  <Form.Select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    style={{ width: '200px' }}
  >
    <option value="All">All Orders</option>
    <option value="Pending">Pending</option>
    <option value="Paid">Paid</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </Form.Select>
</div>

      {orders.length === 0 ? (
        <Message variant="info">No orders found.</Message>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Games</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>
                  <small>{order._id.substring(0, 8)}...</small>
                </td>
                <td>
                  {order.user?.name || 'Unknown'}
                  <br />
                  <small className="text-muted">
                    {order.user?.email || 'N/A'}
                  </small>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.games.length}</td>
                <td>
                  <strong>${order.total.toFixed(2)}</strong>
                </td>
                <td>
                  <small>{order.paymentMethod}</small>
                </td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleShowModal(order)}
                  >
                    Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.user?.name}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                {getStatusBadge(selectedOrder.status)}
              </p>
              <hr />
              <Form.Group>
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageOrders;