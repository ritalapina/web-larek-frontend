import { Component } from './base/сomponent';
import { ICard, IActions } from '../types';
import { ensureElement } from '../utils/utils';


const categoryTypes: { [key: string]: string } = {
'софт-скил':'card__category_softSkill',
'хард-скил': 'card__category_hardSkill',
кнопка: 'card__category_button',
дополнительное: 'card__category_additional',
другое: 'card__category_other',
};

/** Класс для управления отображением информации о продукте, наследуется от класса Component*/

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement | null;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement | null;
	protected _category?: HTMLElement | null;
	protected _index?: HTMLElement;
	protected _buttonTitle: string;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._index = container.querySelector('.basket__item-index');
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	disablePriceButton(value: number | null) {
        if (!value) {
            if (this._button) {
                this.setDisabled(this._button, true); 
            }
        }
    }

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
        this.setText(
            this._price,
            value ? `${value.toString()} синапсов` : 'Бесценно'
        );
        this.setDisabled(this._button, !value); 
    }

	get price(): number {
		return Number(this._price.textContent || '');
	}

	set category(value: string) {
        this.setText(this._category, value); 
		this.toggleClass(this._category, categoryTypes[value],true);
    }

	get category(): string {
		return this._category.textContent || '';
	}

	set index(value: string) {
        this.setText(this._index, value);
    }

	get index(): string {
		return this._index.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set buttonTitle(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
}
