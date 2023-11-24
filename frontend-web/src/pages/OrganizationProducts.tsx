import { Col, Container, Row, Form } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';
import { useAuth } from '../AuthProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { useNavigate } from 'react-router-dom';


function OrganizationProducts() {
const navigate = useNavigate();
  const { isAuth, user, token } = useAuth();
  const [organization, setOrganization] = useState<OrganizationApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const page = 1;
  const pageSize = 5;
  const [showDisabled, setShowDisabled] = useState<boolean>(true);
  const isPagination = true;

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

  useEffect(() => {
    fetchUserData();
  }, [isAuth, user, token]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (organization?.type !== 'Provider') {
    navigate('/');
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
      <Container className="pt-4 px-5 justify-content-end">
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch-disabled"
            label="Disabled"
            checked={showDisabled}
            onChange={() => {
              setShowDisabled(!showDisabled);
            }}
          />
        </Form>
      </Container>
      {organization && (
        <ProductCards
          params={{
            page,
            pageSize,
            //onlyAvailable: !showDisabled,
            notExpired: !showDisabled,
            organizationIds: organization.id
          }}
          pagination={isPagination}
        />
      )}
    </Container>
  );
}

export default OrganizationProducts;
