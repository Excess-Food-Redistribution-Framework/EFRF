import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { GetArticleById } from '../hooks/useArticle';

function ArticleDetail() {
  const { articleId } = useParams(); // Získanie articleId z URL
  const [loading, setLoading] = useState(true);
  const id: string = articleId || '';
  const { article, errorMessage } = GetArticleById(id);

  useEffect(() => {
    if (article) {
      setLoading(false);
    }
  }, [article]);

  if (loading) {
    return (
      <Container className="p-4 text-center">
        <Spinner animation="border" variant="secondary" />
      </Container>
    );
  }
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
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">{article.title}</h1>
            <h4 className="text-white text-shadow">{article.teaser}</h4>
          </Col>
        </Row>
      </Container>
      <Container dangerouslySetInnerHTML={{ __html: article.content }} />
    </Container>
  );
}

export default ArticleDetail;
