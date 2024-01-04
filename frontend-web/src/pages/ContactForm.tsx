import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ContactForm() {
  const navigate = useNavigate();
  const { user, isAuth } = useAuth();
  const [email, setEmail] = useState(user ? user.email : '');
  const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');

  const categoryOptions = ['Technical Support', 'Delivery', 'Account', 'Other'];

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/Ticket', {
        email,
        fullName,
        category,
        text,
      });

      toast.success('Support ticket created successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Error creating support ticket. Please try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="8" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Contact Us</h1>

              <Form onSubmit={handleSubmit}>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="formFullName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="formCategory" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categoryOptions.map((categoryOption) => (
                      <option key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="formText" className="mb-3">
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" type="submit">
                      Send
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

export default ContactForm;
