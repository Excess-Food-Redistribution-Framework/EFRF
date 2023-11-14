import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ProductApiParams,
  ProductApiResponse,
  ProductsApiParams,
} from '../types/productTypes';

export function GetListOfProducts(params: ProductsApiParams) {
  const [listOfProducts, setListOfProducts] = useState<[]>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListOfProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/product`,
          { params }
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        const { data } = response.data;

        // Obmedziť zoznam produktov na veľkosť pageSize
        const limitedList = data.slice(0, params.pageSize);
        setListOfProducts(limitedList);
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

  return { listOfProducts, errorMessage };
}

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
