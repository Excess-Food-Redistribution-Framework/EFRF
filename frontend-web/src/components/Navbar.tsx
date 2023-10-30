import { Container, Nav, Navbar as NavbarBootstrap } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

function Navbar() {
  const { setToken, isAuth } = useAuth();

  const logout = () => {
    setToken('');
  };

  return (
    <NavbarBootstrap className="bg-white shadow-sm mb-5 sticky-top">
      <Container>
        <Nav>
          <Nav.Link to="/" as={NavLink}>
            LOGO
          </Nav.Link>
          <Nav.Link to="/" as={NavLink}>
            Home
          </Nav.Link>
        </Nav>
        <Nav>
          {isAuth() ? (
            <>
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
