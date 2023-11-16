import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
} from 'react-bootstrap';
import { useAuth } from '../AuthProvider';
import '../styles/custom.styles.css';
import {LoginRequest} from '../types/userTypes.ts';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { setToken, setUser, user, isAuth } = useAuth();
  const [error, setError] = useState<string>(''); 
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleSubmit = async () => {
    let isValid = true;
  
    if (email === '') {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    if (password === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }
  
    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post('api/Account/Login', {
        email,
        password,
      } as LoginRequest);

      setToken(response.data.token);
      setUser(response.data.user);

      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Request failed with status code 400') {
          setError('Incorrect email or password. Please try again.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    }
  };

  const handleInputChange = () => {
    setError('');
  };

  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  }, [user]);

  return (
    <Container className="pt-5">
      <Row className="justify-content-center rounded-4 custom-shadow overflow-hidden">
        <Col lg="12">
          <Row className="secondary_color">
            <Col lg="7" className=" diagonal-bg-login d-flex">
              <Image src="/assets/img/login.svg" className="img-fluid p-4 pb-0" />
            </Col>
            <Col lg="5" className="px-4 px-xl-5 d-flex flex-column justify-content-evenly secondary_color">
              <h1 className="mb-3 text-white">Login</h1>
              <Row>
              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}
              </Row>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label style={{ color: "white" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleInputChange();
                      setEmailError('');
                    }}
                    isInvalid={emailError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label style={{ color: "white" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleInputChange();
                      setPasswordError('');
                    }}
                    isInvalid={passwordError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" onClick={handleSubmit} className="mt-2">
                  Log In
                </Button>
              </Form>
              <p className="text-white mt-3">
                Don't have an account?{' '}
                <a className="text-light" href="/registration">
                  Register here
                </a>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
