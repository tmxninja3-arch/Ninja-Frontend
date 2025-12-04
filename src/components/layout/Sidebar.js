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

  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile open/close

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
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
      
      {/* Mobile Toggle Button (show only when sidebar is closed) */}
      {!isMobileOpen && (
        <button
          className="mobile-sidebar-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Open sidebar"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`cyber-sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
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

          {/* Desktop Toggle */}
          <button
            className="sidebar-toggle desktop-only"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>

          {/* Mobile Close */}
          <button
            className="sidebar-toggle mobile-only"
            onClick={toggleMobileSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Info (hidden in collapsed desktop) */}
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
                  onClick={() => setIsMobileOpen(false)} // close on mobile after click
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
