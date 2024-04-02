# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# --Базовые компоненты--

### **Класс Component**
Он является базовым компонентом и основой для многих других компонентов. Класс является дженериком и принимает в переменной  T  тип данных. 
Он реализует методы для работы с DOM элементами:
* toggleClass - переключение класса у элемента.
* setText - установка текста в элемент.
* setDisabled - установка или снятие атрибуда `disable` на элементе.
* setImage - установка изображения с альтернативным текстом.
* render - возвращает корневой дом элемент.
Является абстрактным классом.

### **Класс EventEmitter**
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы:
* on - для подписки на событие.
* off - отписки от события.
* emit - уведомления подписчиков о наступлении события. 
Дополнительно реализованы методы  `onAll` и  `offAll`  — для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод  `trigger` , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от класса  EventEmitter .

### **Класс Model**
Данный класс нужен для того, чтобы можно было отличить модель от простых объектов с данными.
Реализует только один метод `emitChanges` (На основе метода `emit` класса EventEmitter) для сообщения всем слушателям об изменении даных в модели.

### **Класс Api**
Базовый класс для создания fetch запросов на сервер и получения ответа.
Имеет один защищенный метод `handleResponse` для получения ответа от сервера и два общих `get` и `post` для получения и отправки данных соответственно.

# --Компоненты модели данных--

### **Класс AppState**
Данный класс наследует класс `Model` и отвечает за хранение и обработку всех данных приложения.
Класс содержит состояния Галлереи товаров, Корзины, Формы заказа и Валидации этой формы.
Реализует методы:
* setCatalog - добавления готовых экземпляров с данными карточек товаров в галлерею.
* setPreview - открытия опреденной карточки в модальном окне просмотра.
* toggleBasketArticle - добавление или удаление товара из корзины.
* getBasketArticles - получение списка товаров находящихся в корзине.
* clearBasket - удаление всех товаров из корзины.
* getTotal - получение общей стоимости всех товаров находящихся в корзине.
* setOrderField - получение значений из полей формы заказа.
* cleanInputs - отчистка полей формы для заказа.
* cleanOrder - обнуление состояния заказа после успешной покупки.
и два метода валидации: `validateOrder` и `validateContacts` для валидации формы заказа и формы обратной связи.

### **Класс CatalogItem**
Данный класс наследует класс `Model` и отвечает за хранение данных конкретного экземпляра товара.

### **Класс ShopAPI**
Данный класс наследует класс `Api` и отвечает за получение данных с сервера. Нужен для удобного получения данных с сервера на основе методов из базового класса Api.
Класс имеет три метода:
* getArticleList - получение массива карточек.
* getArticleItem - получение отдельной карточки по её id.
* orderArticles - отправка данных заказа и получение ответа от сервера.

# --Коипоненты интерфейса и бизнесс логика--
Данные компоненты наследуют базовый класс "Component" и реализуют его методы.

### **Класс Modal**
Выводит модальное окно с нужным наполнением, оно может закрываться как на кнопку так и по клику вне модального окна.

### **Класс Basket**
Является наполнением для модального окна и показывает все товары, находящиеся в корзине. Отслеживает клик по кнопке открытия формы заказа.

### **Класс Page**
Является контейнером для всего контента на странице, так же он отслеживает клик по кнопке корзины для открытия модального окна корзины.

### **Класс Article**
В зависимости от полученных данных меняет: 
* цвет категории товара в зависимости от самой категории.
* цену товара, если цена не указана отображает текст "Бесценно".
* делает кнопку неактивной, если цена отсутствует.
Данный класс реализует три вида карточек, которые используются на странице: 
* Небольшая карточка для галлереи товаров (Отслеживает клик на себе для открытия модального окна большой карточки).
* Подробная карточка для отображения в модальном окне (Отслеживает клик по кнопке для добавления или удаления данного товара из корзины).
* Элемент списка товаров для использования внутри корзины (Отслеживает клик по кнопке для удаления данного товара из корзины).

### **Класс Form**
Является базовым классом для отображения форм и отслеживает все поля конкретной формы для валидации и занесения полученных значений в заказ.

### **Класс Order и Contacts**
Данные классы наследуются от класса `Form` и нужны для отображения в модальном окне шаблона формы. Если одно из полей не заполнено выводится ошибка с описанием, а кнопка блокируется. После того как все поля заполнены по нажатии на кнопку данные заказа отправляется на сервер и выводится окно успешного оформления заказа.

### **Класс Success**
Отображает модальное окно успешного офрмления заказа с суммой заказа. При нажатии на кнопку сохраненные данные заказа в классе `AppData` обнуляются, корзина отчищается и модальное окно закрывается.

# --Список событий--

* `${"имя формы"}:submit` - событие отправки формы.
* `input.${имя поля ввода}:change` - событие ввода значений в форму.
* 'payment:change' - измение способа оплаты в форме.
* 'modal:open' - отрытие модального окна.
* 'modal:close' - закрытие модального окна.
* 'items:changed' - изменение списка товаров в галлерее.
* 'card:select' - карточка выбрана.
* 'preview:changed' - изменение или открытие окна просмотра товара.
* 'formErrors:change' - изменение ошибок формы.
* 'order:open' - открытие формы заказа.
* 'order:ready' - готовность формы.
* 'basket:open' - открытие корзины.
* 'card:editbasket' - добавление или удаление карточки из корзины внутри модального окна карточки.
* 'basket:delete' - удаление карточки из корзины внутри модального окна корзины.


