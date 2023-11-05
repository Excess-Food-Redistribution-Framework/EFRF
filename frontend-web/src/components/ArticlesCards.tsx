import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Article, ArticleCardsProps } from '../types/articleTypes';
import GetListOfArticles from '../hooks/useArticle';

function ArticlesCards({ page, pageSize }: ArticleCardsProps) {
  const { listOfArticles, errorMessage } = GetListOfArticles(page, pageSize);
  if (errorMessage) {
    return (
      <Container className="p-4 text-center">
        <h2>Server error. Failed to get article data!</h2>
      </Container>
    );
  }
  if (!listOfArticles) {
    return (
      <Container className="p-4 text-center">
        <h2>Loading articles...</h2>
      </Container>
    );
  }
  if (listOfArticles.count === 0) {
    return (
      <Container className="p-4">
        <Row xs={1} md={3} className="g-4 justify-content-center">
          {Array.from({ length: pageSize }).map((_, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Col key={idx}>
              <Card className="h-100">
                <Card.Img variant="top" src="https://placehold.co/286x180" />

                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <Card.Title>Article Title</Card.Title>
                  <Card.Text>
                    Description of certain article content in a short text.
                  </Card.Text>
                  <Button
                    as={Link}
                    to="/blog/test"
                    variant="primary"
                    rel="noopener noreferrer"
                    className="mt-auto align-self-start"
                  >
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      /* return (
      <Container className="p-4">
        <h2>Articles section coming soon!</h2>
      </Container> */
    );
  }

  if (listOfArticles.data) {
    return (
      <Container className="p-5">
        <Row xs={1} md={3} className="g-4 justify-content-center">
          {listOfArticles.data.map((article: Article) => (
            <Col key={article.id} className="px-4">
              <Card className="h-100">
                <Card.Img variant="top" src="https://placehold.co/286x180" />

                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>{article.content}</Card.Text>
                  <Button
                    as={Link}
                    to={`/blog/${article.title}`}
                    variant="primary"
                    rel="noopener noreferrer"
                    className="mt-auto align-self-start"
                  >
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}
export default ArticlesCards;
