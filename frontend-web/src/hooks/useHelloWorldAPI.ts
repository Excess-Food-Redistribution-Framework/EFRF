import { useState, useEffect } from 'react';
import { HelloWorldResponse } from '../types/apiTypes';
import { useAuth } from '../AuthProvider';

function useHelloWorldAPI() {
  const [helloWorldText, setHelloWorldText] = useState('Trying to connect...');
  const [errorMessage, setError] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    // TODO: Use axios
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/HelloWorld`, {
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

  return { helloWorldText, errorMessage };
}

export default useHelloWorldAPI;
