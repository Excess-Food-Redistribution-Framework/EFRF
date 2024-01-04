import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
  Pagination,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetListOfProducts } from '../hooks/useProduct';
import {
  getProductImage,
  isProductSoldOut,
  isProductExpired,
  getProductStatusClass,
} from '../utils/productUtils';
import { useAuth } from '../AuthProvider';
import {
  ProductApiResponse,
  ProductCardsProps,
  ProductType,
  ProductsApiParams,
} from '../types/productTypes';
import generatePaginationItems from '../utils/paginationUtils';

function ProductCards({
  params,
  isPagination,
  isFilter,
  isOwnOrgProducts,
}: ProductCardsProps) {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [props, setProps] = useState<ProductsApiParams>({
    names: '',
    types: Object.values(ProductType),
    ...params,
  });
  const [showModal, setShowModal] = useState(false);
  const { response, errorMessage } = GetListOfProducts(props);

  const [sortOption, setSortOption] = useState('expirationDateAsc');
  const [dropdownTitle, setDropdownTitle] = useState('Sort by: Valid To ▲');

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    const newTitle = `Sort by: ${
      newSortOption.includes('expiration') ? 'Valid To' : 'Distance'
    } ${newSortOption.includes('Asc') ? ' ▲ ' : ' ▼ '}`;

    setDropdownTitle(newTitle);

    // setProps({
    // ...props,
    // sortOption: newSortOption,
    // sortDirection: newSortDirection,
    // page: 1,
    // });
  };

  const handlePaginationClick = (pageNumber: number) => {
    setProps({ ...props, page: pageNumber });
  };

  const handleTypeChange = (type: ProductType) => {
    setProps((prevProps) => {
      const updatedTypes = prevProps.types ? [...prevProps.types] : [];

      if (updatedTypes.includes(type)) {
        // Zabezpečte, aby zostal aspoň jeden checkbox zaškrtnutý
        if (updatedTypes.length > 1) {
          const index = updatedTypes.indexOf(type);
          updatedTypes.splice(index, 1);
        }
      } else {
        updatedTypes.push(type);
      }

      return {
        ...prevProps,
        types: updatedTypes,
        page: 1,
      };
    });
  };

  const handleOtherChange = (key: string, value: number | string | boolean) => {
    setProps({
      ...props,
      [key]: value,
      page: 1,
    });
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

  return (
    <Container onSubmit={(e) => e.preventDefault()} className="p-4">
      {isFilter && (
        <Container className="pb-4 d-flex justify-content-between align-items-center">
          <Form className="d-flex justify-content-between align-items-center w-100">
            <Form.Check
              type="switch"
              id="custom-switch-disabled"
              label="Expired"
              checked={!props.notExpired}
              onChange={(e) =>
                handleOtherChange('notExpired', !e.target.checked)
              }
            />
            <Form.Control
              type="text"
              placeholder="Search"
              className="mx-3"
              value={props.names || ''}
              onChange={(e) => handleOtherChange('names', e.target.value)}
            />
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Filters
            </Button>
          </Form>
        </Container>
      )}
      {/* Modálne okno */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Typy jedla */}
            <Form.Group controlId="formTypes">
              <Form.Label>Food Types</Form.Label>
              {Object.values(ProductType).map((type) => (
                <Form.Check
                  key={type}
                  type="checkbox"
                  label={type}
                  checked={(props.types || []).includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
              ))}
            </Form.Group>

            {/* Minimálny valid to dátum */}
            <Form.Group controlId="formMinValidTo">
              <Form.Label className="mt-2 mb-0">Minimal Valid To</Form.Label>
              <Form.Control
                type="date"
                value={props.minExpirationDate}
                onChange={(e) =>
                  handleOtherChange('minExpirationDate', e.target.value)
                }
              />
            </Form.Group>

            {/* Minimálne množstvo */}
            <Form.Group controlId="formMinQuantity">
              <Form.Label className="mt-2 mb-0">Min Quantity</Form.Label>
              <Form.Control
                type="number"
                value={props.minQuantity}
                onChange={(e) =>
                  handleOtherChange('minQuantity', e.target.value)
                }
              />
            </Form.Group>

            {/* Minimálne množstvo */}
            <Form.Group controlId="formMinRating">
              <Form.Label className="mt-2 mb-0">Min Rating</Form.Label>
              <Form.Control
                type="number"
                value={props.minRating}
                onChange={(e) => handleOtherChange('minRating', e.target.value)}
              />
            </Form.Group>

            {/* Filtrovanie podľa vzdialenosti */}
            <Form.Group controlId="formDistanceFilter">
              <Form.Label className="mt-2 mb-0">
                Distance Filter (km)
              </Form.Label>
              <Form.Control
                type="number"
                value={props.maxDistanceKm}
                onChange={(e) =>
                  handleOtherChange('maxDistanceKm', e.target.value)
                }
                disabled={!isAuth() || (isAuth() && isOwnOrgProducts)}
              />
            </Form.Group>

            <DropdownButton
              variant="primary"
              title={dropdownTitle}
              className="mt-4"
              onClick={() => setShowModal(true)}
            >
              <Dropdown.Item
                onClick={() => handleSortChange('expirationDateAsc')}
              >
                Valid To ▲
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSortChange('expirationDateDesc')}
              >
                Valid To ▼
              </Dropdown.Item>
              <Dropdown.Item
                disabled={!isAuth() || (isAuth() && isOwnOrgProducts)}
                onClick={() => handleSortChange('distanceAsc')}
              >
                Distance ▲
              </Dropdown.Item>
              <Dropdown.Item
                disabled={!isAuth() || (isAuth() && isOwnOrgProducts)}
                onClick={() => handleSortChange('distanceDesc')}
              >
                Distance ▼
              </Dropdown.Item>
            </DropdownButton>
          </Form>
        </Modal.Body>
      </Modal>

      {response.data.length === 0 ? (
        <Container className="mt-4">
          <h2 className="text-center">No products</h2>
        </Container>
      ) : (
        <>
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
                    <Badge
                      pill
                      bg="danger"
                      className="product-card-status-label"
                    >
                      <h6 className="m-0">Sold Out</h6>
                    </Badge>
                  )}
                  {!isProductSoldOut(product) && isProductExpired(product) && (
                    <Badge
                      pill
                      bg="warning"
                      className="product-card-status-label"
                    >
                      <h6 className="m-0">Expired</h6>
                    </Badge>
                  )}
                  {!isProductExpired(product) && !isProductSoldOut(product) && (
                    <Badge
                      pill
                      bg="success"
                      className="product-card-status-label"
                    >
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
                    <Card.Title className="pt-2 fw-bold">
                      {product.name}
                    </Card.Title>
                    <Card.Text className="">
                      Short description of product
                    </Card.Text>
                    <Row>
                      <Col className="d-flex align-items-baseline">
                        <Card.Subtitle className="d-flex justify-content-center px-2">
                          Valid To:
                        </Card.Subtitle>
                        <Card.Text>
                          {new Date(product.expirationDate).toLocaleDateString(
                            'sk-SK'
                          )}
                        </Card.Text>
                      </Col>
                    </Row>
                    {isAuth() && (
                      <Row>
                        <Col className="d-flex align-items-baseline">
                          <Card.Subtitle className="d-flex justify-content-center px-2">
                            Distance:
                          </Card.Subtitle>
                          <Card.Text>
                            {Number.isInteger(product.distance)
                              ? product.distance
                              : product.distance.toFixed(2)}{' '}
                            km
                          </Card.Text>
                        </Col>
                      </Row>
                    )}
                    <Row className="py-2">
                      <Col>
                        <Card.Subtitle className="d-flex justify-content-center">
                          Quantity
                        </Card.Subtitle>
                      </Col>
                      <Col className="col-12">
                        <ProgressBar className="m-2">
                          <ProgressBar
                            variant="primary"
                            animated
                            min={0}
                            max={product.quantity}
                            now={product.availableQuantity}
                            label={
                              product.availableQuantity >=
                              0.05 * product.quantity
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
                                ? `${
                                    product.quantity - product.availableQuantity
                                  }`
                                : ''
                            }
                            key={2}
                          />
                        </ProgressBar>
                      </Col>
                      <Col className="d-flex justify-content-center align-items-baseline">
                        <Card.Subtitle className="px-1">
                          Available:
                        </Card.Subtitle>
                        <Card.Text className="">
                          {product.availableQuantity}
                        </Card.Text>
                      </Col>
                      <Col className="d-flex justify-content-center align-items-baseline">
                        <Card.Subtitle className="px-1">Total:</Card.Subtitle>
                        <Card.Text className="">{product.quantity}</Card.Text>
                      </Col>
                    </Row>
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
          {isPagination && (
            <Pagination className="my-5 justify-content-center">
              {generatePaginationItems(
                response.page,
                response.count,
                response.pageSize,
                handlePaginationClick
              )}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}
export default ProductCards;
