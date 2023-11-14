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

export function DeleteProduct(productId: string, onDelete: () => void, onError: (error: string) => void) {
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


export function UpdateProduct(productId: string, updateData: ProductApiResponse, onUpdate: (updatedProduct: ProductApiResponse) => void, onError: (error: string) => void) {
    async function updateProduct() {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`,
          updateData
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        const updatedProduct = response.data as ProductApiResponse;
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