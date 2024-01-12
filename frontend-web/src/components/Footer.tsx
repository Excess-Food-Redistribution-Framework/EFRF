import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

function Footer() {
  return (
    <Container fluid className="mt-auto secondary_color sticky-bottom">
      <Row className="justify-content-evenly diagonal-bg p-3">
        <Col className="justify-content-center d-flex">
          <h6>&copy; 2023 Excess Food Redistribution Framework</h6>
        </Col>
        <Col
          xl="5"
          className="text-center d-flex flex-column justify-content-center"
        >
          <a
            href="mailto:ExcessFoodRedistributionFramework@gmail.com"
            className="text-white text-shadow pb-2 text-decoration-underline"
          >
            ExcessFoodRedistributionFramework@gmail.com
          </a>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
