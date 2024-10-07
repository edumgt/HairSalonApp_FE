import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/admin/layout'; 
import Profile from './pages/admin/profile/profile';
import Salon from './pages/admin/salon/salon';
import Staff from './pages/admin/staff/staff';
import Wage from './pages/admin/wage/wage';
import Booking from './pages/admin/booking/booking';
import ChangePassword from './pages/admin/profile/changePassword';
import EditProfile from './pages/admin/profile/editProfile';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route path="/admin"> */}
          {/* Các route con sẽ được render trong Outlet của Layout */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="profile" element={<Profile />} />
          
          <Route path="salon" element={<Salon />} />
          <Route path="staff" element={<Staff />} />
          <Route path="wage" element={<Wage />} />
          <Route path="booking" element={<Booking />} />
        {/* </Route> */}
        </Route>
        <Route path="changePassword" element={<ChangePassword />} />
        <Route path="editProfile" element={<EditProfile />} />
      </Routes>
  </Router>
  )
}

export default App
