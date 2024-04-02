import {Api} from './base/api';
import {IorderData, IShopAPI} from "../types/index";

export class ShopAPI extends Api implements IShopAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getArticleList(): Promise<object> {
    return this.get('/product/')
  }

  getArticleItem(id: string): Promise<object> {
    return this.get(`/product/${id}`)
  }

  orderArticles(order: IorderData): Promise<object> {
    return this.post('/order', order)
  }
}