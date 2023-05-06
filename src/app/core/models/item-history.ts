export class RespItemHistory {
    id: number ;
    title: string;
    quantity: number;
    cost : number;
    price: number;
    date: Date;
    status: string;
    orderNumber: number;
    orderId : number
}

export class RespItemHistoryList {
    itemHistoryList: RespItemHistory[];
    count: number;
}


export class ReqItemHistory {
    dateTime: Date;
	range?: number;
	id: number;
}
