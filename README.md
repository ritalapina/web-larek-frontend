# Проектная работа "Веб-ларек"

ссылка на проект:
https://github.com/ritalapina/web-larek-frontend

**1. Используемый стек: HTML, SCSS, TS, Webpack**

### Об архитектуре

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и они меняют значения в моделях.

В приложении использован паттерн Model-View-Presenter.

В этом паттерне основное разделение происходит на три компонента:

1. Модель (Model): Представляет данные и логику приложения. Включает в себя методы для работы с данными и бизнес-логику приложения.

2. Представление (View): Отвечает за отображение данных пользователю. Это элементы пользовательского интерфейса.

3. Презентер (Presenter): Связующее звено между Моделью и Представлением. Презентер получает данные от Модели, обрабатывает их, и передает в Представление для отображения.

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
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

**2. Описание классов и их предназначение.**


#### Класс EventEmitter

Класс EventEmitter позволяет объектам генерировать события, которые могут быть прослушаны другими объектами, подписанными на эти события.

Методы:

- on(eventName: EventName, callback: (event: T) => void) - установить обработчик на событие;
- off(eventName: EventName, callback: Subscriber) - снять обработчик с события;
- emit(eventName: string, data?: T) - инициировать событие с данными;
- onAll(callback: (event: EmitterEvent) => void) - слушать все события;
- offAll() - сбросить все обработчики;
- trigger(eventName: string, context?: Partial<T>) - сделать коллбек триггер, генерирующий событие при вызове;

#### Класс API

Класс API для выполнения HTTP-запросов на сервер.

Свойства:

- readonly baseUrl: string - неизменяемое свойство, URL основного API;
- protected options: RequestInit - защищенное свойство, дополнительные параметры для HTTP-запросов;

Конструктор:

- baseUrl: string - URL основного API;
- options: RequestInit = {} - дополнительные параметры для HTTP-запросов;

Методы:

- protected handleResponse(response: Response): Promise<object> - защищеный метод, обрабатывает полученный ответ от сервера. Если ответ положительный (response.ok), он возвращает содержимое ответа в виде JSON. В противном случае, он возвращает содержимое ошибки из JSON-ответа;
- get(uri: string) - отправляет запрос с данными и возвращает ответ сервера;
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - выполняет post запрос на сервер;

#### Класс Model

Абстрактный класс, представляет собой базовую модель данных. Функции этого класса заключаются в получении данных и событий, для уведомления изменений данных.

Конструктор:
-constructor(data: Partial, protected events: IEvents) - конструктор принимает данные модели и объект событий, копирует данные в модель.

Методы:
-emitChanges(event: string, payload?: object) - уведомляет о изменении модели;

#### Класс Component

Класс Component обеспечивает работу с DOM. Его функции - устанавливать данные в компонентах и отображать их.

Методы
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключить класс
- setText(element: HTMLElement, value: string) - установить текстовое содержимое
- setDisabled(element: HTMLElement, state: boolean) - сменить статус блокировки
- setHidden(element: HTMLElement) - скрыть компонент
- setVisible(element: HTMLElement) - показать компонент
- setImage(element: HTMLImageElement, src: string, alt?: string) - установить изображение с альтернативным текстом
- render(data?: Partial<T>) - вернуть корневой DOM-элемент

#### Класс AppData

Отвечает за храниение данных и выполнение операций. Реализация Model.

Свойства:
- catalog: ICard[] - данные о товаре;
- basket: ICard[] = [] - данные о товаре в корзине;
- order: IOrder = {} - данные о заказе;
- preview: string | null - идентификационный номер товара;
- formErrors: FormErrors = {} - ошибки полей формы;

Конструктор:
- constructor() - конструктор наследуется от класса Model

Методы:
- addBasket() - добавляет выбранный товар в корзину;
- clearBasket() - очищает корзину товаров;
- getTotal() - возвращает общую стоимость выбранных товаров;
- setCatalog() - устанавливает каталог товаров;
- setPreview() - устанавливает предпросмотр товара;
- setOrderField() - устанавливает значение поля в форме заказа;
- removeBasket() - удаляет товар из корзины;
- updateBasket() - обновляет состояние корзины;
- validateOrder() - проверяет корректность данных в форме заказа;
- resetFormData() - очищает данные формы заказа;

#### Класс Modal

Класс для работы с модальными окнами. Наследуется от класса Component (реализация View). Класс используется для управления состоянием (открыт, закрыт) и отображением компонента модального окна

Свойства:
- protected \_closeButton: HTMLButtonElement - кнопка закрытия модального окна.;
- protected \_content: HTMLElement - контент модального окна;

Конструктор:
- constructor(selector: string, events: IEvents) - конструктор принимает селектор по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициализации событий.

Методы:
- set content(value: HTMLElement) - устанавливает контент для модального окна;
- open() - открывает модальное окно;
- close() - закрывает модальное окно;
- render(data: IModalData): HTMLElement - рендерит модальное окно с переданным контентом;

#### Класс Basket

Предназначен для реализации модального окна корзины покупок. Наследуется от класса Component.

Свойства:

- protected \_list: HTMLElement - элемент, содержащий список товаров в корзине;
- protected \_total: HTMLElement - элемент, отображающий общую стоимость товаров в корзине;
- protected \_button: HTMLElement - элемент, представляющий кнопку действия (например, "Оформить заказ");

Конструктор:
- constructor(container: HTMLElement, protected events: EventEmitter) - принимает корневой элемент для корзины и объект событий;


