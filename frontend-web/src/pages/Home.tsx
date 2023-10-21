import useHelloWorldAPI from '../hooks/useHelloWorldAPI';

export function Home() {
  const helloWorldText = useHelloWorldAPI();

  return (
    <div>
      <h1>Trying to connect with BE by API call</h1>
      <p>{helloWorldText}</p>
    </div>
  );
}

export default Home;
