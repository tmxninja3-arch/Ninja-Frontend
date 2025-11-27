import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../utils/hooks';
import { useCart } from '../../utils/hooks';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container >
        <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          🎮 GAMING NINJA  
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">

            {/* Search Bar*/}
          <div className="mx-auto" style={{ maxWidth: '500px', width: '100%' }}>
            <SearchBar />
          </div>


          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">
              Home  
            </Nav.Link>
            |

            {user ? (
              <>
                <Nav.Link as={Link} to="/cart" className="position-relative">
                  🛒Cart  
                  {getCartCount() > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle mt-1"
                    >
                      {getCartCount()}
                    </Badge>
                  )}
                </Nav.Link>
                |

                <Nav.Link as={Link} to="/my-orders">
                  My Orders  
                </Nav.Link>
|
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin/dashboard">
                    Admin Panel  
                  </Nav.Link>
                )}

                <NavDropdown
                  title={`👤 ${user.name}`}
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <button className="btn btn-primary btn-sm">Sign Up</button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;