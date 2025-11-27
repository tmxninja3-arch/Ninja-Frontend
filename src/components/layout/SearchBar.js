import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, ListGroup, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.get('/games');
        
        // Filter games based on search term
        const filtered = data.data.filter((game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Save to recent searches
      saveRecentSearch(searchTerm);
      
      // Navigate to home with search query
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      
      // Close dropdown
      setShowDropdown(false);
      
      // Clear search on mobile
      if (window.innerWidth < 768) {
        setSearchTerm('');
      }
    }
  };

  // Save recent search
  const saveRecentSearch = (term) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle suggestion click
  const handleSuggestionClick = (game) => {
    saveRecentSearch(game.title);
    navigate(`/game/${game._id}`);
    setShowDropdown(false);
    setSearchTerm('');
  };

  // Handle recent search click
  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    navigate(`/?search=${encodeURIComponent(term)}`);
    setShowDropdown(false);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="navbar-search-container" ref={searchRef}>
      <Form onSubmit={handleSearch} className="navbar-search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <Form.Control
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="navbar-search-input"
            autoComplete="off"
          />
          
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
              }}
            >
              ✕
            </button>
          )}

          {loading && (
            <Spinner
              animation="border"
              size="sm"
              className="search-spinner"
            />
          )}
        </div>
      </Form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="search-dropdown">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Games</div>
              <ListGroup variant="flush">
                {suggestions.map((game, index) => (
                  <ListGroup.Item
                    key={game._id}
                    className={`search-suggestion-item ${
                      index === selectedIndex ? 'active' : ''
                    }`}
                    onClick={() => handleSuggestionClick(game)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="suggestion-content">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="suggestion-image"
                      />
                      <div className="suggestion-details">
                        <div className="suggestion-title">{game.title}</div>
                        <div className="suggestion-meta">
                          <span className="suggestion-genre">{game.genre}</span>
                          <span className="suggestion-price">
                            ${game.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {/* Recent Searches */}
          {searchTerm.length === 0 && recentSearches.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">
                <div className="search-section-title">Recent Searches</div>
                <button
                  className="clear-recent-btn"
                  onClick={clearRecentSearches}
                >
                  Clear
                </button>
              </div>
              <ListGroup variant="flush">
                {recentSearches.map((term, index) => (
                  <ListGroup.Item
                    key={index}
                    className="search-recent-item"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <span className="recent-icon">🕐</span>
                    {term}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {/* No results */}
          {searchTerm.length >= 2 &&
            suggestions.length === 0 &&
            !loading && (
              <div className="search-no-results">
                <div className="no-results-icon">😔</div>
                <div className="no-results-text">No games found</div>
                <div className="no-results-hint">
                  Try searching for something else
                </div>
              </div>
            )}

          {/* Search tips */}
          {searchTerm.length === 0 && recentSearches.length === 0 && (
            <div className="search-tips">
              <div className="search-tip-icon">💡</div>
              <div className="search-tip-text">
                Try searching for "GTA", "FIFA", or any game genre
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;