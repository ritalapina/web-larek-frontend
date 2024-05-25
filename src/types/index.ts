//Типы данных

//Состояние приложения
export interface IAppData {
    basket: IBasket[];
    cardsList: ICard[];
    preview: string | null;
    order: IOrder | null;
  }

//Главная страница
export interface IPage {
    list: HTMLElement[];
}

//Просмотр товара
export interface ICard {
    _id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
  }
  
  //Данные заказа

  export interface IOrder {
    payment: boolean;
    address: string;
    email: string;
    phone: string;
    cardsId: string[];
  }

//Оформления доставки товара
export interface IDeliverForm {
    address: string; 
    payment: string; 
}

//Интерфейс корзины с товаров
export interface IBasket {
    quantity: number;
    title: string;
    price: number;
    totalPrice: number;
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

//Модальное окно Контакты
export interface IContactForm {
    email: string; 
    phone: string; 
}

//Успешное оформление заказа
export interface IOrderSuccess {
    id: string; 
    count: number; 
}




