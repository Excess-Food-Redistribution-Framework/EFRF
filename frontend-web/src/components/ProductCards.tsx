/* eslint-disable no-nested-ternary */
import {
  Button,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
} from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Product, ProductType, ProductCardsProps } from '../types/productTypes';
import { GetListOfProducts } from '../hooks/useProduct';

function ProductCards({ page, pageSize, notBlocked, notExpired}: ProductCardsProps) {7
  const { listOfProducts, errorMessage } = GetListOfProducts(page, pageSize, notBlocked, notExpired);
  const navigate = useNavigate();

  const handleButtonClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (errorMessage) {
    return (
      <Container className="p-4 text-center">
        <h2>Server error. Failed to load product data!</h2>
      </Container>
    );
  }
  if (!listOfProducts) {
    return (
      <Container className="p-4 text-center">
        <h2>Loading products...</h2>
      </Container>
    );
  }
  if (!listOfProducts || listOfProducts.length === 0) {
    return (
      <Container className="p-4">
        <h2>No products available. Please check later.</h2>
      </Container>
    );
  }
  /* if (listOfProducts === 0) {
    return (
      <Container className="p-4">
        <h2>No products. Try to check later.</h2>
      </Container>
    );
  }
 */
  if (listOfProducts) {
    return (
      <Container className="p-4">
        <Row xs={1} md={4} className="g-4 justify-content-center">
          {listOfProducts.map((product: Product) => (
            <Col key={product.id} className="px-4">
              <Card className="h-100 zoom-card">
                <Card.Img
                  variant="top"
                  src={
                    product.type === ProductType.BakeryItems
                      ? 'https://hicaps.com.ph/wp-content/uploads/2022/12/bakery-products.jpg'
                      : product.type === ProductType.FreshProduce
                      ? 'https://www.heart.org/-/media/Images/News/2019/April-2019/0429SustainableFoodSystem_SC.jpg'
                      : product.type === ProductType.CannedGoods
                      ? 'https://www.lacademie.com/wp-content/uploads/2022/05/canned-food.jpg'
                      : 'https://i.pinimg.com/originals/4b/9c/77/4b9c7794eacda24d38fe00ce664b8fac.jpg'
                  }
                />
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
                      variant="secondary"
                      animated
                      min={0}
                      max={product.quantity}
                      now={7}
                      label={`${7}`}
                      key={1}
                    />
                    <ProgressBar
                      variant="primary"
                      animated
                      min={0}
                      max={product.quantity}
                      now={product.quantity - 7}
                      label={`${product.quantity - 7}`}
                      key={2}
                    />
                  </ProgressBar>
                  <Button onClick={() => handleButtonClick(product.id)}>
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
}
export default ProductCards;
