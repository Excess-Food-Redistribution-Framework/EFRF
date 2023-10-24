import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
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
        <Col lg="6">
          <h1 className="mb-3 text-center">Login</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
