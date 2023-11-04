import React, { useState, useEffect } from 'react';
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

function RegistrationPage() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = React.useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/Account/Register', {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: password,
      });

      setResponseMessage(response.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <Container>
      <Row className="justify-content-center rounded-4 custom-shadow overflow-hidden">
        <Col lg="12">
          <Row className="primary_color">
            <Col lg="7" className="secondary_color diagonal-bg d-flex">
              <Image
                src="/assets/img/register.svg"
                className="img-fluid p-4 pb-0"
              />
            </Col>
            <Col
              lg="5"
              className="px-4 px-xl-5 d-flex flex-column justify-content-evenly"
            >
              <h1 className="mb-3 text-white">Registration</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <Row>
                <Col className="d-flex justify-content-between text-white">
                  <Button variant="light" onClick={handleSubmit}>
                    Submit
                  </Button>
                  <p className="m-0 align-self-end">
                    Already Registered?
                    <AlertLink href="./login" className="ms-2">
                      Log In
                    </AlertLink>
                  </p>
                </Col>
              </Row>
              {/*
              <p className="mt-4">
                Response Message: {JSON.stringify(responseMessage)}
              </p> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistrationPage;
