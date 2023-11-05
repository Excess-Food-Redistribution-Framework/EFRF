import axios from 'axios';
import { useEffect, useState } from 'react';
import { ListOfArticles, Article } from '../types/articleTypes';

export function GetListOfArticles(page: number, pageSize: number) {
  const [listOfArticles, setListOfArticles] = useState<ListOfArticles>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListOfArticles() {
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

    fetchListOfArticles();
  }, [page, pageSize]);

  return { listOfArticles, errorMessage };
}

export function GetArticleById(articleId: string) {
  const [article, setArticle] = useState<Article>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticleById() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/article/${articleId}`
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        const data = response.data as Article;
        setArticle(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      }
    }
    fetchArticleById();
  }, [articleId]);

  return { article, errorMessage };
}
