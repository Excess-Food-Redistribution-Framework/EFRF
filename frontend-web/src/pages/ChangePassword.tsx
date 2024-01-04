import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { toast } from 'react-toastify';

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { isAuth} = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/Account/Password', {
        oldPassword: currentPassword,
        newPassword,
      });

      toast.success('Password changed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Error changing password. Please try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="6" className="pt-4">
          <Card className="p-4">
            <Card.Body>
              <h1 className="mb-3">Change Password</h1>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCurrentPassword" className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formNewPassword" className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmNewPassword" className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="secondary" type="submit">
                      Change Password
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

export default ChangePasswordPage;