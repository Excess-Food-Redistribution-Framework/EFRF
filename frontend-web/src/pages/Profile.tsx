import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import MapContainer from '../components/MapContainer';
import getOrgBadge from '../utils/orgUtils';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<object | any>({});
  const [loading, setLoading] = useState(true);

  const { isAuth, userRole } = useAuth();

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

  const rank = 1;
  const coins = 234;
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
                <Row>
                  <Col lg={5} className="pb-3">
                    <Card className="h-100">
                      <Card.Body className="justify-content-between d-flex flex-column">
                        <div>
                          <h3 className="mb-3">
                            {userData.firstName} {userData.lastName}
                          </h3>
                          <p>Email: {userData.email}</p>
                          {userData.organization && (
                            <p>
                              Organization: {userData.organization.name} (
                              {userData.organization.type})
                            </p>
                          )}
                        </div>
                        <Row>
                          <div className="d-flex justify-content-evenly">
                            <Button
                              className="mx-1"
                              onClick={() => navigate('/profile/edit')}
                            >
                              Edit profile
                            </Button>
                            <Button
                              className="mx-1"
                              onClick={() =>
                                navigate('/profile/change-password')
                              }
                            >
                              Change password
                            </Button>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={7} className="pb-3">
                    <Card className="h-100">
                      <Card.Body className="d-flex flex-column justify-content-between">
                        <Row className="justify-content-between">
                          {userRole === 'Provider' ? (
                            <Col className="col-3">
                              <img
                                src={getOrgBadge(rank)}
                                className="img-fluid"
                              />
                            </Col>
                          ) : null}

                          <Col className="col-5">
                            <div className="d-flex justify-content-between">
                              <h3 className="mb-3">
                                {userData.organization.name}
                              </h3>
                            </div>
                            <p>{userData.organization.information}</p>
                            {userRole === 'Provider' ? (
                              <>
                                <p className="pt-2">Coins: {coins}</p>
                                <p>Rank: {rank}.</p>
                              </>
                            ) : null}
                          </Col>
                          <Col className="col-4">
                            <h5>Address</h5>
                            <p>
                              {userData.organization.address.street}{' '}
                              {userData.organization.address.number}
                              <br />
                              {userData.organization.address.zipCode}{' '}
                              {userData.organization.address.city}
                              <br />
                              {userData.organization.address.state}
                            </p>
                          </Col>
                        </Row>
                        <div className="justify-content-end d-flex">
                          <Button
                            className="mx-1"
                            onClick={() => navigate('/organization/edit')}
                          >
                            Edit organization
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {userData.organization && userData.organization.location && (
                  <MapContainer location={userData.organization.location} />
                )}
                {/* <p className="my-3"> */}
                {/*  Data: {JSON.stringify(userData)} */}
                {/* </p> */}
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
