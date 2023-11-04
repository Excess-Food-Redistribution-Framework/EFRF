import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  AlertLink,
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
} from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

interface ILoginRequest {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { setToken, setUser, user, isAuth } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('api/Account/Login', {
        email,
        password,
      } as ILoginRequest);

      setToken(response.data.token);
      setUser(response.data.user);

      if (response.data.user.role) {
        navigate('/');
      } else {
        navigate('/organization/create');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  }, [user]);

  return (
    <Container>
      <Row className="justify-content-center rounded-4 overflow-hidden custom-shadow">
        <Col lg="12">
          <Row className="primary_color">
            <Col lg="7" className="secondary_color diagonal-bg d-flex">
              <Image
                src="/assets/img/login.svg"
                className="img-fluid p-4 pb-0"
              />
            </Col>
            <Col
              lg="5"
              className="px-4 px-xl-5 d-flex flex-column justify-content-evenly"
            >
              <h1 className="mb-3 text-white">Log in</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <Row>
                <Col className="d-flex justify-content-between">
                  <Button variant="light" onClick={handleSubmit}>
                    Submit
                  </Button>
                  <AlertLink
                    href="/registration"
                    className="align-self-end text-white"
                  >
                    Cant Log In?
                  </AlertLink>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
