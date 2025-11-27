import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Image,
} from "react-bootstrap";
import api from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import CloudinaryUpload from "../../components/common/CloudinaryUpload";

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    genre: "Action",
    image: "",
    imagePublicId: "",
    downloadURL: "",
    stock: "",
    platform: ["PC"],
    rating: "",
  });

  const genres = [
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
    "Other",
  ];

  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/games");
      setGames(data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowModal = (game = null) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        title: game.title,
        description: game.description,
        price: game.price,
        genre: game.genre,
        image: game.image,
        downloadURL: game.downloadURL || "",
        stock: game.stock,
        platform: game.platform || ["PC"],
        rating: game.rating || "",
      });
    } else {
      setEditingGame(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        genre: "Action",
        image: "",
        downloadURL: "",
        stock: "",
        platform: ["PC"],
        rating: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGame(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlatformChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, platform: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingGame) {
        // Update existing game
        await api.put(`/games/${editingGame._id}`, formData);
        toast.success("Game updated successfully!");
      } else {
        // Create new game
        await api.post("/games", formData);
        toast.success("Game created successfully!");
      }

      handleCloseModal();
      fetchGames();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save game";
      toast.error(message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.delete(`/games/${id}`);
        toast.success("Game deleted successfully!");
        fetchGames();
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to delete game";
        toast.error(message);
      }
    }
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
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🎮 Manage Games</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          + Add New Game
        </Button>
      </div>

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search games by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {games.length === 0 ? (
        <Message variant="info">
          No games found. Click "Add New Game" to create one.
        </Message>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map((game) => (
              <tr key={game._id}>
                <td>
                  <Image
                    src={game.image}
                    alt={game.title}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    rounded
                  />
                </td>
                <td>{game.title}</td>
                <td>
                  <Badge bg="secondary">{game.genre}</Badge>
                </td>
                <td>${game.price.toFixed(2)}</td>
                <td>
                  {game.stock > 0 ? (
                    <Badge bg="success">{game.stock}</Badge>
                  ) : (
                    <Badge bg="danger">Out of Stock</Badge>
                  )}
                </td>
                <td>⭐ {game.rating || "N/A"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(game)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(game._id, game.title)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Image Upload Section */}
      <Form.Group className="mb-3">
        <Form.Label>Game Image</Form.Label>

        {/* Cloudinary Upload Component */}
        <CloudinaryUpload
          currentImage={formData.image}
          onUploadSuccess={(cloudinaryUrl, publicId) => {
            setFormData({
              ...formData,
              image: cloudinaryUrl,
              imagePublicId: publicId, // Store for deletion later
            });
          }}
          uploadType="game"
          buttonText="Upload to Cloud"
        />

        {/* Manual URL Input (Backup Option) */}
        <div className="mt-3">
          <Form.Label>Or paste image URL:</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <small className="text-success d-block mt-1">
              ✓ Image URL set: {formData.image.substring(0, 50)}...
            </small>
          )}
        </div>
      </Form.Group>

      {/* Add/Edit Game Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGame ? "Edit Game" : "Add New Game"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genre *</Form.Label>
              <Form.Select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.image && (
                <Image
                  src={formData.image}
                  alt="Preview"
                  style={{ width: "200px", marginTop: "10px" }}
                  rounded
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Download URL (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="downloadURL"
                value={formData.downloadURL}
                onChange={handleChange}
                placeholder="https://example.com/download"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Platform (Hold Ctrl/Cmd to select multiple)
              </Form.Label>
              <Form.Select
                multiple
                name="platform"
                value={formData.platform}
                onChange={handlePlatformChange}
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating (0-5)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingGame ? "Update Game" : "Create Game"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageGames;
