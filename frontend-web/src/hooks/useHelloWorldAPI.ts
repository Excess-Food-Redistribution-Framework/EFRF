import { useState, useEffect } from 'react';
import { HelloWorldResponse } from '../types/apiTypes';

function useHelloWorldAPI() {
  const [helloWorldText, setHelloWorldText] = useState('Trying to connect...');

  useEffect(() => {
    fetch('https://frf-api.azurewebsites.net/api/HelloWorld')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<HelloWorldResponse>;
      })
      .then((data) => {
        setHelloWorldText(data.message);
      })
      .catch((error) => {
        setHelloWorldText(error);
      });
  }, []);

  return helloWorldText;
}

export default useHelloWorldAPI;
