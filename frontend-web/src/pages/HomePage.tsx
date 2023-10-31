import { Container } from 'react-bootstrap';
import useHelloWorldAPI from '../hooks/useHelloWorldAPI';

function HomePage() {
  const { helloWorldText, errorMessage } = useHelloWorldAPI();
  if (errorMessage) {
    return (
      <Container>
        <p>Error: {errorMessage}</p>
      </Container>
    );
  }
  return (
    <Container>
      <h1>Connection test with BE by API call</h1>
      <p>{helloWorldText}</p>
    </Container>
  );
}

export default HomePage;
