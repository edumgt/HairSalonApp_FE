import React from 'react';
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
import AddStaff from './pages/admin/staff/add/addStaff';
import ImportWage from './pages/admin/wage/importWage';
import AddService from './pages/admin/service/Create/addService';
import UpdateService from './pages/admin/service/Update/updateService';
import CreateCategory from './pages/admin/category/addCategory/createCategory';
import UpdateCategory from './pages/admin/category/updateCategory/updateCategory';
import UpdateStaff from './pages/admin/staff/update/updateStaff';

function App() {
  return (
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
            <Route path="wage" element={<Wage />} >
              <Route path="importWage" element={<ImportWage />}/>
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
