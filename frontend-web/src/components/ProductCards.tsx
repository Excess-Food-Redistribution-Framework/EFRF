import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { ProductCardsProps } from '../types/productTypes';
// import { GetListOfArticles } from '../hooks/useArticle';

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
              <Card.Img variant="top" src="https://placehold.co/286x160" />
              <Card.Body className="d-flex flex-column justify-content-between h-100">
                <Row>
                  <Col>Type</Col>
                  <Col className="text-right">Location</Col>
                </Row>
                <h4 className="my-3">Title</h4>
                <p>Text with a short description</p>
                <ProgressBar
                  animated
                  min={0}
                  max={100}
                  now={50}
                  label={`${50}`}
                />
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
