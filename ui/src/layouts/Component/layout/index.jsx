import React from 'react';
import Header from "../header";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import './index.scss'; 
import { useScrollRestoration } from '../CustomHook/useScrollRestoration';
function Layout() {
  useScrollRestoration();
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;