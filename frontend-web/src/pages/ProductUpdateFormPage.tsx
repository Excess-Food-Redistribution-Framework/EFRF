import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuth } from '../AuthProvider';
import { ProductApiResponse, ProductType } from '../types/productTypes';
import { GetProductById, UpdateProduct } from '../hooks/useProduct';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateProductFormPage() {
  const { isAuth, user, token } = useAuth();
  const navigate = useNavigate();

  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(true);
  const id: string = productId || '';
  const { product, errorMessage } = GetProductById(id);
  const today = new Date().toLocaleDateString('en-CA');

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState(ProductType.Other);
  const [expirationDate, setExpirationDate] = useState(today);
  const [state, setState] = useState('');
  const [organization, setOrganization] = useState<OrganizationApiResponse>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuth) {
          navigate('/login');
          return;
        }

        const organizationResponse = await axios.get(
          '/api/Organization/Current',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrganization(organizationResponse.data);
      } catch (error) {
        navigate('/');
      }
    };

    fetchData();
  }, [product, token, user, isAuth, navigate]);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setQuantity(product.quantity || 0);
      setType(product.type || ProductType.Other);
      setExpirationDate(
        new Date(product.expirationDate).toLocaleDateString('en-CA')
      );
      setLoading(false);

      if (
        product.organization &&
        organization &&
        product.organization.id !== organization.id
      ) {
        navigate('/');
        return;
      }
    }
  }, [product, organization]);

  const handleUpdate = () => {
    if (id && organization) {
      const updateData = {
        id: id,
        name: name,
        expirationDate: expirationDate,
        type: type,
        quantity: quantity,
        state: state,
        organization: organization,
      };

      UpdateProduct(id, updateData, handleUpdateSuccess, handleUpdateError);
    }
  };

  const handleUpdateSuccess = () => {
    toast.success('Product updated successfully');
    navigate('/organizationProducts');
  };

  const handleUpdateError = () => {
    toast.success('Error updating product');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return (
      <Container className="p-4 text-center">
        <h2>Server error. Failed to get product data!</h2>
      </Container>
    );
  }

  if (!product) {
    navigate('/*');
  }
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="10" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Update Product</h1>

              <Form onSubmit={handleUpdate}>
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
                  <Form.Label>Expiration date</Form.Label>
                  <Form.Control
                    type="date"
                    min={today}
                    placeholder="Expiration date"
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
                    <Button variant="secondary" onClick={handleUpdate}>
                      Update
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

export default UpdateProductFormPage;