Методы:
- set items(items: HTMLElement[]) - устанавливает список товаров в корзине. Если список пуст, вместо него отображается сообщение "Корзина пуста";
- set selected(items: string[]) - устанавливает выбранные товары. Если товары выбраны, кнопка действия становится активной, иначе - неактивной;
- set total(total: number) - устанавливает общую стоимость товаров в корзине

#### Класс Form

Предназначен для реализации модального окна с формой ввода данных пользователя при доставке и заполнении контактов. Наследуется от класса Component.

Свойства:
- protected \_submit: HTMLButtonElement - кнопка отправки формы;
- protected \_errors: HTMLElement - элемент для отображения ошибок ввода;


Конструктор:
- constructor(protected container: HTMLFormElement, protected events: IEvents) - принимает контейнер с элементами формы, объект событий, используемый для всех полей ввода и кнопки отправки формы;

Методы:
- protected onInputChange(field: keyof T, value: string) - вызывается при изменении значения поля ввода и отправляет событие с измененным значением;
- set valid(value: boolean) - устанавливает состояние валидности формы. Если форма не валидна, кнопка отправки формы становится неактивной;
- set errors(value: string) - устанавливает текст ошибок ввода в элемент \_errors;
- render(state: Partial<T> & IFormState) - рендерит форму с переданными данными и состоянием валидности;

#### Класс SuccessForm

Класс предназначен для работы с окном успешного оформления заказа. Класс используется для управления отображением данных о товаре в модальном окна успешного оформления заказа. Наследуется от класса Component.

Конструктор:
- constructor(container: HTMLElement) - принимает HTML-элемент и объект событий для обработки действий пользователя - в данном случае успешного оформления заказа.


Методы:
- set count(value: number): void - количество товаров;


#### Класс ContactForm

Класс предназначен для отображения формы Контакты, наследуется от класса Form. Класс используется для управления отображением данных (телефон, почта) в компоненте формы заполнения данных пользователя.

Конструктор:
-constructor(container: HTMLFormElement, events: IEvents) - принимает HTML-элемент и объект событий для обработки действий пользователя - в данном случае для ввода номера телефона.

Методы:

- set phone(value: string): void - установка номера телефона;
- set email(value: string): void - установка почты;

#### Класс DeliverForm

Класс предназначен для управления отображением формы оформления доставки. Наследуется от класса Form. Класс используется для управления отображением данных (адрес) в компоненте формы заполнения данных пользователя

Конструктор:
- constructor(container: HTMLFormElement, events: IEvents)- принимает HTML-элемент и и объект событий для обработки действий пользователя;

Методы:
- set address(value: string): void - установка адреса заказа;
  

#### Класс Order

Расширяет класс Form, предназначен для реализации модального окна заказа товара.

Свойства:
- \_offlinePay:HTMLElement - элемент, представляющий кнопку оплаты при получении;
- \_onlinePay:HTMLElement - элемент, представляющий кнопку оплаты онлайн;
  

Конструктор:
- constructor(container: HTMLFormElement, events: IEvents) - принимает элементы способа оплаты, форму доставки и контактных данных пользователя, объект событий;
  

Методы:
- set payment(value: boolean) - выбор сособа оплаты;
- set address(value: string) - устанавливает адресс пользователя;
- set email(value: string) - устанавливает электронную почту пользователя;
- set phone(value: string) - устанавливает номер телефона пользователя;

#### Класс Card

Класс используется для управления отображением данных в компоненте карточки товара. Наследуется от класса Component.

Свойства:
- \_category - элемент, представляющий категорию товара;
- \_title - элемент, представляющий название товара;
- \_description - элемент, представляющий описание товара;
- \_image - элемент, представляющий изображение товар;
- \_button - элемент, представляющий кнопку карточки;
- \_price - элемент, представляющий цену товара;

Конструктор:
- constructor(container: HTMLElement, actions?: ICardActions) - принимает контейнер для карточки и объект действий. В конструкторе устанавливаются обработчики событий для категории, заголовка, изображения, описания, кнопки, цены.

Методы:
- set id(value: string) - устанавливает идентификатор товара;
- set category(value: string) - устанавливает категорию товара и добавляет соответствующий класс к элементу категории;
- set title(value: string) - устанавливает название товара;
- set description(value: string) - устанавливает описание карточки;
- set image(value: string) - устанавливает изображение карточки;
- set price(value: number | null) - устанавливает цену карточки;
- inBasket(value: boolean) - устанавливает, находится ли карточка в корзине, и, если нет, отключает кнопку карточки.
- 

**3. Основные типы/интерфейсы проекта**
Интерфейс данных приложения

```
export interface IAppData {
  basket: IBasket[];
  cardsList: ICard[];
  preview: string | null;
  order: IOrder | null;
}
```

Интерфейс главной страницы

```
export interface IPage {
    list: HTMLElement[];
}
```

Данные карточки товара

```
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```

Данные заказа

```
export interface IOrder {
  payment: boolean;
  address: string;
  email: string;
  phone: string;
  cardsId: string[];
}
```

Интрерфейс корзины с товарами

```
export interface IBasket {
  quantity: number;
  title: string;
  price: number;
  totalPrice: number;
}
```

Интерфейс модального окна

```
export interface IModal {
    content: HTMLElement;
}
```

Модальное окно Контакты

```
export interface IContactForm {
    email: string;
    phone: string;
}
```

Вадидация формы

```
interface IFormValidation {
  valid: boolean;
  errors: string[];
}
```

Интерфейс успешное оформление заказа

```
export interface IOrderSuccess {
id: string;
count: number;
}
```
