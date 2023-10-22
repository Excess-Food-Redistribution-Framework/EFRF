import { Container } from 'react-bootstrap';
import useHelloWorldAPI from '../hooks/useHelloWorldAPI';

function HomePage() {
  const helloWorldText = useHelloWorldAPI();

  return (
    <Container>
      <h1>Connection test with BE by API call</h1>
      <p>{helloWorldText}</p>
    </Container>
  );
}

export default HomePage;
