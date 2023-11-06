import {
  Button,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
} from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { ProductCardsProps } from '../types/productTypes';
// import Product from '../pages/Products';
// import { GetListOfProducts } from '../hooks/useProduct';

function ProductCards({ pageSize }: ProductCardsProps) {
  // const { listOfProducts, errorMessage } = GetListOfProducts();
  // const navigate = useNavigate();

  /* const handleClickButton = (productId: string) => {
    navigate(`/products/${productId}`);
  }; */

  /* if (errorMessage) {
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
  if (listOfProducst.count === 0) {
    return (
      <Container className="p-4">
        <h2>No products. Try to check later.</h2>
      </Container>
    );
  } */

  // if (listOfProducts.data) {
  return (
    <Container className="p-4">
      <Row xs={1} md={4} className="g-4 justify-content-center">
        {Array.from({ length: pageSize }).map((_, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Col key={idx}>
            <Card className="h-100 zoom-card">
              <Card.Img
                variant="top"
                src="https://hicaps.com.ph/wp-content/uploads/2022/12/bakery-products.jpg"
              />
              <Card.Body className="d-flex flex-column justify-content-between h-100">
                <Row>
                  <Col className="d-flex justify-content-start">
                    <Card.Text>Bakery Product</Card.Text>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Card.Text>Košice</Card.Text>
                  </Col>
                </Row>
                <Card.Title>Bread</Card.Title>
                <Card.Text>White salt bread from Vamex bakery</Card.Text>
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
                    <Card.Text>50</Card.Text>
                  </Col>
                  <Col className="d-flex justify-content-center">
                    <Card.Text>09.11.2023</Card.Text>
                  </Col>
                </Row>
                <ProgressBar className="m-3 ">
                  <ProgressBar
                    variant="secondary"
                    animated
                    min={0}
                    max={50}
                    now={12}
                    label={`${12}`}
                    key={1}
                  />
                  <ProgressBar
                    variant="primary"
                    animated
                    min={0}
                    max={50}
                    now={38}
                    label={`${38}`}
                    key={2}
                  />
                </ProgressBar>
                <Button>Check Product</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
// }
export default ProductCards;
