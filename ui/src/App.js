import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from './layouts/Component/layout';
import AdminLayout from './layouts/admin/layout';
import { useScrollRestoration } from './layouts/Component/CustomHook/useScrollRestoration';

// User pages
import Home from "./pages/Home";
import Login from "./pages/login/login";
import SignUp from './pages/signUp/SignUp';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/resetPassword';
import About from './pages/About';
import SpaCombo from "./layouts/Component/spacombo";
import SpaComboDetail from './layouts/Component/spaComboDetail';
import BookingComponent from './layouts/Component/Booking/bookingcomponent';
import BookingSuccess from './layouts/Component/Booking/bookingsuccess';
import UserProfile from './pages/UserProfile';
import ShineHistory from './pages/ShineHistory';
import ChangePassword from './pages/ChangePassword';
import AllServices from './layouts/Component/services/allservices';
import ServiceDetail from './layouts/Component/services/ServiceDetails';


// Admin pages
import AdminProfile from './pages/admin/profile/profile';
import Staff from './pages/admin/staff/staff';
import HistoryBooking from './pages/admin/booking/booking';
import AdminChangePassword from './pages/admin/profile/changePassword';
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
import AllCombos from './layouts/Component/Combo/allcombos';

import Slot from './pages/admin/slot/slot';
import AddSlot from './pages/admin/slot/addSlot';
import UpdateSlot from './pages/admin/slot/updateSlot';

import ComboDetail from './layouts/Component/Combo/ComboDetail';



const ScrollRestorationProvider = ({ children }) => {
  useScrollRestoration();
  return children;
};

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ScrollRestorationProvider>
        <Layout>
          <ScrollToTop />
          <Outlet />
        </Layout>
      </ScrollRestorationProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      // Thêm route mới để xử lý token từ email
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "about", element: <About /> },
      { path: "dich-vu-goi-massage-spa-relax", element: <SpaCombo /> },
      { path: "dich-vu/spa/:comboId", element: <SpaComboDetail /> },
      { path: "booking", element: <BookingComponent /> },
      { path: "booking/success", element: <BookingSuccess /> },
      { path: "userprofile", element: <UserProfile /> },
      { path: "shine-history", element: <ShineHistory /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "tat-ca-dich-vu", element: <AllServices /> },
      { path: "tat-ca-combo", element: <AllCombos /> },
      { path: "dich-vu/:serviceId", element: <ServiceDetail /> },
      { path: "combo/:comboId", element: <ComboDetail /> }

    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "adminprofile", element: <AdminProfile /> },
      { path: "staff", element: <Staff /> },
      { path: "staff/addStaff", element: <AddStaff /> },
      { path: "staff/updateStaff/:id", element: <UpdateStaff /> },
      { path: "historybooking", element: <HistoryBooking /> },
      { path: "slot", element: <Slot /> },
      { path: "slot/addSlot", element: <AddSlot /> },
      { path: "changePassword", element: <AdminChangePassword /> },
      { path: "adminprofile/editProfile", element: <EditProfile /> },
      { path: "service", element: <Service /> },
      { path: "service/addService", element: <AddService /> },
      { path: "service/updateService/:id", element: <UpdateService /> },
      { path: "category", element: <Category /> },
      { path: "category/addCategory/createCategory", element: <CreateCategory /> },
      { path: "category/updateCategory/:categoryId", element: <UpdateCategory /> },
      { path: "combo", element: <Combo /> },
      { path: "combo/addCombo", element: <AddCombo /> },
      { path: "combo/updateCombo", element: <UpdateCombo /> },
      { path: "slot", element: <Slot /> },
      { path: "slot/addSlot", element: <AddSlot /> },
      { path: "slot/updateSlot/", element: <UpdateSlot /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
