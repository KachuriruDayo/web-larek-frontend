import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";
import {IBasket} from "../../types";
import {EventEmitter} from "../base/events";



export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

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
			this.setDisabled(this._button ,false);
    } else { 
      this.setDisabled(this._button ,true);
      this._list.textContent = '';
    }
  }

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }
}