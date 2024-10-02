import React from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../src/layouts/Component/layout";
import Home from "../src/pages/Home";
import Login from '../src/pages/login';
import About from '../src/pages/About';

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Wrapper component to include ScrollToTop
function LayoutWithScrollToTop() {
  return (
    <>
      <ScrollToTop />
      <Layout />
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <LayoutWithScrollToTop />,
      children: [
        { path: "", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/home", element: <Home /> },
        { path: "/about", element: <About /> },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;