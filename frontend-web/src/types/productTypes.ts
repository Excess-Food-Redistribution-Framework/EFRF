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
  page: number;
  pageSize: number;
  notExpired?: boolean;
  onlyAvailable?: boolean;
  organizationId?: string;
  foodRequestId?: string;
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
  availableQuantity: number;
  type: ProductType;
  expirationDate: string;
  organization: OrganizationApiResponse;
}

// -----------------------------------------------------------------------------------------

// Definícia props pre volanie funkcie(komponentu) ProductCards
export interface ProductCardsProps {
  params: ProductsApiParams;
  pagination: boolean;
}

export interface ProductUpdateApiParams {
  id: string;
  name: string;
  quantity: number;
  type: ProductType;
  expirationDate: string;
  organization: OrganizationApiResponse;
}
