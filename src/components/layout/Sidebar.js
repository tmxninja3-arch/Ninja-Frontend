import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaGamepad,
  FaShoppingBag,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // ✅ CLOSED BY DEFAULT
  const [isOpen, setIsOpen] = useState(false); // Sidebar closed by default
  const [isCollapsed, setIsCollapsed] = useState(true); // Desktop collapsed state

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Toggle collapsed/expanded (desktop only)
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Close sidebar (mobile)
  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Admin Menu Items
  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      title: "Manage Games",
      icon: <FaGamepad />,
      path: "/admin/games",
    },
    {
      title: "Manage Orders",
      icon: <FaShoppingBag />,
      path: "/admin/orders",
    },
  ];

  // User Menu Items
  const userMenuItems = [
    {
      title: "My Profile",
      icon: <FaUser />,
      path: "/profile",
    },
    {
      title: "Shopping Cart",
      icon: <FaShoppingCart />,
      path: "/cart",
    },
    {
      title: "My Orders",
      icon: <FaShoppingBag />,
      path: "/my-orders",
    },
  ];

  const menuItems = isAdmin() ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <button
        className="sidebar-toggle-button"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside
        className={`cyber-sidebar ${isOpen ? "open" : ""} ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FaGamepad className="brand-icon" />
            {!isCollapsed && (
              <span className="brand-text">
                {isAdmin() ? "Admin Panel" : "User Panel"}
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            className="sidebar-collapse-toggle desktop-only"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>

          {/* Mobile Close */}
          <button
            className="sidebar-close-toggle mobile-only"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="sidebar-user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h4>{user?.name}</h4>
              <p>{user?.email}</p>
              <span className={`user-role ${isAdmin() ? "admin" : "user"}`}>
                {isAdmin() ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={closeSidebar}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="nav-text">{item.title}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">
              <FaSignOutAlt />
            </span>
            {!isCollapsed && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;