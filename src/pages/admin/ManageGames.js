import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaGamepad, FaSearch } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import CloudinaryUpload from "../../components/common/CloudinaryUpload";
import AdminLayout from "../../components/layout/AdminLayout";
import "./AdminPages.css";

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
        imagePublicId: game.imagePublicId || "",
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
        imagePublicId: "",
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
        await api.put(`/games/${editingGame._id}`, formData);
        toast.success("Game updated successfully!");
      } else {
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
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Container className="mt-5">
          <Message variant="danger">{error}</Message>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container fluid className="py-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="admin-page-header">
              <div className="header-left">
                <h2 className="admin-page-title">
                  <FaGamepad className="me-2" />
                  Manage Games
                </h2>
                <p className="text-muted mb-0">
                  Total Games: <strong className="text-primary">{games.length}</strong>
                </p>
              </div>
              <Button 
                variant="primary" 
                className="cyber-btn-primary"
                onClick={() => handleShowModal()}
              >
                <FaPlus className="me-2" />
                Add New Game
              </Button>
            </div>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="mb-4">
          <Col md={6}>
            <div className="cyber-search-box">
              
              <Form.Control
                type="text"
                placeholder="🔎 Search games by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-search-input"
              />
            </div>
          </Col>
        </Row>

        {/* Games Table */}
        {games.length === 0 ? (
          <div className="empty-state-admin">
            <FaGamepad className="empty-icon" />
            <h4>No games found</h4>
            <p>Click "Add New Game" to create your first game</p>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <FaPlus className="me-2" />
              Add New Game
            </Button>
          </div>
        ) : (
          <div className="cyber-card">
            <div className="cyber-card-header">
              <h5 className="mb-0">
                All Games ({filteredGames.length})
              </h5>
            </div>
            <div className="table-responsive">
              <Table hover className="cyber-table mb-0">
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
                          className="table-game-image"
                          rounded
                        />
                      </td>
                      <td className="fw-bold text-dark">{game.title}</td>
                      <td>
                        <Badge bg="primary" className="genre-badge">
                          {game.genre}
                        </Badge>
                      </td>
                      <td className="text-success fw-bold">
                        ${game.price.toFixed(2)}
                      </td>
                      <td>
                        {game.stock > 0 ? (
                          <Badge bg="success">{game.stock}</Badge>
                        ) : (
                          <Badge bg="danger">Out of Stock</Badge>
                        )}
                      </td>
                      <td>
                        <span className="rating-badge">
                          ⭐ {game.rating || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleShowModal(game)}
                            className="action-btn"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(game._id, game.title)}
                            className="action-btn"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {/* Add/Edit Game Modal */}
        <Modal 
          show={showModal} 
          onHide={handleCloseModal} 
          size="lg"
          centered
          className="cyber-modal"
        >
          <Modal.Header closeButton className="cyber-modal-header">
            <Modal.Title>
              {editingGame ? (
                <>
                  <FaEdit className="me-2" />
                  Edit Game
                </>
              ) : (
                <>
                  <FaPlus className="me-2" />
                  Add New Game
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body className="cyber-modal-body">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="cyber-input"
                      placeholder="Enter game title"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">
                      Price <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="cyber-input"
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="cyber-label">
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="cyber-input"
                  placeholder="Enter game description"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">
                      Genre <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                      className="cyber-input"
                    >
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">
                      Stock <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="cyber-input"
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Image Upload Section */}
              <Form.Group className="mb-3">
                <Form.Label className="cyber-label">Game Image</Form.Label>

                <CloudinaryUpload
                  currentImage={formData.image}
                  onUploadSuccess={(cloudinaryUrl, publicId) => {
                    setFormData({
                      ...formData,
                      image: cloudinaryUrl,
                      imagePublicId: publicId,
                    });
                  }}
                  uploadType="game"
                  buttonText="Upload to Cloud"
                />

                <div className="mt-3">
                  <Form.Label className="cyber-label">Or paste image URL:</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="cyber-input"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        style={{ width: "200px", maxHeight: "200px", objectFit: "cover" }}
                        rounded
                        className="image-preview"
                      />
                    </div>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="cyber-label">Download URL (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="downloadURL"
                  value={formData.downloadURL}
                  onChange={handleChange}
                  placeholder="https://example.com/download"
                  className="cyber-input"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">
                      Platform (Hold Ctrl/Cmd for multiple)
                    </Form.Label>
                    <Form.Select
                      multiple
                      name="platform"
                      value={formData.platform}
                      onChange={handlePlatformChange}
                      className="cyber-input"
                      style={{ height: "120px" }}
                    >
                      {platforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="cyber-label">Rating (0-5)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="cyber-input"
                      placeholder="0.0"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="cyber-modal-footer">
              <Button 
                variant="secondary" 
                onClick={handleCloseModal}
                className="cyber-btn-secondary"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="cyber-btn-primary"
              >
                {editingGame ? "Update Game" : "Create Game"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default ManageGames;