import { useState, useEffect } from "react";

import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import api from "../../services/api";
import GameCard from "../../components/common/GameCard";
import GameCardFlip from "../../components/common/GameCardFlip";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [cardStyle, setCardStyle] = useState("flip");

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Message variant="danger">{error}</Message>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 mb-2 text-center">🎮NINJA's Store</h1>
          {searchTerm && (
            <p className="text-center text-muted">
              Search results for: <strong>"{searchTerm}"</strong>
              <Button
                variant="link"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            </p>
          )}
          <p className="text-muted lead text-center">
            Browse our collection of amazing games
          </p>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Results Count */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            Showing {filteredGames.length} of {games.length} games
          </p>
        </Col>
      </Row>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <Message variant="info">
          No games found. Try adjusting your search or filters.
        </Message>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredGames.map((game) => (
            <Col key={game._id}>
              {cardStyle === "flip" && <GameCardFlip game={game} />}
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination - existing code */}
    </Container>
  );
};

export default Home;
