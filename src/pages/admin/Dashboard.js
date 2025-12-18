import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap"; // Added Button
import { FaGamepad, FaShoppingBag, FaUsers, FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import "./AdminPages.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch games
      const gamesRes = await api.get("/games");

      // Fetch orders
      const ordersRes = await api.get("/orders/admin/all");

      // Calculate revenue
      const revenue = ordersRes.data.data.reduce((sum, order) => sum + order.total, 0);

      setStats({
        totalGames: gamesRes.data.data.length,
        totalOrders: ordersRes.data.data.length,
        totalUsers: 0, // Update when user API is ready
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Games",
      value: stats.totalGames,
      icon: FaGamepad,
      color: "#00f0ff",
      bgColor: "rgba(0, 240, 255, 0.1)",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FaShoppingBag,
      color: "#ff00ff",
      bgColor: "rgba(255, 0, 255, 0.1)",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FaDollarSign,
      color: "#00ff88",
      bgColor: "rgba(0, 255, 136, 0.1)",
    },
  ];

  return (
    <AdminLayout>
      <Container fluid className="py-4">
        {/* Page Title */}
        <Row className="mb-4">
          <Col>
            <h2 className="admin-page-title">Dashboard Overview</h2>
          </Col>
        </Row>

        {/* Stats Loading or Display */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Col key={index} md={6} lg={4}>
                  <Card
                    className="stat-card h-100"
                    style={{
                      background: stat.bgColor,
                      borderColor: stat.color,
                      borderWidth: '2px',
                    }}
                  >
                    <Card.Body className="text-center">
                      <div
                        className="stat-icon mb-3 d-inline-flex align-items-center justify-content-center"
                        style={{
                          fontSize: '2rem',
                          color: stat.color,
                        }}
                      >
                        <IconComponent />
                      </div>
                      <h3
                        className="stat-value mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </h3>
                      <p className="stat-title text-muted mb-0">{stat.title}</p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Quick Actions */}
        <Row className="mt-4">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Row>
                  {/* Manage Games */}
                  <Col md={6} className="mb-3 mb-md-0">
                    <Card className="border h-100">
                      <Card.Body className="d-flex flex-column">
                        <h5>🎮 Manage Games</h5>
                        <p className="text-muted flex-grow-1">
                          Add, edit, or delete games from the store.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => navigate('/admin/games')}
                          className="align-self-start"
                        >
                          Manage Games
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Manage Orders */}
                  <Col md={6}>
                    <Card className="border h-100">
                      <Card.Body className="d-flex flex-column">
                        <h5>📦 Manage Orders</h5>
                        <p className="text-muted flex-grow-1">
                          View and update order status.
                        </p>
                        <Button
                          variant="success"
                          onClick={() => navigate('/admin/orders')}
                          className="align-self-start"
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
    </AdminLayout>
  );
};

export default Dashboard;