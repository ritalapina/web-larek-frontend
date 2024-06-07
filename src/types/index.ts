
// Типы для реализации базового класса событий
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
}

//Мтоды для работы с событиями в приложении
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

// Интерфейс данных приложения
export interface IAppData {
	catalog: ICardItem[]; 
	basket: ICardItem[]; 
	contact: IContactForm | null; 
	preview: string | null; 
	order: IOrder | null; 
	delivery: IDeliveryForm | null; 
}

// Интерфейс главной страницы
export interface IPage {
	catalog: HTMLElement[]; 
}

// Данные заказа
export interface IOrder extends IDeliveryForm, IContactForm {
	total: number; 
	items: string[]; 
}

// Интерфейс действий в конструкторе
export interface IActions {
	onClick: (event: MouseEvent) => void; 
}

//Интерфейс действий окна успешного оформления заказа
export interface IOrderSuccessActions {
	onClick: () => void; 
}

// Оформления доставки товара
export interface IDeliveryForm {
	address: string;
	payment: string; 	
}

//Модальное окно Контакты
export interface IContactForm {
	email: string; 
	phone: string; 
}

// Данные товара
export interface ICardItem {
	id: string; 
	title: string; 
	description: string; 
	category: string; 
	image: string; 
	price: number | null; 
}

// Данные ответа сервера о заказе
export interface IOrderResult {
	id: string; 
	total: number; 
}

//Интерфейс карточки товара
export interface ICard extends ICardItem {
	index?: string; 
	buttonTitle?: string; 
}

//Интерфейс модального окна
export interface IModal {
	content: HTMLElement; 
}

//Интерфейс окна формы
export interface IForm {
	valid: boolean; 
	errors: string[]; 
}

//Интрерфейс корзины с товарами
export interface IBasket{
	items: HTMLElement[]; 
	title: string;
    price: number;
    totalPrice: number;
}

//Ошибка полей формы
export type FormErrors = Partial<Record<keyof IOrder, string>>; 

//Успешное оформление заказа
export interface IOrderSuccess {
	id: string; 
	count: number; 
}