import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../utils/hooks';
import { useAuth } from '../../utils/hooks';

const GameCard = ({ game }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart(game);
  };

  return (
    <Card className="game-card h-100">
      <Link to={`/game/${game._id}`} className="text-decoration-none">
        <Card.Img
          variant="top"
          src={game.image}
          alt={game.title}
           loading="lazy"
          style={{ height: '400px', objectFit: 'cover' }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="genre-badge">
            {game.genre}
          </Badge>
          {game.stock < 10 && game.stock > 0 && (
            <Badge bg="warning" className="ms-2">
              Only {game.stock} left
            </Badge>
          )}
          {game.stock === 0 && (
            <Badge bg="danger" className="ms-2">
              Out of Stock
            </Badge>
          )}
        </div>

        <Card.Title className="mb-2">
          <Link
            to={`/game/${game._id}`}
            className="text-decoration-none text-dark"
          >
            {game.title}
          </Link>
        </Card.Title>

        <Card.Text className="text-muted small mb-3" style={{ flexGrow: 1 }}>
          {game.description.substring(0, 100)}...
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <span className="price-badge text-primary">
              ${game.price.toFixed(2)}
            </span>
            {game.rating > 0 && (
              <div className="small text-warning">
                {'⭐'.repeat(Math.round(game.rating))}
                <span className="text-muted ms-1">({game.rating})</span>
              </div>
            )}
          </div>

          {user && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={game.stock === 0}
            >
              {game.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default GameCard;