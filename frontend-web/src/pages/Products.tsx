import { Col, Container, Row } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';
import { useAuth } from '../AuthProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrganizationApiResponse } from '../types/organizationTypes';

function Product() {
  const { isAuth, user, token } = useAuth();
  const [setUserData] = useState<any>(null);
  const [organization, setOrganization] = useState<OrganizationApiResponse>();
  const [loading, setLoading] = useState(true);

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
      //console.log('Organization Response:', organizationResponse.data);
      setOrganization(organizationResponse.data);
    } catch (error) {
      //console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuth, user, token]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Products</h1>
          </Col>
        </Row>
      </Container>
      {organization ? (
        <ProductCards page={0} pageSize={10} notExpired={true} notBlocked={true} organizationId={organization.id} 
        />
      ) : (
        <ProductCards page={0} pageSize={10} notExpired={true} notBlocked={true}
        />
      )}
    </Container>
  );
}

export default Product;