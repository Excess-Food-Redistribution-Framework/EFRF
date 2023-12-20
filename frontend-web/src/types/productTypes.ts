// -----------------------------------------------------------------------------------------
// Typy produktov

import { OrganizationApiResponse } from './organizationTypes';

export enum ProductType {
  FreshProduce = 'FreshProduce',
  CannedGoods = 'CannedGoods',
  DairyProducts = 'DairyProducts',
  BakeryItems = 'BakeryItems',
  MeatAndPoultry = 'MeatAndPoultry',
  FrozenFoods = 'FrozenFoods',
  NonPerishables = 'NonPerishable',
  Other = 'Other',
}

// -----------------------------------------------------------------------------------------
// ZÍSKAVANIE LISTU PRODUKTOV
// GET /api/Product

// Definícia pre parametre volania API pre získanie listu produktov
export interface ProductsApiParams {
  page?: number;
  pageSize?: number;
  notExpired?: boolean;
  //onlyAvailable?: boolean;
  organizationIds?: string;
  productIds?: string;
  notProductIds?: string;
  foodRequestIds?: string;
  names?: string;
  types?: ProductType
  minQuantity?: number;
  minExpirationDate?: string;
  maxDistanceKm?: number;
  id?: string
  Latitude?: number;
  Longitude?: number;
}

// Definícia pre očakávanú odpoveď API pre získanie listu produktov
export interface ProductsApiResponse {
  page: number;
  pageSize: number;
  count: number;
  data: ProductApiResponse[];
}

// -----------------------------------------------------------------------------------------
// ZÍSKAVANIE PRODUKTU POMOCOU JEHO ID
// GET /api/Product/{id}

// Definícia parametrov pre volanie API pre získanie jedného produktu pomocou jeho ID
//

// Definícia pre očakávanú odpoveď API pre získanie jedného produktu pomocou jeho ID
export interface ProductApiResponse {
  id: string;
  name: string;
  quantity: number;
  description: string;
  availableQuantity: number;
  ImageUrl: string;
  type: ProductType;
  expirationDate: string;
  organization: OrganizationApiResponse;
}

// -----------------------------------------------------------------------------------------

// Definícia props pre volanie funkcie(komponentu) ProductCards
export interface ProductCardsProps {
  params: ProductsApiParams;
  pagination: boolean;
  onToggleProduct?: (productId: string) => void;
}
export interface ProductMapProps {
  params: ProductsApiParams;
  zoom: number;
}

export interface ProductUpdateApiParams {
  id: string;
  name: string;
  quantity: number;
  description: string;
  type: ProductType;
  expirationDate: string;
  organization: OrganizationApiResponse;
}
