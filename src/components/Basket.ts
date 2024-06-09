import { Component } from './base/сomponent';
import { createElement, ensureElement } from './../utils/utils';
import { IBasket } from '../types';
import { EventEmitter } from './base/events';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

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

		this.items = [];
		this.setDisabled(this._button, true);
	}

	toggleButton(isDisabled: boolean) {
		this._button.disabled = isDisabled; 
	}

	set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            const emptyMessage = createElement<HTMLParagraphElement>('p');
            this.setText(emptyMessage, 'Корзина пуста');
            this._list.replaceChildren(emptyMessage);
            this.setDisabled(this._button, true);
        }
    }

	set total(total: number) {
		this.setText(this._total, `${total.toString()} синапсов`);
	}
}
