import { useState, useEffect } from 'react';
import { HelloWorldResponse } from '../types/apiTypes';
import { useAuth } from '../AuthProvider'; 

function useHelloWorldAPI() {
  const [helloWorldText, setHelloWorldText] = useState('Trying to connect...');
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth(); 

  useEffect(() => {
    fetch('https://frf-api.azurewebsites.net/api/HelloWorld', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
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
        setError(error.message);
      });
  }, [token]);

  return { helloWorldText, error };
}

export default useHelloWorldAPI;
