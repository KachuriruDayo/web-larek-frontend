import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasket } from '../../types';
import { EventEmitter } from '../base/Events';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.articles = [];
	}

	set articles(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
			this._list.textContent = '';
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
