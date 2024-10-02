import Header from "../header";
import { Outlet } from "react-router-dom";
import Footer from "../footer";
import ScrollToTop from '../scrollButton';

function Layout() {
  return (
    <>
      <Header />

      <Outlet />

      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Layout;
