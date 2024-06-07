
import { Api } from './base/api';
import {
	IOrderResult,
	ICardItem,
	IOrder
} from '../types';


interface ILarekAPI {
	getProductList: () => Promise<ICardItem[]>;
	getProductItem: (id: string) => Promise<ICardItem>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

type ApiListResponse<Type> = {
	total: number;
	items: Type[];
	};

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<ICardItem[]> {
		return this.get('/product').then((data: ApiListResponse<ICardItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<ICardItem> {
		return this.get(`/product/${id}`).then((item: ICardItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
