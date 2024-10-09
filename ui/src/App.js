import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignUp from './pages/signUp/SignUp';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/resetPassword';

import React from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../src/layouts/Component/layout";
import Home from "../src/pages/Home";
import Login from "./pages/login/Login";
import About from '../src/pages/About';
import ScrollToTopButton from '../src/layouts/Component/scrollButton';
import HairCutServices from "./layouts/Component/haircombo";
import ServiceDetail from "./layouts/Component/servicedetail";
import CurlyHairServices from "./layouts/Component/curlyhairservice";  
import HairStylingDetail from "./layouts/Component/hairstylingdetail";
import SpaServices from "./layouts/Component/spaservice";
import SpaCombo from "./layouts/Component/spacombo";
import SpaComboDetail from './layouts/Component/spaComboDetail';
import BookingComponent from './layouts/Component/Booking/bookingcomponent';

// ... phần còn lại của code ...
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
      <ScrollToTopButton />
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
        { path: "register", element: <SignUp /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "/home", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/dich-vu-cat-toc", element: <HairCutServices /> },
        { path: "/dich-vu-uon-nhuom-toc", element: <CurlyHairServices /> },
        { path: "/dich-vu/cat-goi/:serviceId", element: <ServiceDetail /> },
        { path: "/dich-vu/uon/:serviceId", element: <HairStylingDetail /> },
        { path: "/dich-vu/nhuom/:serviceId", element: <HairStylingDetail /> },
        { path: "/dich-vu-goi-massage-spa-relax", element: <SpaCombo  /> },
        { path: "/dich-vu/spa/:comboId", element: <SpaComboDetail /> },
        { path: "booking", element: <BookingComponent /> },
        { path: "reset-password", element: <ResetPassword /> },
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