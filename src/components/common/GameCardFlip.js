import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from 'react-bootstrap';
import { useCart } from '../../utils/hooks';
import { useAuth } from '../../utils/hooks';
import './GameCardFlip.css';

const GameCardFlip = ({ game }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(game);
    setIsAdding(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/game/${game._id}`);
  };

  return (
    <div 
      className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="flip-card-inner">
        {/* FRONT SIDE */}
        <div className="flip-card-front">
          <div className="flip-card-image-container">
            <img
              src={game.image}
              alt={game.title}
              className="flip-card-image"
            />
            {/* Overlay gradient */}
            <div className="flip-card-overlay"></div>
            
            {/* Stock badge */}
            {game.stock === 0 && (
              <div className="flip-card-stock-badge">
                <Badge bg="danger">Out of Stock</Badge>
              </div>
            )}
            {game.stock > 0 && game.stock < 10 && (
              <div className="flip-card-stock-badge">
                <Badge bg="warning" text="dark">Only {game.stock} left</Badge>
              </div>
            )}
          </div>

          <div className="flip-card-content">
            <Badge bg="secondary" className="mb-2">{game.genre}</Badge>
            <h5 className="flip-card-title">{game.title}</h5>
            <div className="flip-card-price-section">
              <span className="flip-card-price">${game.price.toFixed(2)}</span>
              {game.rating > 0 && (
                <span className="flip-card-rating">
                  ⭐ {game.rating}
                </span>
              )}
            </div>
            <p className="flip-card-hint">Click to flip</p>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="flip-card-back">
          <div className="flip-card-back-content">
            <h4 >{game.title}</h4>
            
            <div className="flip-card-info">
              <div className="info-item">
                <span className="info-label">Genre:</span>
                <span className="info-value">{game.genre}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Price:</span>
                <span className="info-value">${game.price.toFixed(2)}</span>
              </div>
              
              {game.rating > 0 && (
                <div className="info-item">
                  <span className="info-label">Rating:</span>
                  <span className="info-value">⭐ {game.rating} / 5</span>
                </div>
              )}
              
              <div className="info-item">
                <span className="info-label">Stock:</span>
                <span className="info-value">
                  {game.stock > 0 ? `${game.stock} available` : 'Out of stock'}
                </span>
              </div>

              {game.platform && game.platform.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Platform:</span>
                  <span className="info-value">{game.platform.join(', ')}</span>
                </div>
              )}
            </div>

            <p className="flip-card-description">
              {game.description.substring(0, 120)}...
            </p>

            <div className="flip-card-actions">
              {user && (
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={game.stock === 0 || isAdding}
                  className="w-100 mb-2"
                >
                  {isAdding ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Adding...
                    </>
                  ) : game.stock === 0 ? (
                    'Out of Stock'
                  ) : (
                    '🛒 Add to Cart'
                  )}
                </Button>
              )}
              
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleViewDetails}
                className="w-100"
              >
                View Details →
              </Button>
            </div>

            <p className="flip-card-hint text-white-50 mt-3 mb-0">
              Click to flip back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCardFlip;