import './scss/styles.scss';

import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate,  ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { IContactForm, IDeliveryForm, IOrder, ICardItem } from './types';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { ContactForm } from './components/Order';
import { Success } from './components/SuccessForm';
import { DeliveryForm} from './components/DeliveryForm';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
	onClick: (ev: Event) => events.emit('payment:toggle', ev.target),
});

const contact = new ContactForm(cloneTemplate(contactTemplate), events);

// Изменения в каталоге, создание карточек товаров и отображение на странице
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});


events.on('card:select', (item: ICardItem) => {
	appData.setPreview(item);
});

// Просмотр карточки товара  
events.on('preview:changed', (item: ICardItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('product:toggle', item);
			card.buttonTitle =
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины';
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			category: item.category,
			description: item.description,
			image: item.image,
			price: item.price,
			buttonTitle:
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины',
		}),
	});
});

// Добавление удаление товара из корзины
events.on('product:toggle', (item: ICardItem) => {

	if (appData.basket.indexOf(item) < 0) {
		events.emit('product:add', item);
	} else {
		events.emit('product:delete', item);
	}
});

events.on('product:add', (item: ICardItem) => {
	appData.addToBasket(item);
});

events.on('product:delete', (item: ICardItem) => appData.removeFromBasket(item));

// Изменения списка товаров в корзине 
events.on('basket:changed', (items: ICardItem[]) => {    
    basket.items = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:delete', item);
			},
		});
		return card.render({
			index: (index + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
	const total = items.reduce((total, item) => total + item.price, 0);
	basket.total = total;
	appData.order.total = total;
	basket.toggleButton(total === 0);
});

events.on('counter:changed', (item: string[]) => {
	page.counter = appData.basket.length;
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

//Открытие формы доставки
events.on('order:open', () => {
	modal.render({
		content: delivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appData.order.items = appData.basket.map((item) => item.id);
});

// Смена способа оплаты
const PaymentMethods: { [key: string]: string } = {
	card: 'online',
	cash: 'cash',
};

events.on('payment:toggle', (target: HTMLElement) => {
	if (!target.classList.contains('button_alt-active')) {
		delivery.toggleButtons(target);
		appData.order.payment = PaymentMethods[target.getAttribute('name')];
		console.log(appData.order);
	}
});

// Валидация полей доставки и контактов 
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	delivery.valid = !payment && !address;
	contact.valid = !email && !phone;
	delivery.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменение полей доставки и контактов
events.on(
	/^order\..*:change/,
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setDeliveryField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('delivery:ready', () => {
	delivery.valid = true;
});

events.on('contact:ready', () => {
	contact.valid = true;
});

// Событие перехода к форме контактов
events.on('order:submit', () => {
	modal.render({
		content: contact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Успешное оформление заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			appData.clearBasket();
			appData.clearOrder();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = result.total.toString();

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});


events.on('modal:open', () => {
	page.locked = true;
});


events.on('modal:close', () => {
	page.locked = false;
});

// Получение и отображение товаров с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.log(err);
	});
