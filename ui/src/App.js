import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/admin/layout'; 
import Profile from './pages/admin/profile/profile';
import Salon from './pages/admin/salon/salon';
import Staff from './pages/admin/staff/staff';
// import Wage from './Pages/Wage/Wage';
// import Booking from './Pages/Booking/Booking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Các route con sẽ được render trong Outlet của Layout */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="profile" element={<Profile />} />
          <Route path="salon" element={<Salon />} />
          <Route path="staff" element={<Staff />} />
          {/* <Route path="wage" element={<Wage />} />
          <Route path="booking" element={<Booking />} /> */}
        </Route>
      </Routes>
  </Router>
  )
}

export default App
