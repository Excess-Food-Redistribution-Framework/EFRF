import { Col, Container, Row } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import { GetArticleById } from '../hooks/useArticle';

function ArticleDetail() {
  const { articleId } = useParams(); // Získajte articleId zo URL
  const id: string = articleId || '';
  const { article, errorMessage } = GetArticleById(id);

  if (errorMessage) {
    return (
      <Container className="p-4 text-center">
        <h2>Server error. Failed to get article data!</h2>
      </Container>
    );
  }
  if (!article) {
    return <Navigate to="/*" />;
  }

  return (
    <Container fluid>
      <Container fluid className="px-0 secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">{article.title}</h1>
          </Col>
        </Row>
      </Container>
      <Container fluid className="px-0">
        {article.content}
      </Container>
    </Container>
  );
}

export default ArticleDetail;
