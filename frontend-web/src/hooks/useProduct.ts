import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ProductApiParams,
  ProductApiResponse,
  ProductsApiParams,
  ProductsApiResponse,
} from '../types/productTypes';

// Funkcia na volanie API pre získanie listu produktov
export function GetListOfProducts(params: ProductsApiParams) {
  const [response, setResponse] = useState<ProductsApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListOfProducts() {
      try {
        const apiResponse = await axios.get<ProductsApiResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/product`,
          { params }
        );

        if (apiResponse.status !== 200) {
          throw new Error(apiResponse.statusText);
        }

        setResponse(apiResponse.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      }
    }

    fetchListOfProducts();
  }, [params]);

  return { response, errorMessage };
}

// Funkcia na volanie API pre získanie produktu na základe jeho ID
export function GetProductById(params: ProductApiParams) {
  const [product, setProduct] = useState<ProductApiResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductById() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/product/${params.id}`
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        const data = response.data as ProductApiResponse;
        setProduct(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      }
    }
    fetchProductById();
  }, [params]);

  return { product, errorMessage };
}
