import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGames: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch games
      const gamesRes = await api.get('/games');
      const games = gamesRes.data.data;

      // Fetch orders
      const ordersRes = await api.get('/orders/admin/all');
      const orders = ordersRes.data.data;

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(
        (order) => order.status === 'Pending'
      ).length;

      setStats({
        totalGames: games.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">⚙️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h2 className="text-primary">{stats.totalGames}</h2>
              <p className="text-muted mb-0">Total Games</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h2 className="text-success">{stats.totalOrders}</h2>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h2 className="text-info">${stats.totalRevenue.toFixed(2)}</h2>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h2 className="text-warning">{stats.pendingOrders}</h2>
              <p className="text-muted mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Card className="border">
                    <Card.Body>
                      <h5>🎮 Manage Games</h5>
                      <p className="text-muted">
                        Add, edit, or delete games from the store
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/admin/games')}
                      >
                        Manage Games
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className="border">
                    <Card.Body>
                      <h5>📦 Manage Orders</h5>
                      <p className="text-muted">
                        View and update order status
                      </p>
                      <Button
                        variant="success"
                        onClick={() => navigate('/admin/orders')}
                      >
                        Manage Orders
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;