import { useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import ProductCards from '../components/ProductCards';
import ProductsMap from '../components/ProductsMap';
import { useAuth } from '../AuthProvider';
import RecommendedProductCards from '../components/RecommendedProductCards';

function Products() {
  const [view, setView] = useState<'list' | 'recommended' | 'map'>('list');
  const page = 1;
  const pageSize = 8;
  const isPaginationProducts = true;
  const isFilterProducts = true;
  const showOnlyAvailableProducts = true;
  const pageSizeMap = 100000;
  const { isAuth, userRole } = useAuth();

  const handleViewChange = (newView: 'list' | 'recommended' | 'map') => {
    setView(newView);
  };

  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Products</h1>
            <Row>
              <Col>
                <Button
                  variant={view === 'list' ? 'primary' : 'outline-primary'}
                  onClick={() => handleViewChange('list')}
                  className="m-2"
                >
                  List View
                </Button>
                {isAuth() && userRole === 'Distributor' && (
                  <Button
                    variant={
                      view === 'recommended' ? 'primary' : 'outline-primary'
                    }
                    onClick={() => handleViewChange('recommended')}
                    className="m-2"
                  >
                    Recommended
                  </Button>
                )}
                <Button
                  variant={view === 'map' ? 'primary' : 'outline-primary'}
                  onClick={() => handleViewChange('map')}
                  className="m-2"
                >
                  Map View
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {view === 'list' && (
        <ProductCards
          params={{
            page,
            pageSize,
            notExpired: showOnlyAvailableProducts,
          }}
          isPagination={isPaginationProducts}
          isFilter={isFilterProducts}
        />
      )}
      {view === 'map' &&
        (isAuth() ? (
          <ProductsMap
            params={{
              page,
              pageSize: pageSizeMap,
              maxDistanceKm: 1000,
              notExpired: showOnlyAvailableProducts,
            }}
            zoom={7}
          />
        ) : (
          <ProductsMap
            params={{
              page,
              pageSize: pageSizeMap,
              notExpired: showOnlyAvailableProducts,
            }}
            zoom={7}
          />
        ))}
      {view === 'recommended' && (
        /* <RecommendedProductCards
          params={{
            productListSize: pageSize,
          }}
        /> */
        <ProductCards
          params={{
            page,
            pageSize,
            notExpired: showOnlyAvailableProducts,
          }}
          isPagination={false}
          isFilter={false}
        />
      )}
    </Container>
  );
}
export default Products;
