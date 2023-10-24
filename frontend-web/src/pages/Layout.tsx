import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Layout() {
  return (
    <>
      <Navbar />

      {/* Page content */}
      <Outlet />
    </>
  );
}

export default Layout;
