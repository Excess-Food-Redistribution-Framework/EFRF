import { Col, Container, Row, Form } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';
import { useAuth } from '../AuthProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { FoodRequest } from '../types/foodRequestTypes';
import { useNavigate } from 'react-router-dom';


function OrganizationFoodRequests() {
    const navigate = useNavigate();
    const { isAuth, user, token } = useAuth();
    const [organization, setOrganization] = useState<OrganizationApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [foodRequests, setFoodRequests] = useState<FoodRequest[] | null>([]);
  
    const fetchUserData = async () => {
      try {
        if (!isAuth()) {
          setLoading(false);
          return;
        }
        // Fetch organization data
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
      if (!loading && organization?.type !== 'Distributor') {
        navigate('/');
      }
    }, [loading, organization, navigate]);
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    return (
      <Container fluid className="px-0">
        <Container fluid className="secondary_color">
          <Row className="justify-content-center diagonal-bg p-5">
            <Col className="text-center d-flex flex-column justify-content-center">
              <h1 className="text-white text-shadow pb-2">Food Requests</h1>
            </Col>
          </Row>
        </Container>
  
        {organization && (
          <Container>
            <h2>Food Requests:</h2>
            <ul>
              {foodRequests?.map((foodRequest) => (
                <li>
                  <p>Title: {foodRequest.title}</p>
                  <p>Description: {foodRequest.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        )}
      </Container>
    );
  }
  
  export default OrganizationFoodRequests;