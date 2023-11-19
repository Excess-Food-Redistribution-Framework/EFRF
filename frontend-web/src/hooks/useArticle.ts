import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ArticlesApiParams,
  ArticlesApiResponse,
  ArticleApiResponse,
} from '../types/articleTypes';

// Funkcia pre volanie API na získanie listu articlov
export function GetListOfArticles(params: ArticlesApiParams) {
  const [listOfArticles, setListOfArticles] = useState<ArticlesApiResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListOfArticles() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/article`,
          {
            params,
          }
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        const data = response.data as ArticlesApiResponse;
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
  }, [params]);

  return { listOfArticles, errorMessage };
}

// Funkcia pre volanie API na získanie articlu na základe jeho ID
export function GetArticleById(articleId: string) {
  const [article, setArticle] = useState<ArticleApiResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticleById() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/article${articleId}`
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        const data = response.data as ArticleApiResponse;
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
