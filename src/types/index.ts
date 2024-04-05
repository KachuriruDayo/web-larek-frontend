export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IShopAPI {
	getArticleList: () => Promise<IArticle[]>;
	orderArticles: (order: IOrderData) => Promise<IOrderResult>;
}

interface IArticleData {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IArticle extends IArticleData {
	index: number;
	inBusket: boolean;
}

export interface IBasket {
	articles: HTMLElement[];
	total: number;
}

export interface IAppState {
	catalog: IArticle[];
	basket: string[];
	preview: string | null;
	order: IOrderData | null;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IOrderResult {
	total: number;
	id: string;
}

export interface IOrderData extends IOrderForm {
	total: number;
	items: string[];
}
