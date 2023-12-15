import {Container, Image, Nav, Navbar as NavbarBootstrap} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuth } from '../AuthProvider';

function Navbar() {
  const { setToken, isAuth, user, setUser, userRole, setUserRole } = useAuth();

  useEffect(() => {}, [user]);

  const logout = async () => {
    setToken('');
    setUserRole(null);
    
    try {
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  return (
    <NavbarBootstrap collapseOnSelect expand="md" className="bg-white shadow-sm sticky-top">
      <Container>
          <NavbarBootstrap.Brand to="/" as={NavLink} className="p-0">
              <Image src="/assets/img/logo.svg" />
          </NavbarBootstrap.Brand>
          <NavbarBootstrap.Toggle aria-controls="main-navbar-nav" />
          <NavbarBootstrap.Collapse id="main-navbar-nav" className="justify-content-between">
            <Nav>
              <Nav.Link to="/" as={NavLink}>
                Home
              </Nav.Link>
              <Nav.Link to="/products" as={NavLink}>
                Products
              </Nav.Link>
              <Nav.Link to="/blog" as={NavLink}>
                Blog
              </Nav.Link>
              {isAuth() && userRole === 'Provider' && (
                <Nav.Link to="/organizationProducts" as={NavLink}>
                  Organization products
                </Nav.Link>
              )}
              {isAuth() && userRole === 'Distributor' && (
                <Nav.Link to="/organizationFoodRequests" as={NavLink}>
                Food request
              </Nav.Link> 
              )}
            </Nav>
            <Nav>
              {isAuth() ? (
                <>
                  {userRole === 'Provider' && (
                    <Nav.Link to="/product/create" as={NavLink}>
                      Create product
                    </Nav.Link>
                  )}
                  <Nav.Link to="/profile" as={NavLink}>
                    Profile
                  </Nav.Link>
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link to="/login" as={NavLink}>
                    Login
                  </Nav.Link>
                  <Nav.Link to="/registration" as={NavLink}>
                    Registration
                  </Nav.Link>
                </>
              )}
            </Nav>
          </NavbarBootstrap.Collapse>
      </Container>
    </NavbarBootstrap>
  );
}

export default Navbar;
