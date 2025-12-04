import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { useAuth } from '../../utils/hooks';
import { useCart } from '../../utils/hooks';
import SearchBar from './SearchBar';
import './NavbarCyber.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="cyber-navbar-wrapper">
      <div className="cyber-border-animation"></div>
      <BSNavbar expand="lg" className="cyber-navbar">
        <Container>
          <BSNavbar.Brand as={Link} to="/" className="cyber-brand">
            <div className="brand-glow">
              <span className="brand-icon">⚡</span>
              <div className="brand-text-stack">
                <span className="brand-main">GAMING</span>
                <span className="brand-sub">NINJA</span>
              </div>
            </div>
          </BSNavbar.Brand>

          <BSNavbar.Toggle aria-controls="cyber-nav" className="cyber-toggler">
            <span></span>
            <span></span>
            <span></span>
          </BSNavbar.Toggle>

          <BSNavbar.Collapse id="cyber-nav">
            <div className="cyber-search mx-lg-4">
              <SearchBar />
            </div>

            <Nav className="ms-auto align-items-lg-center gap-3">
              <Nav.Link as={Link} to="/" className="cyber-link">
                <span className="link-bg"></span>
                <span className="link-content">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
                  </svg>
                  Home
                </span>
              </Nav.Link>

              {user ? (
                <>
                  <Nav.Link as={Link} to="/cart" className="cyber-link cart-link">
                    <span className="link-bg"></span>
                    <span className="link-content">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                      </svg>
                      Cart
                      {getCartCount() > 0 && (
                        <span className="cyber-badge">{getCartCount()}</span>
                      )}
                    </span>
                  </Nav.Link>

                  <Nav.Link as={Link} to="/my-orders" className="cyber-link">
                    <span className="link-bg"></span>
                    <span className="link-content">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                      </svg>
                      Orders
                    </span>
                  </Nav.Link>

                  {user.role === 'admin' && (
                    <Nav.Link as={Link} to="/admin/dashboard" className="cyber-link admin-link">
                      <span className="link-bg"></span>
                      <span className="link-content">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
                        </svg>
                        Admin
                      </span>
                    </Nav.Link>
                  )}

                  <div className="cyber-user-menu">
                    <button className="cyber-user-btn">
                      <span className="user-avatar-ring">
                        <span className="user-avatar-inner">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </span>
                      <span className="user-name">{user.name}</span>
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </button>
                    <div className="cyber-dropdown">
                      <Link to="/profile" className="cyber-dropdown-item">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                        </svg>
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="cyber-dropdown-item logout">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                          <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="cyber-link">
                    <span className="link-bg"></span>
                    <span className="link-content">Login</span>
                  </Nav.Link>
                  <Link to="/register" className="cyber-btn-primary">
                    <span className="btn-bg"></span>
                    <span className="btn-content">Sign Up</span>
                  </Link>
                </>
              )}
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </div>
  );
};

export default Navbar;