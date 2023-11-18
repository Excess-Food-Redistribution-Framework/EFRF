import {
  Button,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GetListOfProducts } from '../hooks/useProduct';
import { getProductImage } from '../utils/getProductImage';
import { useAuth } from '../AuthProvider';
import { ProductApiResponse, ProductsApiParams } from '../types/productTypes';

function ProductCards(params: ProductsApiParams) {
  const { listOfProducts, errorMessage } = GetListOfProducts(params);
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const handleClickButton = (productId: ProductApiResponse['id']) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Container className="p-4">
      {errorMessage && (
        <Container className="p-4 text-center">
          <h2>Server error. Failed to load product data!</h2>
        </Container>
      )}
      {!listOfProducts && !errorMessage && (
        <Container className="p-4 text-center">
          <Spinner animation="border" variant="secondary" />
        </Container>
      )}
      {listOfProducts === null && !errorMessage && (
        <Container className="p-4 text-center">
          <h2>No products. Try to check later.</h2>
        </Container>
      )}
      <Row xs={1} md={4} className="g-4 justify-content-center">
        {listOfProducts?.map((product: ProductApiResponse) => (
          <Col key={product.id} className="px-4">
            <Card className={`h-100 ${product.state === 'Available' ? 'zoom-card' : 'opacity-50'}`}>
              <Card.Img variant="top" src={getProductImage(product.type)} />
              <Card.Body className="d-flex flex-column justify-content-between h-100">
                <Row>
                  <Col className="d-flex justify-content-start">
                    <Card.Text>{product.type}</Card.Text>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Card.Text>Location</Card.Text>
                  </Col>
                </Row>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Here will be description of product</Card.Text>
                <Row>
                  <Col>
                    <Card.Subtitle className="d-flex justify-content-center">
                      Quantity
                    </Card.Subtitle>
                  </Col>
                  <Col>
                    <Card.Subtitle className="d-flex justify-content-center">
                      Expiration
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Card.Text>{product.quantity}</Card.Text>
                  </Col>
                  <Col className="d-flex justify-content-center">
                    <Card.Text>
                      {new Date(product.expirationDate).toLocaleDateString(
                        'en-US'
                      )}
                    </Card.Text>
                  </Col>
                </Row>
                <ProgressBar className="m-3 ">
                  <ProgressBar
                    variant="primary"
                    animated
                    min={0}
                    max={product.quantity}
                    now={product.availableQuantity}
                    label={`${product.availableQuantity}`}
                    key={1}
                  />
                  <ProgressBar
                    variant="danger"
                    animated
                    min={0}
                    max={product.quantity}
                    now={product.quantity - product.availableQuantity}
                    label={`${product.quantity - product.availableQuantity}`}
                    key={2}
                  />
                </ProgressBar>
                <Button
                  onClick={() => handleClickButton(product.id)}
                  disabled={!isAuth()}
                >
                  Check Product
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductCards;
