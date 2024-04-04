import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from './base/Events';

export class Order extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				if (container.querySelector('.button_alt-active')) {
					this.toggleClass(
						container.querySelector('.button_alt-active'),
						'button_alt-active'
					);
				}
				button.classList.add('button_alt-active');
				this.payment = button.name;
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		this.events.emit('payment:change', { payment: value });
	}
}

export class Contacts extends Form<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
