import { Container, Nav, Navbar as NavbarBootstrap } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import {useEffect} from 'react';

function Navbar() {
  const { setToken, isAuth, user } = useAuth();

  useEffect(() => {
  }, [user]);

  const logout = () => {
    setToken('');
  };

  return (
    <NavbarBootstrap className="bg-white shadow-sm sticky-top">
      <Container>
        <Nav>
          <Nav.Link to="/" as={NavLink}>
            LOGO
          </Nav.Link>
          <Nav.Link to="/" as={NavLink}>
            Home
          </Nav.Link>
          <Nav.Link to="/blog" as={NavLink}>
            Blog
          </Nav.Link>
        </Nav>
        <Nav>
          {isAuth() ? (
            <>
              {!user?.role ? (
                <Nav.Link to="/organization/create" as={NavLink}>
                  Create organization
                </Nav.Link>
              ) : (
                <Nav.Link to="/organizations" as={NavLink}>
                  Organization
                </Nav.Link>
              )
              }
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
      </Container>
    </NavbarBootstrap>
  );
}

export default Navbar;
