import { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../utils/hooks';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { variant: 'warning', icon: '⏳' },
      Paid: { variant: 'info', icon: '💳' },
      Delivered: { variant: 'success', icon: '✅' },
      Cancelled: { variant: 'danger', icon: '❌' },
    };

    const config = statusConfig[status] || { variant: 'secondary', icon: '📦' };
    
    return (
      <Badge bg={config.variant} className={`order-badge badge-${status.toLowerCase()}`}>
        <span className="badge-icon">{config.icon}</span>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="order-error">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <Button className="cyber-btn-primary" onClick={fetchOrders}>
            <span className="btn-bg"></span>
            <span className="btn-content">🔄 Retry</span>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="orders-wrapper">
      <div className="orders-border-animation"></div>
      
      <Container className="my-5">
        <div className="orders-header">
          <h1 className="orders-title">
            <span className="orders-icon">📦</span>
            <span className="title-text">My Orders</span>
          </h1>
          <div className="orders-subtitle">Track Your Gaming Collection</div>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">🎮</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders. Start building your gaming library!</p>
            <Button 
              className="cyber-btn-primary"
              onClick={() => navigate('/')}
            >
              <span className="btn-bg"></span>
              <span className="btn-content">Browse Games</span>
            </Button>
          </div>
        ) : (
          <Card className="orders-card">
            <Card.Header className="orders-card-header">
              <div className="header-content">
                <span className="header-title">Order History</span>
                <span className="header-count">{orders.length}</span>
              </div>
            </Card.Header>
            
            <Card.Body className="orders-card-body">
              <div className="table-responsive">
                <Table hover className="orders-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">🆔</span>
                          Order ID
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">📅</span>
                          Date
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">🎮</span>
                          Games
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">💰</span>
                          Total
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">💳</span>
                          Payment
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">📊</span>
                          Status
                        </div>
                      </th>
                      <th>
                        <div className="th-content">
                          <span className="th-icon">⚡</span>
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="order-row">
                        <td>
                          <div className="order-id">
                            <span className="id-hash">#</span>
                            {order._id.substring(0, 8)}...
                          </div>
                        </td>
                        <td>
                          <div className="order-date">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="order-games">
                            <span className="games-count">{order.games.length}</span>
                            <span className="games-text">
                              game{order.games.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="order-total">
                            ${order.total.toFixed(2)}
                          </div>
                        </td>
                        <td>
                          <div className="order-payment">
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <Button
                            className="order-view-btn"
                            onClick={() => navigate(`/order/${order._id}`)}
                          >
                            <span className="btn-icon">👁️</span>
                            <span className="btn-text">View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default MyOrders;