import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { ProductApiResponse, ProductType } from '../types/productTypes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductFormPage() {
  const navigate = useNavigate();
  const { isAuth, userRole } = useAuth();

  const today = new Date();
  today.setDate(today.getDate());
  const todayFormatted = today.toLocaleDateString('en-CA');

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState(ProductType.Other);
  const [expirationDate, setExpirationDate] = useState(todayFormatted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Type', type);
    formData.append('Quantity', quantity.toString());
    formData.append('ExpirationDate', expirationDate);
    formData.append('ImageUrl', '');
    
    try {
      await axios.post('api/Product', formData);

      navigate('/organizationProducts');
      toast.success('Product created successfully!')
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userRole !== 'Provider') {
      navigate('/');
    }
  }, [isAuth]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="10" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Create new product</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formQuantity" className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Quantity"
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
                    min={todayFormatted}
                    placeholder="Date"
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductFormPage;
