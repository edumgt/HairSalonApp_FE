import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/admin/layout'; 
import Profile from './pages/admin/profile/profile';
import Staff from './pages/admin/staff/staff';
import Wage from './pages/admin/wage/wage';
import Booking from './pages/admin/booking/booking';
import ChangePassword from './pages/admin/profile/changePassword';
import EditProfile from './pages/admin/profile/editProfile';
import Service from './pages/admin/service/service';
import Category from './pages/admin/category/category';
import AddStaff from './pages/admin/staff/addStaff';
import ImportWage from './pages/admin/wage/importWage';
import AddService from './pages/admin/service/Create/addService';
import UpdateService from './pages/admin/service/Update/updateService';
import AddCategory from './pages/admin/category/addCategory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            {/* Các route con sẽ được render trong Outlet của Layout */}
            <Route path="profile" element={<Profile />} />
            <Route path="staff" element={<Staff />} >
              <Route path='addStaff' element={<AddStaff/>} />
            </Route>
            <Route path="wage" element={<Wage />} >
              <Route path="importWage" element={<ImportWage />}/>
            </Route>
            <Route path="booking" element={<Booking />} />
            <Route path="service" element={<Service />} />
            <Route path="service/addService" element={<AddService />} />
            <Route path="service/updateService/:id" element={<UpdateService />} />
            <Route path="category" element={<Category />}>
              <Route path="addCategory" element={<AddCategory />}/>
            </Route>
          </Route>
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="editProfile" element={<EditProfile />} />
      </Routes>
    </Router>
  )
}

export default App
