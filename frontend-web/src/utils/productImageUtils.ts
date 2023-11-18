import { ProductType } from '../types/productTypes';

// Potrebný rozmer obrázku 800x600
// Možnosť stiahnúť obrázky a pridať ich do assetov

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

export default getProductImage;
