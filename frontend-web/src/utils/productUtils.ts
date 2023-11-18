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
    case ProductType.BakeryItems:
      return 'https://hicaps.com.ph/wp-content/uploads/2022/12/bakery-products.jpg';
    case ProductType.FreshProduce:
      return 'https://www.heart.org/-/media/Images/News/2019/April-2019/0429SustainableFoodSystem_SC.jpg';
    case ProductType.CannedGoods:
      return 'https://www.lacademie.com/wp-content/uploads/2022/05/canned-food.jpg';
    default:
      return 'https://i.pinimg.com/originals/4b/9c/77/4b9c7794eacda24d38fe00ce664b8fac.jpg';
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
