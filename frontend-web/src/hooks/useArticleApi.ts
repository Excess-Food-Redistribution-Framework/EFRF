import { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import { ArticleResponse, ArticleIdResponse } from '../types/apiTypes';

function useArticleApi() {
  const { token } = useAuth();
  const [allArticles, setAllArticles] = useState<ArticleIdResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://frf-api.azurewebsites.net/api/article', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<ArticleResponse>;
      })
      .then((data) => {
        setAllArticles(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [token]);

  return { allArticles, errorMessage };
}

export default useArticleApi;
