import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertLink, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';

function RegistrationPage() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

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
            <Col lg="6" className="secondary_color diagonal-bg">
              {/* <Image src="../assets/img/login.svg" /> */}
            </Col>
            <Col lg="6" className="p-5">
              <h1 className="mb-3 text-white">Registration</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
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

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleSubmit}>
                      Submit
                    </Button>
                    <p>
                      Already Registered?
                      <AlertLink href="./login" className="ms-2">
                        Log In
                      </AlertLink>
                    </p>
                  </Col>
                </Row>
              </Form>
              <p className="mt-4">
                Response Message: {JSON.stringify(responseMessage)}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationPage;
