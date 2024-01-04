import { Col, Container, Row, Button } from 'react-bootstrap';
import FoodRequestCard from '../components/FoodRequestCard';
import { useAuth } from '../AuthProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { FoodRequestResponse, FoodRequestState } from '../types/foodRequestTypes';
import { useNavigate } from 'react-router-dom';

function OrganizationFoodRequests() {
  const navigate = useNavigate();
  const { isAuth, user, token } = useAuth();
  const [organization, setOrganization] = useState<OrganizationApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [foodRequests, setFoodRequests] = useState<FoodRequestResponse[] | null>([]);
  const [activeRequests, setActiveRequests] = useState(true);

  const fetchUserData = async () => {
    try {
      if (!isAuth()) {
        setLoading(false);
        return;
      }
      const organizationResponse = await axios.get('/api/Organization/Current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrganization(organizationResponse.data);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodRequestsData = async () => {
    try {
      if (!isAuth()) {
        setLoading(false);
        return;
      }
      const foodRequestsResponse = await axios.get('/api/FoodRequest/GetByCurrentOrganization', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(foodRequestsResponse.data);
      setFoodRequests(foodRequestsResponse.data);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchFoodRequestsData();
    };

    fetchData();
  }, [isAuth, user, token]);

  useEffect(() => {
    if (!loading && organization?.type !== 'Distributor' && organization?.type !== 'Provider') {
      navigate('/');
    }
  }, [loading, organization, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary-color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Food Requests</h1>
          </Col>
        </Row>
      </Container>

      <Container className="my-4">
        <Row className="justify-content-center">
          <Col className="text-center mb-3">
            <Button
              variant={activeRequests ? 'primary' : 'secondary'}
              onClick={() => setActiveRequests(true)}
            >
              Active Requests
            </Button>
            <Button
              variant={activeRequests ? 'secondary' : 'primary'}
              onClick={() => setActiveRequests(false)}
            >
              Completed Requests
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center">
  {foodRequests
    ?.filter((foodRequest) =>
      activeRequests
        ? [
            FoodRequestState.NotAccepted,
            FoodRequestState.Preparing,
            FoodRequestState.Waiting,
            FoodRequestState.Deliviring,
            FoodRequestState.Unknown,
          ].includes(foodRequest.state)
        : foodRequest.state === FoodRequestState.Received
    )
    .map((filteredFoodRequest) => (
      <Col key={filteredFoodRequest.id} md={6} lg={4}>
         <FoodRequestCard foodRequest={filteredFoodRequest} />
      </Col>
    ))}
</Row>
      </Container>
    </Container>
  );
}

export default OrganizationFoodRequests;
