// src/components/BlogList.tsx
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
// import { ArticleIdResponse } from '../types/apiTypes';
// import useArticleApi from '../hooks/useArticleApi';

import data from '../data/facts.json';

function Blog() {
  // const { allArticles, errorMessage } = useArticleApi();
  const articles = data.content;

  /* if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <Container>
      <h1>Blog</h1>
      <Row>
        {allArticles.map((article: ArticleIdResponse) => (
          <Col key={article.id} xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.content}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
} */

  return (
    <Container>
      <h1>{data.title}</h1>
      <Row className="g-4">
        {articles.map((article, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Col key={index} xs={12}>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img variant="top" src="/assets/img/example.jpg" />
                </Col>
                <Col md={8}>
                  <Card.Body className="d-flex flex-column justify-content-between h-100">
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      <Card.Title className="text-center">
                        {article.text}
                      </Card.Title>
                    </div>
                    <Button
                      href={article['source-url']}
                      rel="noopener noreferrer"
                      style={{ width: '100%' }}
                    >
                      Read Source Article
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Blog;
