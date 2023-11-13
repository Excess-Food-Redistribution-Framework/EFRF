import { Organization } from "./organizationType";
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

export interface ListOfProducts {
  data: Product[];
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  type: ProductType;
  expirationDate: string;
  organization: Organization
}

// Pre parametre komponentu ProductCards
export type ProductCardsProps = {
  page: number,
  pageSize: number,
  notExpired: boolean,
  notBlocked: boolean,
  organizationId?: string;
  foodRequestId?: string;
};
