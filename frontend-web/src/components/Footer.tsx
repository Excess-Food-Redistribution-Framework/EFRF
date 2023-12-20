import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-success fixed-bottom">
      <Container>
        <div className="text-center" style={{color: "white"}}>
          <p>&copy; 2023 Excess Food Redistribution Framework</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;