import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaGamepad, FaShoppingBag, FaUsers, FaDollarSign } from "react-icons/fa";
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
      const revenue = ordersRes.data.data.reduce(
        (sum, order) => sum + order.total,
        0
      );

      setStats({
        totalGames: gamesRes.data.data.length,
        totalOrders: ordersRes.data.data.length,
        totalUsers: 0, // Will update when users endpoint is ready
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
      title: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "#ffd700",
      bgColor: "rgba(255, 215, 0, 0.1)",
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
        <Row className="mb-4">
          <Col>
            <h2 className="admin-page-title">
              Dashboard Overview
            </h2>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon; // ← FIX: Get the component
              return (
                <Col key={index} md={6} lg={3}>
                  <Card 
                    className="stat-card"
                    style={{
                      background: stat.bgColor,
                      borderColor: stat.color,
                    }}
                  >
                    <Card.Body>
                      <div className="stat-icon" style={{ color: stat.color }}>
                        <IconComponent /> {/* ← FIX: Render as component */}
                      </div>
                      <h3 className="stat-value" style={{ color: stat.color }}>
                        {stat.value}
                      </h3>
                      <p className="stat-title">{stat.title}</p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </AdminLayout>
  );
};

export default Dashboard; // ← MAKE SURE THIS IS HERE