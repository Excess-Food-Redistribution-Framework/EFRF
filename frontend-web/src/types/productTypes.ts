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

export interface Product {
  id: string;
  name: string;
  quantity: number;
  type: ProductType;
  expirationDate: string;
}

// Pre parametre komponentu articlesCards
export type ProductCardsProps = {
  page: number;
  pageSize: number;
};
