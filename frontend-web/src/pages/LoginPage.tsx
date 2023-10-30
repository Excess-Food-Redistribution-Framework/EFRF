import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertLink, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

interface ILoginRequest {
  userName: string;
  password: string;
}

interface ILoginResponse {
  token: string;
}

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { setToken, isAuth } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post<ILoginResponse>('api/Account/Login', {
        userName: username,
        password,
      } as ILoginRequest);

      setToken(response.data.token);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  });

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="10">
          <Row className="primary_color">
            <Col lg="7" className="secondary_color diagonal-bg">
              {/* <Image src="../assets/img/login.svg" /> */}
            </Col>
            <Col lg="5" className="p-5">
              <h1 className="mb-3 text-white">Log in</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleSubmit}>
                      Submit
                    </Button>
                    <AlertLink href="" className="align-self-end text-white">
                      Cant Log In?
                    </AlertLink>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
