export interface FoodRequest {
    title: string;
    description: string;
    estPickUpTime: string;
    delivery: DeliveryType;
    organizationId: string;
}
  
export enum DeliveryType {
    ProviderCanDeliver = "ProviderCanDeliver",
    DistributorNeedsToTakeAway = "DistributorNeedsToTakeAway",
    Use3rdPartyDeliveryService = "Use3rdPartyDeliveryService",
}