import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Pagination,
    ProgressBar,
    Row,
    Spinner,
  } from 'react-bootstrap';
  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { GetListOfProducts } from '../hooks/useProduct';
  import '../styles/FoodRequestStyle.css';
  import {
    getProductImage,
    isProductSoldOut,
    isProductExpired,
    getProductStatusClass,
  } from '../utils/productUtils';
  import { useAuth } from '../AuthProvider';
  import { ProductApiResponse, ProductCardsProps } from '../types/productTypes';
  import generatePaginationItems from '../utils/paginationUtils';
  interface PickProductCardsProps extends ProductCardsProps {
    onToggleProduct?: (productId: string) => void;
    onQuantityChange?: (productId: string, quantity: number) => void;
    buttonText: string;
  }
  function PickProductCards({ params, isPagination, onToggleProduct, onQuantityChange, buttonText }: PickProductCardsProps) {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const [props, setProps] = useState(params);
    const { response, errorMessage } = GetListOfProducts(props);
    const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
    useEffect(() => {
      setProps(params);
    }, [params]);
  
    const handlePaginationClick = (pageNumber: number) => {
      setProps({ ...props, page: pageNumber });
    };
    const handleToggleProduct = (productId: string) => {
        if (onToggleProduct) {
          onToggleProduct(productId);
    
          if (selectedProductIds.includes(productId)) {
            setSelectedProductIds((prevIds) => prevIds.filter((id) => id !== productId));
          } else {
            setSelectedProductIds((prevIds) => [...prevIds, productId]);
          }
        }
      };
  
      const handleSliderChange = (productId: string, quantity: number, availableQuantity: number) => {
        const newQuantity = Math.min(quantity, availableQuantity);
        
        setSelectedQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: newQuantity,
        }));
    
        if (onQuantityChange) {
          onQuantityChange(productId, newQuantity);
        }
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
   // console.log(response.data);
    if (response.data.length === 0) {
      return (
        <Container className="p-4 text-center">
          <h2>No products</h2>
        </Container>
      );
    }
  
    return (
      <Container className="p-4">
        <Row xs={1} md={2} lg={2} className="g-4 justify-content-left">
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
                  <Badge pill bg="danger" className="product-card-status-label ">
                    <h6 className="m-0">Sold Out</h6>
                  </Badge>
                )}
                {isProductExpired(product) && (
                  <Badge
                    pill
                    bg="warning"
                    className="product-card-status-label-expired"
                  >
                    <h6 className="m-0">Expired</h6>
                  </Badge>
                )}
                {!isProductExpired(product) && !isProductSoldOut(product) && (
                  <Badge pill bg="success" className="product-card-status-label">
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
                  <Card.Title className="pt-2 fw-bold">{product.name}</Card.Title>
                  <Card.Text className="">Short description of product</Card.Text>
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
                  <Row className="py-2">
                    <Col>
                      <Card.Subtitle className="d-flex justify-content-center">
                        Quantity
                      </Card.Subtitle>
                    </Col>
                    <Col className="col-12">
                      <input
                        type="range"
                        min="1"
                        max={product.quantity}
                        value={selectedQuantities[product.id] || 1}
                        onChange={(e) => handleSliderChange(product.id, parseInt(e.target.value, 10), product.availableQuantity)}
                      />
                    </Col>
                    <Col className="d-flex justify-content-center align-items-baseline">
                        <Card.Subtitle className="px-1">Selected:</Card.Subtitle>
                        <Card.Text className="">
                            {selectedQuantities[product.id] || 1}
                        </Card.Text>
                    </Col>
                    <Row/>
                    <Row className="py-2">
                    <Col className="d-flex justify-content-center align-items-baseline">
                        <Card.Subtitle className="px-1">Available:</Card.Subtitle>
                        <Card.Text className="">{product.availableQuantity}</Card.Text>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-baseline">
                        <Card.Subtitle className="px-1">Total:</Card.Subtitle>
                        <Card.Text className="">{product.quantity}</Card.Text>
                    </Col>
                    </Row>
                  </Row>
                  <ProgressBar className="m-2">
                    <ProgressBar
                      variant="primary"
                      animated
                      min={0}
                      max={product.quantity}
                      now={selectedQuantities[product.id] || 1}
                      label={
                        (selectedQuantities[product.id] || 1) >= 0.05 * product.quantity
                          ? `${selectedQuantities[product.id] || 1}`
                          : ''
                      }
                      key={1}
                    />
                    <ProgressBar
                      variant="secondary"
                      animated
                      min={0}
                      max={product.quantity}
                      now={product.quantity - (selectedQuantities[product.id] || 1)}
                      label={
                        product.quantity - (selectedQuantities[product.id] || 1) >= 0.05 * product.quantity
                          ? `${product.quantity - (selectedQuantities[product.id] || 1)}`
                          : ''
                      }
                      key={2}
                    />
                  </ProgressBar>
                  <Button onClick={() => handleToggleProduct(product.id)}>
        {selectedProductIds.includes(product.id) ? buttonText : buttonText}
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
      </Container>
    );
  }
  
  export default PickProductCards;
  