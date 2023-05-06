export class WhPurchaseComparisionListResp {
    purchasedAdditionally : PurchasedAdditionally [];
    nullQuantity: PurchasedAdditionally[];
    fullyMatched: PurchasedAdditionally[];
    notMatched: PurchasedAdditionally[];
    notPurchased: PurchasedAdditionally[];
    count?: number = 0;
    completion?: number = 0;
}


export class PurchasedAdditionally {
    id: number;
    quantity: number;
    libraryItemId: number;
    title: string;
    quantityDifference: number;
    prePurchaseTransaction: null;
}

export class StorePurchaseComparisionListResp {
    purchasedAdditionally : PurchasedAdditionally [];
    nullQuantity: PurchasedAdditionally[];
    fullyMatched: PurchasedAdditionally[];
    notMatched: PurchasedAdditionally[];
    notPurchased: PurchasedAdditionally[];
    count?: number = 0;
    completion?: number = 0;
}
