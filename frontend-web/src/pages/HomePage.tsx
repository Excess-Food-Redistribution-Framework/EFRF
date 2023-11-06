import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import ArticlesCards from '../components/ArticlesCards';
import ProductCards from '../components/ProductCards';

function HomePage() {
  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg mh-400px p-5">
          <Col
            lg="6"
            className="text-center d-flex flex-column justify-content-center"
          >
            <h5 className="text-white text-shadow pb-2">
              Give away unused <Badge bg="warning">Food</Badge>
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
                <Button variant="primary" href="./login">
                  Login
                </Button>
              </Col>
              <Col>
                <Button variant="primary" href="./registration">
                  Register
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container>
        <Container className="pt-4">
          <h5 style={{ display: 'inline' }}>Blog</h5>
          <hr
            style={{
              display: 'inline-block',
              border: '1px solid #000',
              margin: 0,
              padding: 0,
              marginLeft: '0.5%',
              width: '5%',
            }}
          />
          <ArticlesCards page={1} pageSize={3} />
        </Container>

        <Container>
          <h5 style={{ display: 'inline' }}>Available Food</h5>
          <hr
            style={{
              display: 'inline-block',
              border: '1px solid #000',
              margin: 0,
              padding: 0,
              marginLeft: '0.5%',
              width: '5%',
            }}
          />
          <h2>Find What You Need</h2>
          <h2>And Sign for A Supply</h2>
          <ProductCards page={1} pageSize={8} />
        </Container>
      </Container>
    </Container>
  );
}

export default HomePage;
