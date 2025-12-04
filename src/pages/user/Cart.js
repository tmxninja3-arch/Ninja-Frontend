import { useState, useEffect } from 'react';
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
  Spinner,
} from 'react-bootstrap';
import { useCart, useAuth } from '../../utils/hooks';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Message from '../../components/common/Message';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.info('Please login to view your cart');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.info('Item removed from cart');
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setLoading(true);

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

      const { data } = await api.post('/orders', orderData);

      toast.success('🎮 Order placed successfully!');
      clearCart();
      navigate(`/order/${data.data._id}`);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.info('Cart cleared');
    }
  };

  if (!user) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Redirecting to login...</p>
      </Container>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-border-animation"></div>
      
      <Container className="my-5">
        <div className="cart-header">
          <h1 className="cart-title">
            <span className="cart-icon">🛒</span>
            <span className="title-text">Shopping Cart</span>
          </h1>
          <div className="cart-subtitle">Secure Checkout</div>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🎮</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any games yet</p>
            <Button 
              className="cyber-btn-primary"
              onClick={() => navigate('/')}
            >
              <span className="btn-bg"></span>
              <span className="btn-content">Start Shopping</span>
            </Button>
          </div>
        ) : (
          <Row>
            {/* Cart Items */}
            <Col lg={8}>
              <Card className="cart-card">
                <Card.Header className="cart-card-header">
                  <div className="header-content">
                    <span className="header-title">Cart Items</span>
                    <span className="header-count">{cartItems.length}</span>
                  </div>
                </Card.Header>
                
                <ListGroup variant="flush" className="cart-items-list">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id} className="cart-item">
                      <div className="item-glow"></div>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <div className="item-image-wrapper">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fluid
                              rounded
                              className="item-image"
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="item-details">
                            <h6 className="item-title">{item.title}</h6>
                            <small className="item-genre">{item.genre}</small>
                          </div>
                        </Col>
                        <Col md={2}>
                          <div className="item-price">${item.price.toFixed(2)}</div>
                        </Col>
                        <Col md={2} className="text-center">
                          <span className="item-quantity">Qty: 1</span>
                        </Col>
                        <Col md={2} className="text-end">
                          <Button
                            className="cart-remove-btn"
                            onClick={() => handleRemove(item._id)}
                            disabled={loading}
                          >
                            <span className="btn-icon">🗑️</span>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>

              <Button
                className="cart-continue-btn"
                onClick={() => navigate('/')}
              >
                <span className="btn-arrow">←</span>
                Continue Shopping
              </Button>
            </Col>

            {/* Order Summary */}
            <Col lg={4}>
              <Card className="cart-summary">
                <Card.Header className="summary-header">
                  <span className="summary-icon">⚡</span>
                  <span className="summary-title">Order Summary</span>
                </Card.Header>
                
                <Card.Body>
                  <ListGroup variant="flush" className="summary-list">
                    <ListGroup.Item className="summary-item">
                      <span>Items ({cartItems.length}):</span>
                      <strong>${getTotal().toFixed(2)}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="summary-item">
                      <span>Tax:</span>
                      <span>$0.00</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="summary-total">
                      <strong>Total:</strong>
                      <strong className="total-price">
                        ${getTotal().toFixed(2)}
                      </strong>
                    </ListGroup.Item>
                  </ListGroup>

                  <div className="payment-section">
                    <h6 className="payment-title">
                      <span className="payment-icon">💳</span>
                      Payment Method
                    </h6>
                    <Form.Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="payment-select"
                      disabled={loading}
                    >
                      <option value="COD">💵 Cash on Delivery</option>
                      <option value="Marked Paid">✅ Mark as Paid</option>
                      <option value="" disabled>🔒 Online Payment (Coming Soon)</option>
                    </Form.Select>
                  </div>

                  <div className="cart-actions">
                    <Button
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      <span className="btn-bg"></span>
                      <span className="btn-content">
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Processing...
                          </>
                        ) : (
                          <>🚀 Proceed to Checkout</>
                        )}
                      </span>
                    </Button>
                    
                    <Button
                      className="clear-cart-btn"
                      onClick={handleClearCart}
                      disabled={loading}
                    >
                      <span className="btn-icon">🗑️</span>
                      Clear Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Cart;