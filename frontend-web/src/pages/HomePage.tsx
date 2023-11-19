import { Container } from 'react-bootstrap';
import ArticlesCards from '../components/ArticlesCards';
import ProductCards from '../components/ProductCards';
import Hero from '../components/Hero';

function HomePage() {
  // ----- ArticleCards Values -----
  const pageArticles = 1;
  const pageSizeArticles = 3;
  const paginationArticles = false;

  // ----- ProductCards Values -----
  const pageProducts = 1;
  const pageSizeProducts = 8;
  const onlyAvailableProducts = true;
  const paginationProducts = false;

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
          <ArticlesCards
            params={{ page: pageArticles, pageSize: pageSizeArticles }}
            pagination={paginationArticles}
          />
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
          <ProductCards
            params={{
              page: pageProducts,
              pageSize: pageSizeProducts,
              onlyAvailable: onlyAvailableProducts,
              notExpired: !onlyAvailableProducts,
            }}
            pagination={paginationProducts}
          />
        </Container>
      </Container>
    </Container>
  );
}

export default HomePage;
