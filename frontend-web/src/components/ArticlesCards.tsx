import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Article, ArticleCardsProps } from '../types/articleTypes';
import { GetListOfArticles } from '../hooks/useArticle';

function ArticlesCards({ page, pageSize }: ArticleCardsProps) {
  const { listOfArticles, errorMessage } = GetListOfArticles(page, pageSize);
  const navigate = useNavigate();

  const handleClickButton = (articleId: string) => {
    navigate(`/blog/${articleId}`);
  };

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
        <h2>Article section is coming soon!</h2>
      </Container>
    );
  }

  if (listOfArticles.data) {
    return (
      <Container className="p-5">
        <Row xs={1} md={3} className="g-4 justify-content-center">
          {listOfArticles.data.map((article: Article) => (
            <Col key={article.id} className="px-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN4x7ayRXH93w1ZWcZeixVtzAdRcunrTI1Pw&usqp=CAU"
                />

                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text className="text-limit">
                    {article.content}
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="mt-auto align-self-start"
                    onClick={() => handleClickButton(article.id)}
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
