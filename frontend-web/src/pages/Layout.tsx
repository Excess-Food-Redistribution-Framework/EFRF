import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from "../components/Footer.tsx";

function Layout() {
  return (
    <>
      <Navbar />

      {/* Page content */}
      <Outlet />

       {/*<Footer />*/}
    </>
  );
}

export default Layout;
