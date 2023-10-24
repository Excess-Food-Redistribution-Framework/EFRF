import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

function RegistrationPage() {
  const navigate = useNavigate();
  const {isAuth} = useAuth();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [responseMessage, setResponseMessage] = React.useState({});

  const handleSubmit = async () => {
    try {
      const response = await axios.post('api/Account/Register', {
        userName: username,
        email,
        password,
      });

      setResponseMessage(response.data);

    } catch (error) {
      console.error(error);
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
              <h1 className="mb-3 text-center">Registration</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
          <p className="mt-4">Response Message: {JSON.stringify(responseMessage)}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationPage;
