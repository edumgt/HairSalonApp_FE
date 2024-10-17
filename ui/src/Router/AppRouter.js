import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HairCutServices from '../layouts/Component/haircombo';
import ServiceDetail from '../../src/layouts/Component/servicedetail';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/dich-vu-cat-toc" element={<HairCutServices />} />
        <Route path="/dich-vu/:serviceId" element={<ServiceDetail />} />
        {/* Các route khác */}
      </Routes>
    </Router>
  );
}
export default AppRoutes;