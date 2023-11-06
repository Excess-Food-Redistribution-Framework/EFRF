import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthProvider.tsx';

function OrganizationFormPage() {
  const navigate = useNavigate();
  const { isAuth, user, setUser } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [information, setInformation] = useState('');

  const [nameError, setNameError] = useState('');
  const [typeError, setTypeError] = useState('');

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
  
    if (!isValid) {
      return;
    }
    
  
    try {
      const response = await axios.post('api/Organization', {
        name,
        type,
        information,
      });
  
      if (response.status === 200) {
        const currentUser = await axios.get('api/Account');
        setUser(currentUser.data);
      }
  
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.role) {
      navigate('/');
    }
  }, [isAuth]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="10">
          <Row className="primary_color">
            <Col lg="12" className="p-5">
              <h1 className="mb-3 text-white">Create new organization</h1>

              <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
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
                <Form.Select
                  aria-label="Type"
                  value={type}
                  onChange={(e) => { 
                    setType(e.target.value);
                    setTypeError('');
                  }}
                  style={{
                    color: type === '' ? '#495057' : 'black'
                    }}
                  isInvalid={typeError !== ''}
                >
                  <option value="" style={{ color: '#6c757d' }}>Select Type Organization</option>
                  <option value="Provider" style={{ color: 'black' }}>Provider</option>
                  <option value="Distributer" style={{ color: 'black' }}>Distributer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{typeError}</Form.Control.Feedback>
              </Form.Group>


                <Form.Group controlId="formInformation" className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Information"
                    value={information}
                    onChange={(e) => setInformation(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
                </Form>
                  </Col>
                </Row>
            </Col>
          </Row>
    </Container>
  );
}

export default OrganizationFormPage;
