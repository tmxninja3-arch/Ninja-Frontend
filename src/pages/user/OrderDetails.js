import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Image,
} from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../utils/hooks';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [id, user, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
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
        <Button variant="primary" onClick={() => navigate('/my-orders')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="mt-5">
        <Message variant="warning">Order not found</Message>
        <Button variant="primary" onClick={() => navigate('/my-orders')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate('/my-orders')}
      >
        ← Back to Orders
      </Button>

      <h1 className="mb-4">Order Details</h1>

      <Row>
        {/* Order Info */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Order ID:</strong>
                    <br />
                    <small className="text-muted">{order._id}</small>
                  </p>
                  <p>
                    <strong>Order Date:</strong>
                    <br />
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Status:</strong>
                    <br />
                    {getStatusBadge(order.status)}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>
                    <br />
                    {order.paymentMethod}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Ordered Games</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {order.games.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col md={7}>
                      <h6>{item.title}</h6>
                    </Col>
                    <Col md={3} className="text-end">
                      <strong>${item.price.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Items:</span>
                  <span>{order.games.length}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${order.total.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary">
                    ${order.total.toFixed(2)}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {order.status === 'Delivered' && (
            <Card className="mt-3 bg-success text-white">
              <Card.Body className="text-center">
                <h5>✓ Order Delivered</h5>
                <p className="mb-0">Enjoy your games!</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;