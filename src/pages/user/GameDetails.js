import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
} from 'react-bootstrap';
import api from '../../services/api';
import { useCart } from '../../utils/hooks';
import { useAuth } from '../../utils/hooks';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGameDetails();
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/games/${id}`);
      setGame(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch game details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(game);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Message variant="danger">{error}</Message>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container className="mt-5">
        <Message variant="warning">Game not found</Message>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        ← Back to Games
      </Button>

      <Row>
        {/* Game Image */}
        <Col md={5}>
          <Card>
            <Card.Img
              variant="top"
              src={game.image}
              alt={game.title}
              style={{ height: '800px', objectFit: 'cover' }}
            />
          </Card>
        </Col>

        {/* Game Details */}
        <Col md={7}>
          <div className="mb-3">
            <Badge bg="secondary" className="me-2">
              {game.genre}
            </Badge>
            {game.rating > 0 && (
              <Badge bg="warning" text="dark">
                ⭐ {game.rating}/5
              </Badge>
            )}
          </div>

          <h1 className="display-5 mb-3">{game.title}</h1>

          <div className="mb-4">
            <h2 className="text-primary">${game.price.toFixed(2)}</h2>
          </div>

          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Game Information</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Genre:</strong> {game.genre}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Platform:</strong>{' '}
                  {game.platform?.join(', ') || 'PC'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Stock:</strong>{' '}
                  {game.stock > 0 ? (
                    <Badge bg="success">{game.stock} available</Badge>
                  ) : (
                    <Badge bg="danger">Out of Stock</Badge>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Added:</strong>{' '}
                  {new Date(game.createdAt).toLocaleDateString()}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <div className="d-grid gap-2">
            {user ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={game.stock === 0}
              >
                {game.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                Login to Purchase
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Description Section */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <h3 className="mb-3">About This Game</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{game.description}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameDetails;