import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Image,
  Form,
} from 'react-bootstrap';
import { useCart } from '../../utils/hooks';
import { useAuth } from '../../utils/hooks';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Message from '../../components/common/Message';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        games: cartItems.map((item) => ({
          game: item._id,
          title: item.title,
          price: item.price,
          image: item.image,
        })),
        total: getTotal(),
        paymentMethod,
      };

      // Create order
      const { data } = await api.post('/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/my-orders');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Message variant="info">
          Your cart is empty.{' '}
          <Button variant="link" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Message>
      ) : (
        <Row>
          {/* Cart Items */}
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={4}>
                        <h6>{item.title}</h6>
                        <small className="text-muted">{item.genre}</small>
                      </Col>
                      <Col md={2}>
                        <strong>${item.price.toFixed(2)}</strong>
                      </Col>
                      <Col md={2} className="text-center">
                        <span className="text-muted">Qty: 1</span>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemove(item._id)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            <Button
              variant="outline-secondary"
              className="mt-3"
              onClick={() => navigate('/')}
            >
              ← Continue Shopping
            </Button>
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
                    <span>Items ({cartItems.length}):</span>
                    <strong>${getTotal().toFixed(2)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong className="text-primary">
                      ${getTotal().toFixed(2)}
                    </strong>
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-4">
                  <h6>Payment Method</h6>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-3"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Marked Paid">Mark as Paid</option>
                    <option value="Online">Online Payment (Coming Soon)</option>
                  </Form.Select>
                </div>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={clearCart}
                    disabled={loading}
                  >
                    Clear Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;