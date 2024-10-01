import Header from "../header";
import { Outlet } from "react-router-dom";
import Footer from "../footer";

function Layout() {
  return (
    <>
      <Header />

      <Outlet />

      <Footer />
    </>
  );
}

export default Layout;
