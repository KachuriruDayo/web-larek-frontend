import {Component} from "./base/component";
import {ensureElement} from "../utils/utils";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

interface ICard<T> {
  price: number;
  category: string;
  title: string;
  description?: string;
  image: string;
  index?: number;
}

interface Category {
  [key: string]: string;
}

class Card<T> extends Component<ICard<T>> {
  protected _category?: HTMLElement;
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _index: HTMLElement;
  categoryObj: Category = {
    'софт-скил': '_soft',
    'хард-скил': '_hard',
    'дополнительное': '_additional',
    'кнопка': '_button',
    'другое': '_other'
  }

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._index = container.querySelector('.basket__item-index');
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__text`);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
      if(this._button) {
        container.removeEventListener('click', actions.onClick);
        this._button.addEventListener('click', actions.onClick);
      }
    }
  }

  set index (index: number) {
    this.setText(this._index, `${index}`);
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set category(value: string) {
    this._category.classList.add(`card__category${this.categoryObj[value]}`);
    this.setText(this._category, value);
  }

  set price(value: number | null ) {
    if (!value) {
      this.setText(this._price, 'Бесценно');
      if (this._button) { 
        this.setDisabled(this._button ,true)
      }
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  toggleButton (status: boolean) {
    if (status) {
      this.setText(this._button, 'Убрать')
    } else {
      this.setText(this._button, 'Купить')
    }
  }
}

export class CatalogArticle extends Card<HTMLElement> {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}
