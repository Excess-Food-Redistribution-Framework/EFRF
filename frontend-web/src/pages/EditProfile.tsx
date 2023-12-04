import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser, isAuth } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (isAuth() && user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [isAuth, user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.put(`api/Account`, {
        firstName,
        lastName,
      });

      setUser(response.data);

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="6" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Edit Profile</h1>

              <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={user ? user.email : ''}
                    readOnly
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" type="submit">
                      Update Profile
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

export default EditProfile;