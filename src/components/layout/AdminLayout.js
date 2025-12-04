import Sidebar from "./Sidebar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-main-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; // ← MAKE SURE THIS IS HERE