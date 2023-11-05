import { Button, Col, Container, Row } from 'react-bootstrap';
import ArticlesCards from '../components/ArticlesCards';
import ProductCards from '../components/ProductCards';

function HomePage() {
  return (
    <Container fluid>
      <Container fluid className="secondary_color px-0">
        <Row className="justify-content-center diagonal-bg mh-400px p-5">
          <Col
            lg="6"
            className="text-center d-flex flex-column justify-content-center"
          >
            <h5 className="text-white text-shadow pb-2">
              Give away unused Food
            </h5>
            <h1 className="text-white text-shadow pb-2">
              Helping each other can make world better
            </h1>
            <p className="text-white text-shadow pb-4">
              We Seek out world changers and difference makers around the
              globe,and equip them to fulfill their unique purpose.
            </p>
            <Row className="">
              <Col>
                <Button variant="secondary" href="./login">
                  Login
                </Button>
              </Col>
              <Col>
                <Button variant="light" href="./registration">
                  Register
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <ArticlesCards page={1} pageSize={3} />
      <Container>
        <h5>Available Food</h5>
        <h2>Find What You Need</h2>
        <h2>And Sign for A Supply</h2>
        <ProductCards page={1} pageSize={4} />
      </Container>
    </Container>
  );
}

export default HomePage;
