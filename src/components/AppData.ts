import { Model } from './base/Model';
import {
	IAppState,
	IOrderData,
	IArticle,
	IOrderForm,
	FormErrors,
} from '../types/index';

export type GalleryChangeEvent = {
	gallery: CatalogItem[];
};

const orderDefault: IOrderData = {
	payment: '',
	address: '',
	email: '',
	phone: '',
	total: 0,
	items: [],
};

export class CatalogItem extends Model<IArticle> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket = false;
}

export class AppState extends Model<IAppState> {
	catalog: CatalogItem[];
	basket: HTMLElement[] = [];
	preview: string | null;
	order: IOrderData = orderDefault;
	formErrors: FormErrors = {};

	setCatalog(items: IArticle[]) {
		this.catalog = items.map((item) => new CatalogItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: CatalogItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	toggleBasketArticle(id: string, status: boolean) {
		if (status) {
			this.order.items.push(id);
		} else {
			const index = this.order.items.indexOf(id);
			if (index !== -1) {
				this.order.items.splice(index, 1);
			}
		}
	}

	getBasketArticles(): CatalogItem[] {
		return this.catalog.filter((item) => item.inBasket === true);
	}

	clearBasket() {
		this.catalog.forEach((article) => {
			article.inBasket = false;
		});
	}

	getTotal() {
		return this.getBasketArticles().reduce((sum, item) => sum + item.price, 0);
	}

	cleanInputs() {
		this.order.address = '';
		this.order.payment = '';
		this.order.phone = '';
		this.order.email = '';
	}

	cleanOrder() {
		this.order = orderDefault;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (field !== 'address' && field !== 'payment') {
			if (this.validateOrder()) this.events.emit('order:ready', this.order);
		} else {
			if (this.validateContacts()) this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) errors.email = 'Необходимо указать email';
		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment)
			errors.payment = 'Необходимо указать способ оплаты';
		if (!this.order.address) errors.address = 'Необходимо указать адрес';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
