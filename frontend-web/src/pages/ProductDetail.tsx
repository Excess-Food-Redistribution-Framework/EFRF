import { Col, Container, Row, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  GetProductById,
  DeleteProduct,
  UpdateProduct,
} from '../hooks/useProduct';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { useAuth } from '../AuthProvider';
import axios from 'axios';

function ProductDetail() {
  const { isAuth, user, userRole } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(true);
  const id: string = productId || '';
  const { product, errorMessage } = GetProductById(id);
  const [organization, setOrganization] = useState<OrganizationApiResponse>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (product) {
          setLoading(false);
        }

        const organizationResponse = await axios.get(
          '/api/Organization/Current'
        );
        setOrganization(organizationResponse.data);
      } catch (error) {
        //console.error('Error fetching organization:', error);
      }
    };

    fetchData();
  }, [product, user]);
  const handleDeleteSuccess = () => {
    console.log('Product deleted successfully');
    navigate('/products/');
  };

  const handleDeleteError = (error: string) => {
    console.error(`Error deleting product: ${error}`);
  };

  const handleDelete = () => {
    DeleteProduct(id, handleDeleteSuccess, handleDeleteError);
  };

  //console.log(user?.organization);
  const handleUpdate = () => {
    if (isAuth() && userRole != null && id) {
      if (organization?.id === product?.organization.id) {
        navigate(`/products/${id}/update`, { state: { id } });
      }
    }
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
    return <Navigate to="/*" />;
  }

  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">{product.name}</h1>
          </Col>
        </Row>
      </Container>
      <Container>
        <h5>{product.expirationDate}</h5>
        <h5>{product.quantity}</h5>
        <h5>{product.type}</h5>
        {isAuth() ? (
          userRole != null && organization?.id === product?.organization.id ? (
            <>
              <Button variant="danger" onClick={handleDelete}>
                Delete Product
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Update Product
              </Button>
            </>
          ) : null
        ) : null}
      </Container>
    </Container>
  );
}

export default ProductDetail;
