import { Button, Col, Container, Row } from 'react-bootstrap';
import useHelloWorldAPI from '../hooks/useHelloWorldAPI';

function HomePage() {
  const { helloWorldText, errorMessage } = useHelloWorldAPI();
  if (errorMessage) {
    return (
      <Container fluid className="px-0">
        <div className="secondary_color">
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
        </div>

        <Container>
          <p>Error: {errorMessage}</p>
        </Container>
      </Container>
    );
  }
  return (
    <Container fluid className="px-0">
      <div className="secondary_color">
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
      </div>

      <Container>
        <h1>Connection test with BE by API call</h1>
        <p>{helloWorldText}</p>
      </Container>
    </Container>
  );
}

export default HomePage;
