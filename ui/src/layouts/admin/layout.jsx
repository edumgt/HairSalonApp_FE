import { Outlet } from 'react-router-dom';
import Sidebar from "./sidebar"
import './layout.css'
const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main">
        <Outlet /> {/* Đây là nơi các trang con sẽ được render */}
      </div>
    </div>
  );
};

export default Layout;
