import axios from 'axios';
import { useEffect, useState } from 'react';
import { ListOfArticles } from '../types/articleTypes';

function GetListOfArticles(page: number, pageSize: number) {
  const [listOfArticles, setListOfArticles] = useState<ListOfArticles>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticlesData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/article`,
          {
            params: {
              page,
              pageSize,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        const data = response.data as ListOfArticles;
        setListOfArticles(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      }
    }

    // Zavolajte fetchData() len pri zmene page alebo pageSize
    fetchArticlesData();
  }, [page, pageSize]);

  return { listOfArticles, errorMessage };
}

export default GetListOfArticles;
