//Типы данных

//Состояние приложения
export interface IAppData {
    catalog: IProduct[]; 
    basket: IProduct[]; 
    order: IOrder | null; 
  }

//Главная страница
export interface IPage {
    list: HTMLElement[]; 
}

//Просмотр товара
export interface IProduct {
    id: string; 
    category: string; 
    title: string; 
    description: string; 
    image: string; 
    price: number | null; 
}

//Оформления доставки товара
export interface IDeliverForm {
    address: string; 
    payment: string; 
}

//Корзина товаров
export interface IBasket {
    items: HTMLElement[];
    price: number; 
    totalPrice: number;
}

//Модальное окно Контакты
export interface IContactForm {
    email: string; 
    phone: string; 
}

//Заказ товара
export interface IOrder extends IDeliverForm, IContactForm {
    items: string[]; 
    total: number; 
}





