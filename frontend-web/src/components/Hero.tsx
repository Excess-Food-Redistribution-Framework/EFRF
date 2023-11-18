import { Badge, Button, Col, Container, Image, Row } from 'react-bootstrap';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import ArticlesCards from "./ArticlesCards";

function Hero() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const handleClickButton = (path: string) => {
    navigate(`./${path}`);
  };
  return (
    <Container fluid className="secondary_color">
      <Row className="justify-content-evenly diagonal-bg mh-400px p-5">
        <Col xl="5" className="justify-content-center d-flex">
          <Image src="/assets/img/hero.svg" className="img-fluid p-4 pb-0" />
        </Col>
        <Col
          xl="3"
          className="text-center d-flex flex-column justify-content-center py-5"
        >
          <h5 className="text-white text-shadow pb-2 text-decoration-underline">
            Give away unused Food
          </h5>
          <h1 className="text-white text-shadow pb-2">
            Helping each other can make world better
          </h1>
          <p className="text-white text-shadow pb-4">
            We Seek out world changers and difference makers around the
            globe,and equip them to fulfill their unique purpose.
          </p>
          {isAuth() ? (
            <Row>
              <Col>
                <Button
                  variant="primary"
                  onClick={() => handleClickButton('profile')}
                >
                  Show Profile
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  onClick={() => handleClickButton('products')}
                >
                  Products
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <Button
                  variant="primary"
                  onClick={() => handleClickButton('login')}
                >
                  Login
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  onClick={() => handleClickButton('registration')}
                >
                  Registration
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
export default Hero;
