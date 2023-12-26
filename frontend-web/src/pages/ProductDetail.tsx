import {
  Col,
  Container,
  Row,
  Button,
  Card,
  ProgressBar,
} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GetProductById, DeleteProduct } from '../hooks/useProduct';
import { OrganizationApiResponse } from '../types/organizationTypes';
import { useAuth } from '../AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { getProductImage } from '../utils/productUtils';

function ProductDetail() {
  const { isAuth, user, userRole } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(true);
  const id: string = productId || '';
  const { product, errorMessage } = GetProductById(id);
  const [organization, setOrganization] = useState<OrganizationApiResponse>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      } catch (error) {}
    };

    fetchData();
  }, [product, user]);

  const handleDeleteSuccess = () => {
    toast.success('Product deleted successfully');
    navigate('/organizationProducts/');
  };

  const handleDeleteError = (error: string) => {
    console.error(`Error deleting product: ${error}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    DeleteProduct(id, handleDeleteSuccess, handleDeleteError);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleTakeProduct = async (productId: string) => {
    try {
      navigate(`/foodRequest/products/${productId}`);
    } catch (error) {
      console.error(`Error taking product: ${error}`);
      toast.error('Failed to take product');
    }
  };

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
        <Row className="shadow-lg my-5 justify-content-between bg-white rounded-5 overflow-hidden">
          <Col lg={6} className="justify-content-center d-flex p-0">
            <img
              src={getProductImage(product.type)}
              className="img-fluid w-100"
            />
          </Col>
          <Col
            lg={6}
            className="justify-content-between d-flex flex-column p-5"
          >
            <div>
              <div className="d-flex align-items-baseline justify-content-between pb-4">
                <h3>{product.type}</h3>
                <p hidden={!isAuth()}>
                  {product.organization.address.city}{' '}
                  {product.organization.address.street}{' '}
                  {product.organization.address.number}
                </p>
              </div>
              <h6>{product.description}</h6>
            </div>
            <div>
              <Row className="py-2">
                <Col>
                  <Card.Subtitle className="d-flex justify-content-center">
                    Quantity
                  </Card.Subtitle>
                </Col>
                <Col className="col-12">
                  <ProgressBar className="m-2">
                    <ProgressBar
                      variant="primary"
                      animated
                      min={0}
                      max={product.quantity}
                      now={product.availableQuantity}
                      label={
                        product.availableQuantity >= 0.05 * product.quantity
                          ? `${product.availableQuantity}`
                          : ''
                      }
                      key={1}
                    />
                    <ProgressBar
                      variant="secondary"
                      animated
                      min={0}
                      max={product.quantity}
                      now={product.quantity - product.availableQuantity}
                      label={
                        product.quantity - product.availableQuantity >=
                        0.05 * product.quantity
                          ? `${product.quantity - product.availableQuantity}`
                          : ''
                      }
                      key={2}
                    />
                  </ProgressBar>
                </Col>
                <Col className="d-flex justify-content-center align-items-baseline">
                  <Card.Subtitle className="px-1">Available:</Card.Subtitle>
                  <Card.Text className="">
                    {product.availableQuantity}
                  </Card.Text>
                </Col>
                <Col className="d-flex justify-content-center align-items-baseline">
                  <Card.Subtitle className="px-1">Total:</Card.Subtitle>
                  <Card.Text className="">{product.quantity}</Card.Text>
                </Col>
              </Row>
            </div>
            <Row>
              <Col sm={5}>
                <h6>Expires: {product.expirationDate}</h6>
              </Col>
              <Col sm={7} className="d-flex justify-content-evenly">
                {isAuth() ? (
                  userRole === 'Provider' &&
                  organization?.id === product?.organization.id ? (
                    <>
                      <Button variant="danger" onClick={handleDelete}>
                        Delete Product
                      </Button>
                      <Button variant="primary" onClick={handleUpdate}>
                        Update Product
                      </Button>
                    </>
                  ) : userRole === 'Distributor' ? (
                    <Button
                      variant="success"
                      onClick={() => handleTakeProduct(product.id)}
                    >
                      Take Product
                    </Button>
                  ) : null
                ) : null}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}

export default ProductDetail;
