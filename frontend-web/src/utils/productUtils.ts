import { ProductApiResponse, ProductType } from '../types/productTypes';

// Funkcia na kontrolu či je produkt vypredaný
export function isProductSoldOut(product: ProductApiResponse): boolean {
  return product.availableQuantity === 0;
}

// Funkcia na kontrolu dátumu expirácie produktu
export function isProductExpired(product: ProductApiResponse): boolean {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const expirationDate = new Date(product.expirationDate);
  expirationDate.setHours(0, 0, 0, 0);

  return currentDate > expirationDate;
}

// Funkcia na získanie správneho obrázku pre daný typ produktu
// Potrebný rozmer obrázku 800x600 + možnosť stiahnúť obrázky a pridať ich do assetov
export function getProductImage(params: ProductType) {
  switch (params) {
    case ProductType.FreshProduce:
      return '/assets/img/FreshProduce.jpg';
    case ProductType.CannedGoods:
      return '/assets/img/CannedGoods.jpg';
    case ProductType.DairyProducts:
      return '/assets/img/DairyProducts.jpg';
    case ProductType.BakeryItems:
      return '/assets/img/BakeryItems.jpg';
    case ProductType.MeatAndPoultry:
      return '/assets/img/MeatAndPoultry.jpg';
    case ProductType.FrozenFoods:
      return '/assets/img/FrozenFoods.jpg';
    case ProductType.NonPerishables:
      return '/assets/img/NonPerishables.jpg';

    default:
      return '/assets/img/other.jpg';
  }
}

export function getProductStatusClass(product: ProductApiResponse) {
  if (isProductSoldOut(product)) {
    return 'sold-out';
  }
  if (isProductExpired(product)) {
    return 'expired';
  }
  return 'available';
}

export default [isProductSoldOut, isProductExpired, getProductImage];
