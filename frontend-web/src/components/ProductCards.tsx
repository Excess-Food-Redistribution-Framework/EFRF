import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Pagination,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetListOfProducts } from '../hooks/useProduct';
import {
  getProductImage,
  isProductSoldOut,
  isProductExpired,
  getProductStatusClass,
} from '../utils/productUtils';
import { useAuth } from '../AuthProvider';
import { ProductApiResponse, ProductCardsProps } from '../types/productTypes';
import generatePaginationItems from '../utils/paginationUtils';

function ProductCards({ params, pagination }: ProductCardsProps) {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [props, setProps] = useState(params);
  const { response, errorMessage } = GetListOfProducts(props);

  useEffect(() => {
    setProps(params);
  }, [params]);

  const handlePaginationClick = (pageNumber: number) => {
    setProps({ ...props, page: pageNumber });
  };

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

  if (response.data.length === 0) {
    return (
      <Container className="p-4 text-center">
        <h2>No products</h2>
      </Container>
    );
  }

  return (
    <Container className="p-4">
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
                <Badge pill bg="warning" className="product-card-status-label ">
                  <h6 className="m-0">Sold Out</h6>
                </Badge>
              )}
              {isProductExpired(product) && (
                <Badge pill bg="warning" className="product-card-status-label">
                  <h6 className="m-0">Expired</h6>
                </Badge>
              )}
              {!isProductExpired(product) && !isProductSoldOut(product) && (
                <Badge pill bg="success" className="product-card-status-label">
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
                <Card.Title className="pt-2 fw-bold">{product.name}</Card.Title>
                <Card.Text className="">Short description of product</Card.Text>
                <Row>
                  <Col>
                    <Card.Subtitle className="d-flex justify-content-center">
                      Quantity
                    </Card.Subtitle>
                  </Col>
                  <Col>
                    <Card.Subtitle className="d-flex justify-content-center">
                      Valid To
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Card.Text className="">{product.quantity}</Card.Text>
                  </Col>
                  <Col className="d-flex justify-content-center">
                    <Card.Text>
                      {new Date(product.expirationDate).toLocaleDateString(
                        'sk-SK'
                      )}
                    </Card.Text>
                  </Col>
                </Row>
                <ProgressBar className="m-3">
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
                <Button
                  onClick={() => handleButtonClick(product.id)}
                  disabled={!isAuth()}
                >
                  Product Detail
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {pagination && (
        <Pagination className="my-5 justify-content-center">
          {generatePaginationItems(
            response.page,
            response.count,
            response.pageSize,
            handlePaginationClick
          )}
        </Pagination>
      )}
    </Container>
  );
}
export default ProductCards;
