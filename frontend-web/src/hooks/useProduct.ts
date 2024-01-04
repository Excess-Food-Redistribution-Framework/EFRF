import axios from 'axios';
import qs from 'qs';
import { useEffect, useState } from 'react';
import {
  ProductApiResponse,
  ProductUpdateApiParams,
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
        const queryString = qs.stringify(params, { arrayFormat: 'indices' });
        const apiResponse = await axios.get<ProductsApiResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/product?${queryString}`
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
export function GetProductById(productId: string) {
  const [product, setProduct] = useState<ProductApiResponse>();
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
  }, [productId]);

  return { product, errorMessage };
}

export function DeleteProduct(
  productId: string,
  onDelete: () => void,
  onError: (error: string) => void
) {
  async function deleteProduct() {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`
      );

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      onDelete();
    } catch (error: unknown) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred');
      }
    }
  }

  deleteProduct();
}

export function UpdateProduct(
  productId: string,
  updateData: FormData,
  onUpdate: (updatedProduct: ProductUpdateApiParams) => void,
  onError: (error: string) => void
) {
  async function updateProduct() {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`,
        updateData
      );

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      const updatedProduct = response.data as ProductUpdateApiParams;
      onUpdate(updatedProduct);
    } catch (error: unknown) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred');
      }
    }
  }

  updateProduct();
}
