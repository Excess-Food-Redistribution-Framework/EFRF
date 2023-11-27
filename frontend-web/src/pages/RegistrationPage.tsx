import React, { useState, useEffect } from 'react';
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
import geocodeAddress from '../utils/geocodeUtils.tsx';

function RegistrationPage() {
  const navigate = useNavigate();
  const { isAuth, setToken, setUser, setUserRole } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [organizationName, setOrganizationName] = React.useState('');
  const [organizationType, setOrganizationType] = React.useState('');

  const [state, setState] = React.useState('Slovakia');
  const [city, setCity] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');

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
    
    const fullAddress = `${street} ${number}, ${city}, ${state}, ${zipCode}`;

    try {
      if (window.google && window.google.maps) {
        const result = await geocodeAddress(fullAddress);
        console.log(result);
  
      if (result?.geometry?.location) {
        const latLng = result.geometry.location;
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(latLng);
  
        const response = await axios.post('api/Account/Register', {
          firstName,
          lastName,
          email,
          password,
          organization: {
            name: organizationName,
            type: organizationType,
            information: `${firstName} ${lastName}'s organization.`,
            address: {
              state,
              city,
              street,
              number,
              zipCode,
            },
            location: {
              longitude: latLng.lng(),
              latitude: latLng.lat()
            },
          },
        });
        setToken(response.data.token);
        setUser(response.data.user);
        setUserRole(response.data.user.organization.type);
  
        navigate('/');
      }
    }
    } catch (error : any) {
      console.error(error);
  
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
  
      setError('Registration failed. Please try again.');
      
    }
  };

  useEffect(() => {
    if (isAuth()) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <Container className="pt-4">
      <Row className="m-1 justify-content-center rounded-4 custom-shadow overflow-hidden">
        <Col lg="12">
          <Row className="secondary_color">
            <Col lg="7" className=" diagonal-bg-login d-flex">
              <Image
                src="/assets/img/register.svg"
                className="img-fluid p-4 pb-0"
              />
            </Col>
            <Col
              lg="5"
              className="px-4 px-xl-5 pt-3 d-flex flex-column justify-content-evenly secondary_color"
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

                <Row>
                  <Col md="6">
                    <Form.Group controlId="formFirstName" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>First Name</Form.Label>
                      <Form.Control
                        type="text"
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
                  </Col>

                  <Col md="6">
                    <Form.Group controlId="formLastName" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          handleInputChange();
                          setLastNameError('');
                        }}
                        isInvalid={lastNameError !== ''}
                      />
                      <Form.Control.Feedback type="invalid">{lastNameError}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      handleInputChange();
                      setEmailError('');
                    }}
                    isInvalid={emailError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Password</Form.Label>
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

                <Row>
                  <Col md>
                    <Form.Group controlId="formOrganizationName" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Organization Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={organizationName}
                        onChange={(e) => {
                          setOrganizationName(e.target.value);
                          handleInputChange();
                        }}
                        isInvalid={passwordError !== ''}
                      />
                      <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                    </Form.Group>

                  </Col>

                  <Col md="4">
                    <Form.Group controlId="formType" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Type</Form.Label>
                      <Form.Select
                        aria-label="Type"
                        value={organizationType}
                        onChange={(e) => {
                          setOrganizationType(e.target.value);
                        }}
                        style={{
                          color: organizationType === '' ? '#495057' : 'black',
                        }}
                        // isInvalid={typeError !== ''}
                      >
                        <option value="" style={{ color: '#6c757d' }} disabled></option>
                        <option value="Provider" style={{ color: 'black' }}>
                          Provider
                        </option>
                        <option value="Distributor" style={{ color: 'black' }}>
                          Distributor
                        </option>
                      </Form.Select>
                      {/*<Form.Control.Feedback type="invalid">{typeError}</Form.Control.Feedback>*/}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md>
                    <Form.Group controlId="formStreet" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Street</Form.Label>
                      <Form.Control
                        type="text"
                        value={street}
                        onChange={(e) => {
                          setStreet(e.target.value);
                          handleInputChange();
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md="4">
                    <Form.Group controlId="formNumber" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={number}
                        onChange={(e) => { setNumber(e.target.value); }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <Form.Group controlId="formZipCode" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value);
                          handleInputChange();
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md>
                    <Form.Group controlId="formCity" className="mb-3">
                      <Form.Label style={{ color: 'white' }}>City</Form.Label>
                      <Form.Control
                        type="text"
                        value={city}
                        pattern="^\d{5}$"
                        onChange={(e) => {
                          setCity(e.target.value);
                          handleInputChange();
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

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
