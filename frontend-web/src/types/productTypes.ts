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

// Parametre pre volanie API pre získanie listu produktov
export type ProductsApiParams = {
  page: number;
  pageSize: number;
  organizationId?: string;
  notExpired: boolean;
  notBlocked: boolean;
};

// Očakavaný response po volaní Api pre získanie listu produktov
export interface ProductsApiResponse {
  page: number;
  pageSize: number;
  count: number;
  data: ProductApiResponse[];
}

// -----------------------------------------------------------------------------------------
// ZÍSKAVANIE PRODUKTU POMOCOU JEHO ID
// GET /api/Product/{id}

// Parametre pre volanie API pre získanie jedného produktu pomocou jeho ID
export interface ProductApiResponse {
  id: string;
  name: string;
  quantity: number;
  availableQuantity: number;
  type: ProductType;
  state: string;
  expirationDate: string;
  organization: OrganizationApiResponse;
}

// Očakavaný response po volaní Api pre získanie jedného produktu pomocou jeho ID
export type ProductApiParams = {
  id: string;
};

// -----------------------------------------------------------------------------------------
