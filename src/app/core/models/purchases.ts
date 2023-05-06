import { DtSheetProduct } from "./sheet-product";

export class ReqPurchase {
    branchPurchaseList: ReqPurchaseItem[];
    prePurchaseId?: number;
    purchaseTransaction: {
        branch: {
            id: number;
        },
        wh: {
            id: number;
        },
        supplier: {
            id: number;
        },
        deliveryOrderNo: string;
    }
}

export class ReqPurchaseItem {
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

export class RespPurchase {
    id: number;
    title: string;
    tsServer: number;
    totalCost: number;
    isApproved: boolean;
    supplierId: number;
    supplierTitle: string;
    purchaseOrderno: string;
    whId: number;
    whTitle: string;
    deliveryOrderno: string;
    poNumber: string;
    isOpen: boolean;
    isPrePurchaseApproved: boolean;
    countNumber: string;
    docCount: number;
}

export class RespPurchaseList {
    transactionList: RespPurchase[];
    prePurchaseTransactions?: RespPurchase[];
    count: number;
}

export class RespCountList {
    whCountTransaction?: RespPurchase[];
    count: number;
}
export class RespBranchCountList {
    branchCountTransaction?: RespPurchase[];
    count: number;
}

export class RespPurchaseItem {
    id?: number;
    title: string;
    retailPrice?: number;
    cost: number;
    quantity: number;
    quantityApproved?: number;
    quantityHistory?: number[];
    lastQuantity?: number | string;
    libraryItemId: number;
    price: number;
    whId?: number;
    pricingStrat?: number;
    pricingStrategyTitle?: string;
    itemCost?: number;
    itemQuantity?: number;
    weightedCost?: number;
    whCost?: number;
    statusId?: number;
    totalQuantity?: number;
    unapprovedQuantity?: number;
    whQuantity?: number;
    comment?: string;
    reasonId?: number;
    reasonTitle?: string;
}

export class CountItem {
    id?: number;
    title: string;
    retailPrice?: number;
    quantity: number;
    libraryItemId: number;
}

export class ReqWarehousePurchase {
    whPurchaseList: ReqWarehousePurchaseItem[];
    prePurchaseId?: number;
    whTransaction: {
        wh: {
            id: number;
        },
        supplier: {
            id: number;
        },
        purchaseOrderNo: string;
    }
}

export class ReqWarehouseCount {
    id?: number;
    whCount: DtSheetProduct[];
    whId: number;
    countNumber: string;
}

export class ReqBranchCount {
    id?: number;
    branchCount: DtSheetProduct[];
    branchId: number;
    countNumber: string;
}
export class ReqWarehousePurchaseItem {
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


export class BranchPrepurchaseListResponse {
    branchPrePurchaseTransaction: BranchPrepurchaseResponse[];
    count: number;
}

export class BranchPrepurchaseResponse {
    id: number;
    tsServer: number;
    isOpen: boolean;
    isPrePurchaseApproved: boolean;
    poNumber: string;
}

export class DisputeReasonResponse {
    id: number;
    code: string;
    name: string;
    isComment: boolean;
    sequence: number;
}