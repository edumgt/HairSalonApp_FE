import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/admin/layout'; 
import Profile from './pages/Admin/profile/profile'
// import Salon from './Pages/Salon/Salon'; 
// import Staff from './Pages/Staff/Staff';
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
          {/* <Route path="salon" element={<Salon />} />
          <Route path="staff" element={<Staff />} />
          <Route path="wage" element={<Wage />} />
          <Route path="booking" element={<Booking />} /> */}
        </Route>
      </Routes>
  </Router>
  )
}

export default App
