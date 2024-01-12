import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GetListOfRecommendedProducts } from '../hooks/useProduct';
import {
  getProductImage,
  isProductSoldOut,
  isProductExpired,
  getProductStatusClass,
} from '../utils/productUtils';
import {
  RecommendedProductCardsProps,
  ProductApiResponse,
} from '../types/productTypes';

function RecommendedProductCards({ params }: RecommendedProductCardsProps) {
  const navigate = useNavigate();
  const props = params;

  const { response, errorMessage } = GetListOfRecommendedProducts(props);

  const handleButtonClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (errorMessage) {
    return (
      <Container className="p-4 text-center">
        <h2>Server error. Failed to load product data!</h2>
        <h2>{errorMessage}</h2>
      </Container>
    );
  }

  if (!response) {
    return (
      <Container className="p-4 text-center">
        <Spinner animation="border" variant="secondary" />
      </Container>
    );
  }

  return (
    <Container onSubmit={(e) => e.preventDefault()} className="p-4">
      {response.data.length === 0 ? (
        <Container className="mt-4">
          <h2 className="text-center">No recommendations for you now</h2>
        </Container>
      ) : (
        <Row xs={1} md={2} lg={4} className="g-4 justify-content-center">
          {response.data.map((product: ProductApiResponse) => (
            <Col key={product.id} className="px-4">
              <Card
                className={`h-100 ${
                  getProductStatusClass(product) === 'available'
                    ? 'zoom-card'
                    : 'opacity-50'
                } product-card-${getProductStatusClass(product)}`}
              >
                <div className="product-image">
                  <div className="image-container">
                    <Card.Img
                      variant="top"
                      className="img-fluid embed-responsive-item"
                      src={getProductImage(product.type)}
                    />
                  </div>
                </div>
                {isProductSoldOut(product) && (
                  <Badge pill bg="danger" className="product-card-status-label">
                    <h6 className="m-0">Sold Out</h6>
                  </Badge>
                )}
                {!isProductSoldOut(product) && isProductExpired(product) && (
                  <Badge
                    pill
                    bg="warning"
                    className="product-card-status-label"
                  >
                    <h6 className="m-0">Expired</h6>
                  </Badge>
                )}
                {!isProductExpired(product) && !isProductSoldOut(product) && (
                  <Badge
                    pill
                    bg="success"
                    className="product-card-status-label"
                  >
                    <h6 className="m-0">Available</h6>
                  </Badge>
                )}
                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <Row>
                    <Col className="d-flex justify-content-start">
                      <Card.Subtitle className="text-success fw-bold">
                        {product.type}
                      </Card.Subtitle>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <Card.Subtitle className="">
                        {product.organization.address.city}
                      </Card.Subtitle>
                    </Col>
                  </Row>
                  <Card.Title className="pt-2 fw-bold">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="">{product.description}</Card.Text>
                  <Row>
                    <Col className="d-flex align-items-baseline">
                      <Card.Subtitle className="d-flex justify-content-center px-2">
                        Valid To:
                      </Card.Subtitle>
                      <Card.Text>
                        {new Date(product.expirationDate).toLocaleDateString(
                          'sk-SK'
                        )}
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex align-items-baseline">
                      <Card.Subtitle className="d-flex justify-content-center px-2">
                        Distance:
                      </Card.Subtitle>
                      <Card.Text>
                        {Number.isInteger(product.distance)
                          ? product.distance
                          : product.distance.toFixed(2)}{' '}
                        km
                      </Card.Text>
                    </Col>
                  </Row>
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
                              ? `${
                                  product.quantity - product.availableQuantity
                                }`
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
                  <Button onClick={() => handleButtonClick(product.id)}>
                    Product Detail
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
export default RecommendedProductCards;
