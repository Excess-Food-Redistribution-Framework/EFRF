import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { Product, ProductType } from '../types/productTypes';

function ProductFormPage() {
  const navigate = useNavigate();
  const { isAuth, user, setUser } = useAuth();

  const today = new Date().toLocaleDateString('en-CA');

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState(ProductType.Other);
  const [expirationDate, setExpirationDate] = useState(today);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/Product', {
        name,
        type,
        quantity,
        expirationDate,
      } as Product);

      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.role && user?.role !== 'Provider') {
      navigate('/');
    }
  }, [isAuth]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="10">
          <Row>
            <Col lg="12" className="p-5">
              <h1 className="mb-3">Create new product</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formQuantity" className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Guantity"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value))
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formType" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    aria-label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value as ProductType)}
                  >
                    {Object.keys(ProductType).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="formQuantity" className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="date"
                    min={today}
                    placeholder="Guantity"
                    value={expirationDate}
                    onChange={(e) =>
                      setExpirationDate(
                        new Date(e.target.value).toLocaleDateString('en-CA')
                      )
                    }
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

export default ProductFormPage;
