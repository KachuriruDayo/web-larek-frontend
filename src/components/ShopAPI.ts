import { Api } from './base/Api';
import {
	IOrderData,
	IOrderResult,
	IShopAPI,
	IArticle,
	ApiListResponse,
} from '../types/index';

export class ShopAPI extends Api implements IShopAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getArticleList(): Promise<IArticle[]> {
		return this.get('/product/').then((data: ApiListResponse<IArticle>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderArticles(order: IOrderData): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
