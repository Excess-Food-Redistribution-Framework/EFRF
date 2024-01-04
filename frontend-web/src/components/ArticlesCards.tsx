import {
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleApiResponse, ArticleCardsProps } from '../types/articleTypes';
import { GetListOfArticles } from '../hooks/useArticle';
import generatePaginationItems from '../utils/paginationUtils';

function ArticlesCards({ params, isPagination }: ArticleCardsProps) {
  const navigate = useNavigate();

  const { listOfArticles, errorMessage } = GetListOfArticles(params);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleClickButton = (articleId: ArticleApiResponse['id']) => {
    navigate(`/blog/${articleId}`);
  };

  const paginationItems = generatePaginationItems(
    currentPage,
    5,
    5,
    handlePaginationClick
  );

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
        <Spinner animation="border" variant="secondary" />
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
  // TODO replace image and possibly style
  if (listOfArticles.data) {
    return (
      <Container className="p-4">
        <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
          {listOfArticles.data.map((article: ArticleApiResponse) => (
            <Col key={article.id} className="px-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN4x7ayRXH93w1ZWcZeixVtzAdRcunrTI1Pw&usqp=CAU"
                />
                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>{article.teaser}</Card.Text>
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
        {isPagination && (
          <Pagination className="mt-3 justify-content-center">
            {paginationItems}
          </Pagination>
        )}
      </Container>
    );
  }
}
export default ArticlesCards;
