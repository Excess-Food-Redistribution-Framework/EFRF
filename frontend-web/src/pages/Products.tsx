import { useState } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';

function Products() {
  const page = 1;
  const pageSize = 5;
  const [showDisabled, setShowDisabled] = useState<boolean>(true);
  const isPagination = true;

  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Products</h1>
          </Col>
        </Row>
      </Container>
      <Container className="pt-4 px-5 justify-content-end">
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch-disabled"
            label="Disabled"
            checked={showDisabled}
            onChange={() => {
              setShowDisabled(!showDisabled);
            }}
          />
        </Form>
      </Container>
      <ProductCards
        params={{
          page,
          pageSize,
          onlyAvailable: !showDisabled,
          notExpired: !showDisabled,
        }}
        pagination={isPagination}
      />
    </Container>
  );
}

export default Products;
