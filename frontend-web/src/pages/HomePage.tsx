import {Badge, Button, Col, Container, Image, Row} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import ArticlesCards from '../components/ArticlesCards';
import ProductCards from '../components/ProductCards';
import React from "react";

function HomePage() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const handleClickButton = (path: string) => {
    navigate(`./${path}`);
  };
  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-evenly diagonal-bg mh-400px p-5">
          <Col xl="5" className="justify-content-center d-flex">
            <Image src="/assets/img/hero.svg" className="img-fluid p-4 pb-0" />
          </Col>
          <Col
            xl="3"
            className="text-center d-flex flex-column justify-content-center py-5"
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
      <Container className="mt-4">
        <Container>
          <h5 style={{ display: 'inline' }}>Articles</h5>
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
          <h2>Learn How To</h2>
          <h2>Reduce Food Waste</h2>
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
          <h2>And Sign For A Supply</h2>
          <ProductCards page={1} pageSize={8} notExpired={false} notBlocked />
        </Container>
      </Container>
    </Container>
  );
}

export default HomePage;
