import axios from 'axios';
import { useEffect, useState } from 'react';
import { FoodRequestResponse, AddProductToFoodRequest,PostFoodRequestResponse } from '../types/foodRequestTypes';

export function useFoodRequests() {
    const [response, setResponse] = useState<FoodRequestResponse[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFoodRequests() {
      try {
        const response = await axios.get<FoodRequestResponse[]>(
          `${import.meta.env.VITE_API_BASE_URL}/api/FoodRequest`
        );

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        setResponse(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      }
    }

    fetchFoodRequests();
  }, []);
  return { response, errorMessage };
}

export function GetFoodRequestById(foodRequestId: string) {
    const [foodRequest, setFoodRequest] = useState<FoodRequestResponse>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    useEffect(() => {
      async function fetchFoodRequestById() {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/FoodRequest/${foodRequestId}`,
          );
  
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
          const data = response.data as FoodRequestResponse;
          console.log("baka");
          setFoodRequest(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage('An unknown error occurred');
          }
        }
      }
      fetchFoodRequestById();
    }, [foodRequestId]);
  
    return { foodRequest, errorMessage };
  }

  export function DeleteFoodRequest(
    foodRequestId: string,
    onDelete: () => void,
    onError: (error: string) => void
  ) {
    async function deleteFoodRequest() {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/FoodRequest/${foodRequestId}`,
        );
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }


        console.log("del dain");
        onDelete();
      } catch (error: unknown) {
        if (error instanceof Error) {
          onError(error.message);
        } else {
          onError('An unknown error occurred');
        }
      }
    }
  
    deleteFoodRequest();
  }

  export function UpdateFoodRequest(
    foodRequestId: string,
    updateData: FormData,
    onUpdate: (updatedProduct: PostFoodRequestResponse) => void,
    onError: (error: string) => void
  ) {
    async function updateFoodRequest() {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/FoodRequest/${foodRequestId}`,
          updateData,
        );
  
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
  
        const updatedProduct = response.data as PostFoodRequestResponse;
        onUpdate(updatedProduct);
      } catch (error: unknown) {
        if (error instanceof Error) {
          onError(error.message);
        } else {
          onError('An unknown error occurred');
        }
      }
    }
  
    updateFoodRequest();
  }
  
