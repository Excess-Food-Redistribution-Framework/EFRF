import axios from 'axios';
import { useEffect, useState } from 'react';
import { Product } from '../types/productTypes';

export function GetListOfProducts(pageSize: number) {
  const [listOfProducts, setListOfProducts] = useState<[]>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListOfProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/product`
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        const { data } = response;
        // Obmedziť zoznam produktov na veľkosť pageSize
        const limitedList = data.slice(0, pageSize);
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
  }, [pageSize]);

  return { listOfProducts, errorMessage };
}

export function GetProductById(productId: string) {
  const [product, setProduct] = useState<Product>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductById() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        const data = response.data as Product;
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
  }, [productId]);

  return { product, errorMessage };
}
