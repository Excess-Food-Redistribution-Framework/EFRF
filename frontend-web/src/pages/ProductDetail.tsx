import { Col, Container, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { GetProductById } from '../hooks/useProduct';

function ProductDetail() {
  const { productId } = useParams(); // Získajte articleId zo URL
  const [loading, setLoading] = useState(true);
  const id: string = productId || '';
  const { product, errorMessage } = GetProductById(id);

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

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
      </Container>
    </Container>
  );
}

export default ProductDetail;
