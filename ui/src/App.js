import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Component/layout";
import Home from "./page/home";
import Login from "./page/login";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/home", element: <Home /> },
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
