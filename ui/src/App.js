
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/admin/layout'; 
import Profile from './pages/admin/profile/profile';
import Staff from './pages/admin/staff/staff';
import Booking from './pages/admin/booking/booking';
import ChangePassword from './pages/admin/profile/changePassword';
import EditProfile from './pages/admin/profile/editProfile';
import Service from './pages/admin/service/service';
import Category from './pages/admin/category/category';
import AddStaff from './pages/admin/staff/add/addStaff';
import AddService from './pages/admin/service/Create/addService';
import UpdateService from './pages/admin/service/Update/updateService';
import CreateCategory from './pages/admin/category/addCategory/createCategory';
import UpdateCategory from './pages/admin/category/updateCategory/updateCategory';
import UpdateStaff from './pages/admin/staff/update/updateStaff';
import Combo from './pages/admin/combo/combo';
import AddCombo from './pages/admin/combo/addCombo';
import UpdateCombo from './pages/admin/combo/updateCombo';
//////////////////////////////////////////////////////////////////////////////
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import SignUp from './pages/signUp/SignUp';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/resetPassword';


import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
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
import BookingSuccess from './layouts/Component/Booking/bookingsuccess';
import UserProfile from './pages/UserProfile';
import ShineHistory from './pages/ShineHistory';
import ChangePassword from './pages/ChangePassword';
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
///////////////////////////////////////////////////
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
        { path: "user-profile", element: <UserProfile /> },
        { path: "/profile", element: <UserProfile /> },
        { path: "/shine-history", element: <ShineHistory /> },
        { path: "/change-password", element: <ChangePassword /> },
        // Thêm route mới để xử lý token từ email
        { path: "reset-password/:token", element: <ResetPassword /> },
        { path: "booking/success", element: <BookingSuccess /> },
      ],
    },
  ]);


  return (
/////////////// phatdt
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            {/* Các route con sẽ được render trong Outlet của Layout */}
            <Route path="profile" element={<Profile />} />
            <Route path="staff" element={<Staff />}>
              <Route path='addStaff' element={<AddStaff onStaffAdded={() => {
                // Tìm component Staff gần nhất và gọi fetchStaff
                const staffComponent = document.querySelector('[data-testid="staff-component"]');
                if (staffComponent && staffComponent.__reactFiber$) {
                  const staffInstance = staffComponent.__reactFiber$.return.stateNode;
                  if (staffInstance && staffInstance.fetchStaff) {
                    staffInstance.fetchStaff();
                  }
                }
              }} />} />
              <Route path='updateStaff/:id' element={<UpdateStaff />} />
            </Route>
            <Route path="combo" element={<Combo />} >
                <Route path="addCombo" element={<AddCombo />}/>
                <Route path="updateCombo" element={<UpdateCombo />}/>
              </Route>
            <Route path="booking" element={<Booking />} />
            <Route path="service" element={<Service />} />
            <Route path="service/addService" element={<AddService />} />
            <Route path="service/updateService/:id" element={<UpdateService />} />
            <Route path="category" element={<Category />} />
            <Route path="category/addCategory/createCategory" element={<CreateCategory />} />
            <Route path="category/updateCategory/:categoryId" element={<UpdateCategory />} />
          </Route>
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="editProfile" element={<EditProfile />} />
      </Routes>
    </Router>
  )
}

export default App
/////////////////////////////////////////////////////////////////// dat
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;

