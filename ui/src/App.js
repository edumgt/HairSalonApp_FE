import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../src/layouts/Component/layout";
import Home from "../src/pages/Home";
import Login from '../src/pages/login';
import About from '../src/pages/About';

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
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
