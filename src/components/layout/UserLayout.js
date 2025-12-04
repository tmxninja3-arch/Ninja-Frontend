import Sidebar from "./Sidebar";
import "./UserLayout.css";

const UserLayout = ({ children, showSidebar = true }) => {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="user-layout-wrapper">
      <Sidebar />
      <div className="user-main-content">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;