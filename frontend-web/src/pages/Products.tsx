import { useState, useEffect } from 'react';
import { Col, Container, Row, Form, Button  } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';
import ProductsMap from '../components/ProductsMap';
import useMap from '../hooks/useMap';

function Products() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const page = 1;
  const pageSize = 5;
  const [showDisabled, setShowDisabled] = useState<boolean>(true);
  const isPagination = true;
  const { organizations } = useMap();

  const handleViewChange = (newView: 'list' | 'map') => {
    setView(newView);
  };

  return (
    <Container fluid className="px-0">
  <Container fluid className="secondary_color">
    <Row className="justify-content-center diagonal-bg p-5">
      <Col className="text-center d-flex flex-column justify-content-center">
        <h1 className="text-white text-shadow pb-2">Products</h1>
        <div>
          <Button
            variant={view === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => handleViewChange('list')}
            className="m-2"
          >
            List View
          </Button>
          <Button
            variant={view === 'map' ? 'primary' : 'outline-primary'}
            onClick={() => handleViewChange('map')}
            className="m-2"
          >
            Map View
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
  {view === 'list' && (
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
      )}

  {view === 'list' ? (
    <ProductCards
      params={{
        page,
        pageSize,
        onlyAvailable: !showDisabled,
        notExpired: !showDisabled,
      }}
      pagination={isPagination}
    />
  ) : (
    <ProductsMap organizations={organizations} />
  )}
  </Container>
  );
}

export default Products;
