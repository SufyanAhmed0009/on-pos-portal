export class ReqInvoiceItem {
    item: {
        id: number;
    };
    branch: {
        id: number;
    };
    quantity: number;
    cost: number;
    pricingStrategy: {
        id: number;
    };
    price?: number;
}

export class RespInvoice {
    id: number;
    title: string;
    tsServer: number;
    totalCost: number;
    isApproved: boolean;
    customerId: number;
    customerTitle: string;
    invoiceNo: string;
    whId: number;
    whTitle: string;
}

export class RespInvoiceList {
    transactionList: RespInvoice[];
    count: number;
}

export class RespInvoiceItem {
    id: number;
    title: string;
    retailPrice: number;
    cost: number;
    quantity: number;
    quantityApproved: number;
    quantityHistory: number[];
    lastQuantity: number | string;
    libraryItemId: number;
    price: number;
    whId: number;
    pricingStrat: number;
    pricingStrategyTitle: string;
    itemCost: number;
    itemQuantity: number;
    weightedCost: number;
}

export class ReqWarehouseInvoice {
    whInvoiceList: ReqWarehouseInvoiceItem[];
    whInvoiceTransaction: {
        wh: {
            id: number;
        },
        customer: {
            id: number;
        },
        invoiceNo: string;
    }
}

export class ReqWarehouseInvoiceItem {
    item: {
        id: number;
    };
    wh: {
        id: number;
    };
    quantity: number;
    cost: number;
    pricingStrategy: {
        id: number;
    };
    price?: number;
}
