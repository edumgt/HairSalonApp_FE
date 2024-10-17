import React from 'react';
import Header from "../header";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import ScrollToTop from '../scrollButton';
import './index.scss'; // Tạo file CSS mới cho layout

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Layout;