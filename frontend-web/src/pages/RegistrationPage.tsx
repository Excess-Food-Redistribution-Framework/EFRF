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
  const [error, setError] = React.useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = () => {
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    if(firstName === ''){
      setFirstNameError('First Name is required');
      isValid = false;
    }else{
      setFirstNameError('');
    }
    if(lastName === ''){
      setLastNameError('Last Name is required');
      isValid = false;
    }else{
      setLastNameError('');
    }
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
      const response = await axios.post('api/Account/Register', {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: password,
      });

      setResponseMessage(response.data);
      navigate('/login');
    } catch (error : any) {
      console.error(error);
      setError('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <Container className="pt-5">
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
              <Row>
              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}
              </Row>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      handleInputChange();
                      setFirstNameError('');
                    }}
                    isInvalid={firstNameError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{firstNameError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => {setLastName(e.target.value);
                      handleInputChange();
                      setLastNameError('');
                    }}
                    isInvalid={lastNameError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{lastNameError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value)
                      handleInputChange();
                      setEmailError('');
                    }}
                    isInvalid={emailError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value);
                      handleInputChange();
                      setPasswordError('');
                    }}
                    isInvalid={passwordError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Form>
              <p className="text-white mt-3">
                    Already Registered?{' '}
                    <a className="text-light" href="/login">
                     Log In
                    </a>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
      </Container>
  );
}

export default RegistrationPage;
