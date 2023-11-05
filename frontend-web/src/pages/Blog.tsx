import { Col, Container, Row } from 'react-bootstrap';
import ArticlesCards from '../components/ArticlesCards';

function Blog() {
  const page: number = 1;
  const pageSize: number = 9;

  return (
    <Container fluid>
      <Container fluid className="px-0 secondary_color">
        <Row className="justify-content-center diagonal-bg p-5">
          <Col className="text-center d-flex flex-column justify-content-center">
            <h1 className="text-white text-shadow pb-2">Blog</h1>
          </Col>
        </Row>
      </Container>
      <ArticlesCards page={page} pageSize={pageSize} />
    </Container>
  );
}

export default Blog;
