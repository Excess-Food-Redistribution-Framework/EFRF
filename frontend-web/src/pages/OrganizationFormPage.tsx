import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../AuthProvider.tsx";
import axios from "axios";


function OrganizationFormPage() {
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [information, setInformation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'api/Organization',
        {
          name,
          type,
          information,
        }
      );

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
                    placeholder="Enter First Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formType" className="mb-3">
                  <Form.Select aria-label="Type" value={type} onChange={e => setType(e.target.value)}>
                    <option value="Provider">Provider</option>
                    <option value="Distributer">Distributer</option>
                  </Form.Select>
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

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default OrganizationFormPage;