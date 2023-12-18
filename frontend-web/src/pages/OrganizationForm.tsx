import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { OrganizationAddress, OrganizationLocation } from '../types/organizationTypes';

function OrganizationForm() {
  const navigate = useNavigate();
  const { isAuth, user, setUser } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [information, setInformation] = useState('');
  const [location, setLocation] = useState<OrganizationLocation>({
    longitude: 0,
    latitude: 0,
  });
  const [address, setAddress] = useState<OrganizationAddress>({
    state: '',
    city: '',
    street: '',
    number: '',
    zipCode: '',
  });

  const [nameError, setNameError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (name === '') {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (type === '') {
      setTypeError('Type is required');
      isValid = false;
    } else {
      setTypeError('');
    }

    if (
      address.state === '' ||
      address.city === '' ||
      address.street === '' ||
      address.number === '' ||
      address.zipCode === ''
    ) {
      setAddressError('Address is required');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await axios.put('api/Organization/Current', {
        name,
        type,
        information,
        address,
        location,
      });

      // if (response.status === 200) {
      //   const currentUser = await axios.get('api/Account');
      //   setUser(currentUser.data);
      // }

      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/Organization/Current');

        if (response.status === 200) {
          const organizationData = response.data;
          setName(organizationData.name);
          setType(organizationData.type);
          setInformation(organizationData.information);
          setLocation(organizationData.location);
          setAddress(organizationData.address);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="10" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Edit Organization</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError('');
                    }}
                    isInvalid={nameError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formType" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    disabled
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setTypeError('');
                    }}
                    style={{
                      color: type === '' ? '#495057' : 'black',
                    }}
                    isInvalid={typeError !== ''}
                  >
                    <option value="" style={{ color: '#6c757d' }} disabled></option>
                    <option value="Provider" style={{ color: 'black' }}>
                      Provider
                    </option>
                    <option value="Distributor" style={{ color: 'black' }}>
                      Distributor
                    </option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{typeError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formInformation" className="mb-3">
                  <Form.Label>Information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={information}
                    onChange={(e) => setInformation(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formState" className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value } as OrganizationAddress)}
                    isInvalid={addressError !== '' && address.state === ''}
                  />
                  <Form.Control.Feedback type="invalid">State is required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formCity" className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value } as OrganizationAddress)}
                    isInvalid={addressError !== '' && address.city === ''}
                  />
                  <Form.Control.Feedback type="invalid">City is required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formStreet" className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value } as OrganizationAddress)}
                    isInvalid={addressError !== '' && address.street === ''}
                  />
                  <Form.Control.Feedback type="invalid">Street is required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formNumber" className="mb-3">
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value } as OrganizationAddress)}
                    isInvalid={addressError !== '' && address.number === ''}
                    pattern="[0-9]+"
                  />
                  <Form.Control.Feedback type="invalid">Number is required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formZipCode" className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value } as OrganizationAddress)}
                    isInvalid={addressError !== '' && address.zipCode === ''}
                  />
                  <Form.Control.Feedback type="invalid">Zip Code is required</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OrganizationForm;
