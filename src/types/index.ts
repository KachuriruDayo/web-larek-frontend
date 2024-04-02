export interface IShopAPI {
  getArticleList: () => Promise<object>;
  getArticleItem: (id: string) => Promise<object>;
  orderArticles: (order: IorderData) => Promise<object>;
}
export interface Iarticle {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  inBusket: boolean;
}

export interface IBasket {
  articles: HTMLElement[];
  total: number;
}

export interface IAppState {
  catalog: Iarticle[];
  basket: string[];
  preview: string | null;
  order: IorderData | null;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export type FormErrors = Partial<Record<keyof IorderData, string>>;

export interface IOrderResult {
  total: number;
  id: string;
}

export interface IorderData extends IOrderForm{
  total: number;
  items: string[];
}
