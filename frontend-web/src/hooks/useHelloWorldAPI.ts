import { useState, useEffect } from 'react';

function useHelloWorldAPI() {
  const [helloWorldText, setHelloWorldText] = useState('');

  useEffect(() => {
    fetch('/api/HelloWorld') // Doplniť URL adresu
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setHelloWorldText(data.message))
      .catch(() => {
        setHelloWorldText('Failed to connect to BE');
      });
  }, []);

  return helloWorldText;
}

export default useHelloWorldAPI;
