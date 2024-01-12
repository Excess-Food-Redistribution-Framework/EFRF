import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Layout() {
  return (
    <Container
      fluid
      className="px-0"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />

      {/* Page content */}
      <Outlet />

      <Footer />
    </Container>
  );
}

export default Layout;
