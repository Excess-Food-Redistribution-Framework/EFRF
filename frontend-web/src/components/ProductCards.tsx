import { Card, Col, Container, Row } from 'react-bootstrap';
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
    <Container className="p-5">
      <Row xs={1} md={4} className="g-4 justify-content-center">
        {Array.from({ length: pageSize }).map((_, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Col key={idx}>
            <Card className="h-100">
              <Card.Img variant="top" src="https://placehold.co/286x160" />
              <Card.Body className="d-flex flex-column justify-content-between h-100">
                <Card.Text>Type</Card.Text>
                <Card.Text>Location</Card.Text>
                <Card.Title>Title</Card.Title>
                <Card.Text>Text</Card.Text>
                <Card.Text>Progress Bar with some info</Card.Text>
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
