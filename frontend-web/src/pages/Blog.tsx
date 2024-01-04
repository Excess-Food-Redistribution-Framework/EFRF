import { Col, Container, Row } from 'react-bootstrap';
import ArticlesCards from '../components/ArticlesCards';

function Blog() {
  const page: number = 1;
  const pageSize: number = 9;
  const isPagination = true;

  return (
    <Container fluid className="px-0">
      <Container fluid className="secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Blog</h1>
          </Col>
        </Row>
      </Container>
      <ArticlesCards params={{ page, pageSize }} isPagination={isPagination} />
    </Container>
  );
}

export default Blog;
