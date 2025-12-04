import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Carousel,
  Badge,
  Card,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaGamepad, FaFire, FaStar, FaTrophy, FaSearch } from "react-icons/fa";
import api from "../../services/api";
import GameCardFlip from "../../components/common/GameCardFlip";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import UserLayout from "../../components/layout/UserLayout";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genres = [
    "All",
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Sports",
    "Racing",
    "Simulation",
    "Puzzle",
    "Horror",
    "Fighting",
    "Platformer",
    "Shooter",
  ];

  // Handle search from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Filter games when search or genre changes
  useEffect(() => {
    filterGames();
  }, [searchTerm, selectedGenre, games]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/games");
      setGames(data.data);
      setFilteredGames(data.data);
      
      // Set first 3 games as featured for carousel
      setFeaturedGames(data.data.slice(0, Math.min(3, data.data.length)));
      
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = games;

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter((game) => game.genre === selectedGenre);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    window.history.pushState({}, "", "/");
  };

  if (loading) {
    return (
      <UserLayout showSidebar={!!user}>
        <Loader />
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout showSidebar={!!user}>
        <Container className="mt-5">
          <Message variant="danger">{error}</Message>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout showSidebar={!!user}>
      <div className="home-page-content">
        {/* ========== HERO CAROUSEL ========== */}
        {!searchTerm && selectedGenre === "All" && featuredGames.length > 0 && (
          <div className="hero-carousel-section">
            <Carousel
              fade
              indicators={true}
              controls={true}
              interval={4000}
              pause="hover"
              keyboard={true}
              touch={true}
            >
              {featuredGames.map((game) => (
                <Carousel.Item key={game._id}>
                  <div
                    className="carousel-image-wrapper"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${
                        game.image || "https://via.placeholder.com/1920x600?text=Game+Image"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <Carousel.Caption className="carousel-custom-caption">
                      <div className="carousel-content">
                        {/* Featured Badge */}
                        <Badge
                          bg="warning"
                          text="dark"
                          className="featured-badge"
                        >
                          <FaFire /> Featured
                        </Badge>

                        {/* Game Title */}
                        <h1 className="carousel-title">{game.title}</h1>

                        {/* Description - Hidden on mobile */}
                        <p className="carousel-description d-none d-md-block">
                          {game.description?.substring(0, 150)}...
                        </p>

                        {/* Genre and Price */}
                        <div className="carousel-meta">
                          <Badge bg="primary" className="genre-badge">
                            {game.genre}
                          </Badge>
                          <span className="price-tag">${game.price}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="carousel-actions">
                          <Button
                            as={Link}
                            to={`/game/${game._id}`}
                            variant="primary"
                            size="lg"
                            className="btn-glow"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Carousel.Caption>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}

        <Container className="content-container py-4">
          {/* ========== HEADER ========== */}
          <Row className="page-header mb-4">
            <Col>
              <h1 className="main-title">
                <FaGamepad className="title-icon" />
                NINJA's Store
              </h1>
              {searchTerm && (
                <div className="search-info">
                  <p className="search-result-text">
                    Results for: <strong>"{searchTerm}"</strong>
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleClearSearch}
                    className="clear-search-btn"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
              <p className="subtitle">
                Browse our collection of amazing games
              </p>
            </Col>
          </Row>

          {/* ========== SEARCH AND FILTER SECTION ========== */}
          <Row className="search-filter-section mb-4">
            <Col>
              <Card className="filter-card">
                <Card.Body className="p-4">
                  <Row className="g-3">
                    {/* Search Bar */}
                    <Col xs={12} lg={8}>
                      <InputGroup className="search-input-group">
                       
                        <Form.Control
                          type="text"
                          placeholder=" 🔎 Search games by title or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-input"
                        />
                        {searchTerm && (
                          <Button
                            variant="outline-secondary"
                            onClick={() => setSearchTerm("")}
                            className="clear-btn"
                          >
                            Clear
                          </Button>
                        )}
                      </InputGroup>
                    </Col>

                    {/* Genre Filter */}
                    <Col xs={12} lg={4}>
                      <Form.Select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="genre-select"
                      >
                        {genres.map((genre) => (
                          <option key={genre} value={genre}>
                            {genre === "All" ? "🎯 All Genres" : `🎮 ${genre}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* ========== QUICK GENRE PILLS (Desktop only) ========== */}
          <Row className="genre-pills-section mb-4 d-none d-md-block">
            <Col>
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <h6 className="filter-label">
                  
                  
                </h6>
                <div className="genre-pills">
                  {genres.slice(0, 7).map((genre) => (
                    <Button
                      key={genre}
                      variant={
                        selectedGenre === genre ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setSelectedGenre(genre)}
                      className="genre-pill"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* ========== RESULTS BAR ========== */}
          <Row className="results-bar mb-4">
            <Col xs={12} md={6} className="results-count">
              <FaTrophy className="text-warning me-2" />
              <span>
                Showing <strong>{filteredGames.length}</strong> of{" "}
                <strong>{games.length}</strong> games
              </span>
            </Col>
            <Col xs={12} md={6} className="results-actions">
              {(searchTerm || selectedGenre !== "All") && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleClearSearch}
                  className="reset-link"
                >
                  Reset Filters
                </Button>
              )}
            </Col>
          </Row>

          {/* ========== GAMES GRID ========== */}
          {filteredGames.length === 0 ? (
            <div className="empty-state">
              <FaGamepad className="empty-icon" />
              <h3 className="empty-title">No games found</h3>
              <p className="empty-text">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="primary" onClick={handleClearSearch}>
                Show All Games
              </Button>
            </div>
          ) : (
            <Row xs={1} sm={2} md={2} lg={3} xl={4} className="games-grid g-3 g-md-4 mb-5">
              {filteredGames.map((game) => (
                <Col key={game._id}>
                  <GameCardFlip game={game} />
                </Col>
              ))}
            </Row>
          )}
        </Container>

        {/* ========== STATS SECTION ========== */}
        {!searchTerm && selectedGenre === "All" && games.length > 0 && (
          <div className="stats-section">
            <Container>
              <Row className="text-center g-4">
                <Col xs={12} sm={4}>
                  <div className="stat-box">
                    <h2 className="stat-number text-primary">
                      {games.length}+
                    </h2>
                    <p className="stat-label">Available Games</p>
                  </div>
                </Col>
                <Col xs={12} sm={4}>
                  <div className="stat-box">
                    <h2 className="stat-number text-success">100%</h2>
                    <p className="stat-label">Secure Transactions</p>
                  </div>
                </Col>
                <Col xs={12} sm={4}>
                  <div className="stat-box">
                    <h2 className="stat-number text-warning">24/7</h2>
                    <p className="stat-label">Customer Support</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Home;