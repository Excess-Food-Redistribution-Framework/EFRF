import { Container } from 'react-bootstrap';
import React from 'react';
import ArticlesCards from '../components/ArticlesCards';
import ProductCards from '../components/ProductCards';
import Hero from '../components/Hero';

function HomePage() {
  return (
    <Container fluid className="px-0">
      <Hero />

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
