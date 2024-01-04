import { ProductApiResponse } from './productTypes';
import { OrganizationApiResponse } from './organizationTypes';

export interface PostFoodRequestResponse {
    title: string;
    description: string;
    estPickUpTime: string;
    delivery: DeliveryType;
    organizationId: string;
}
export interface FoodRequestResponse {
    id: string;
    title: string;
    description: string;
    productPicks: ProductPick[];
    providerId: string;
    distributorId: string;
    delivery: DeliveryType;
    state: FoodRequestState;
    estPickUpTime: string;
    creationTime: string; 
}

export interface AddProductToFoodRequest{
    productId: string;
    foodRequestId: string;
    quantity: number;
}
export interface setState{
    id: string;
    state: FoodRequestState;
}

export enum FoodRequestState {
    NotAccepted = "NotAccepted",
    Preparing = "Preparing",
    Waiting = "Waiting",
    Deliviring = "Deliviring",
    Received = "Received",
    Unknown = "Unknown",
  }

export enum DeliveryType {
    ProviderCanDeliver = "ProviderCanDeliver",
    DistributorNeedsToTakeAway = "DistributorNeedsToTakeAway",
    Use3rdPartyDeliveryService = "Use3rdPartyDeliveryService",
}
export interface ProductPick{
    id: string;
    product: ProductApiResponse; 
    organization?: OrganizationApiResponse | null; 
    quantity: number;
}