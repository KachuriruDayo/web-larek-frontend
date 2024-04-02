import './scss/styles.scss';
import {ShopAPI} from './components/ShopAPI';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogItem, GalleryChangeEvent} from "./components/AppData";
import {Basket} from './components/common/Basket';
import {Success} from './components/common/Success';
import {Page} from "./components/Page";
import {Order, Contacts} from './components/Order';
import {CatalogArticle} from "./components/Article";
import {Modal} from "./components/common/Modal";
import {ApiListResponse} from './components/base/api';
import {Iarticle, IOrderForm, IOrderResult} from './types';
import {cloneTemplate, ensureElement} from "./utils/utils";

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({eventName, data}) => {
  console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on<GalleryChangeEvent>('items:changed', () => {
  page.gallery = appData.catalog.map(item => {
    const card = new CatalogArticle(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
      
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price
    });
  });

  page.counter = appData.getBasketArticles().length;
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const {email, phone, address, payment} = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
	contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей 
events.on(/^input\..*:change/, (data: {field: keyof IOrderForm, value: string}) => {
	appData.setOrderField(data.field, data.value);
});

events.on('payment:change', (data: {payment: string}) => {
	appData.setOrderField('payment', data.payment);
})

/** открытие окна заказа */
events.on('order:open', () => {
	appData.cleanInputs();
	appData.order.total = appData.getTotal()
  modal.render({
    content: order.render({
      address: '',
      valid: false,
      errors: []
    })
  })
});

/** открытие окна заполнения контактных данных */
events.on('order:submit', () => {
	modal.render({
    content: contacts.render({
			phone: '',
      email: '',
      valid: false,
      errors: []
    })
  })
});

/** открытие окна подтверждения покупки */
events.on('contacts:submit', () => {
	api.orderArticles(appData.order)
		.then((data: IOrderResult) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					appData.clearBasket();
					appData.cleanOrder();
					page.counter = appData.getBasketArticles().length;
					modal.close();
				}
			})

			modal.render({
				content: success.render({
					total: data.total
				})
			})
		})
		.catch(err => {
			console.error(err);
		})
})

// Открыть лот
events.on('card:select', (item: CatalogItem) => {
    appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: CatalogItem) => {
  const showItem = (item: CatalogItem) => {
    const card = new CatalogArticle(cloneTemplate(cardPreviewTemplate), {
      onClick: () =>
			events.emit('card:editbasket', item)
    });

		if (item.inBasket) {
			card.toggleButton(true)
		} else {
			card.toggleButton(false)
		}

  modal.render({
    content: card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price
    })
  })
	}

	if (item) {
    api.getArticleItem(item.id).then((article: Iarticle) => 
			{
				({
					...article,
					image: api.cdn + article.image,
				})

				item.description = article.description;
				showItem(item);
			}
			)
      .catch((err) => {
        console.error(err);
      })
  } else {
    modal.close();
  }
});

/** добавление или удаление товара из корзины внутри окна карточки  */ 
events.on('card:editbasket', (item: CatalogItem) => {
  const card = new CatalogArticle(cloneTemplate(cardBasketTemplate), {
    onClick: () =>
      events.emit('basket:delete', item)
  });
	let basketArticles = appData.getBasketArticles().map((item, index) => {
		return card.render({
			index: index + 1,
			title: item.title,
			price: item.price
		})
	})
	if (!item.inBasket) {
		item.inBasket = true;
		appData.toggleBasketArticle(item.id, true);
		appData.basket = basketArticles;
	} else {
		item.inBasket = false;
		appData.toggleBasketArticle(item.id, false);
    appData.basket = basketArticles;
  }

	events.emit('preview:changed', item);
	page.counter = appData.getBasketArticles().length;
});

events.on('basket:delete', (item: CatalogItem) => {
  item.inBasket = false;
	appData.toggleBasketArticle(item.id, false);
  page.counter = appData.getBasketArticles().length;
  events.emit('basket:open');
})

events.on('basket:open', () => {
  appData.basket = appData.getBasketArticles().map((item, index) => {
    const card = new CatalogArticle(cloneTemplate(cardBasketTemplate), {
      onClick: () =>
        events.emit('basket:delete', item)
      });
		return card.render({
			index: index + 1,
			title: item.title,
			price: item.price
		})
	})
	modal.render({
		content: basket.render({
			articles: appData.basket,
			total: appData.getTotal()
		})
	})
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});


api.getArticleList()
	.then((data: ApiListResponse<Iarticle>) => 
	{const gallery = data.items.map((item) => ({
		...item,
		image: api.cdn + item.image
	}));
	appData.setCatalog(gallery);
	})
  .catch(err => {
    console.error(err);
  });
