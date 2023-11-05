import { Col, Container, Row } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';

function Product() {
  return (
    <Container fluid>
      <Container fluid className="px-0 secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Products</h1>
          </Col>
        </Row>
      </Container>
      <ProductCards page={1} pageSize={20} />
    </Container>
  );
}

export default Product;
