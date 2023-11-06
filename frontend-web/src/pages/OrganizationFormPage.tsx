import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthProvider';

function OrganizationFormPage() {
  const navigate = useNavigate();
  const { isAuth, user, setUser } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('Provider');
  const [information, setInformation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        <Col lg="10" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Create new organization</h1>

              <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formType" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Provider">Provider</option>
                    <option value="Distributer">Distributer</option>
                  </Form.Select>
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

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Col>
                </Row>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OrganizationFormPage;
