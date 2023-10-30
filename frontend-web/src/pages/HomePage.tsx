import { Container } from 'react-bootstrap';
import useHelloWorldAPI from '../hooks/useHelloWorldAPI';

function HomePage() {
  const { helloWorldText, error } = useHelloWorldAPI();
  if (error) {
    return (
      <Container>
        <p>Error: {error}</p>
      </Container>
    );
  }else{
  return (
    <Container>
      <h1>Connection test with BE by API call</h1>
      <p>{helloWorldText}</p>
    </Container>
  );
  }
}

export default HomePage;
