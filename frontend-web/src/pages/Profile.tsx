import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Button, Card, Col, Container, Row, Spinner} from 'react-bootstrap';
import { useAuth } from '../AuthProvider';
import MapContainer from '../components/MapContainer';
import {useNavigate} from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<object | any>({});
  const [loading, setLoading] = useState(true);

  const { isAuth } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('api/Account');
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuth()) {
        await fetchUserData();
      }
    };

    fetchData();
  }, [isAuth]);

  return (
    <>
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Profile</h1>
          </Col>
        </Row>
      </Container>
      <Container className="pt-4">
        {isAuth() ? (
          <>
            {loading ? (
              <div className="p-4 text-center">
                <Spinner animation="border" variant="secondary" />
              </div>
            ) : userData.id ? (
              <>
                <Card className="mb-3">
                  <Card.Body>
                    <h3 className="mb-3">{userData.firstName} {userData.lastName}</h3>
                    <p>Email: {userData.email}</p>
                    {userData.organization && (<>
                      <p>Organization: {userData.organization.name} ({userData.organization.type})</p>
                    </>)}
                    <Row>
                      <div>
                        <Button className="mx-1" onClick={() => navigate('/profile/edit')}>Edit profile</Button>
                        <Button className="mx-1" onClick={() => navigate('/profile/change-password')}>Change password</Button>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="mb-3">
                  <Card.Body>
                    <h3 className="mb-3">{userData.organization.name}</h3>
                    <p>{userData.organization.information}</p>
                    <h5>Address</h5>
                    <p>
                      {userData.organization.address.street} {userData.organization.address.number}<br/>
                      {userData.organization.address.zipCode} {userData.organization.address.city}<br/>
                      {userData.organization.address.state}
                    </p>

                    <Row>
                      <div>
                        {/*<Button className="mx-1" onClick={() => navigate('/profile/edit')}>Edit organization</Button>*/}
                      </div>
                    </Row>
                  </Card.Body>
                </Card>

                {userData.organization && userData.organization.location && (
                  <MapContainer location={userData.organization.location} />
                )}
                <p className="my-3">
                  Data: {JSON.stringify(userData)}
                </p>
              </>
            ) : (
              <p>No data available</p>
            )}
          </>
        ) : (
          <p>To view your profile, please log in</p>
        )}
      </Container>
      </>
  );
}

export default Profile;
