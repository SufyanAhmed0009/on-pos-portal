export class DtSheetProduct {
    id?: number;
    retailPrice?: number;
    libraryItemId?: number;
    title: string;
    cost?: number;
    quantity: number;
    price?: number;
    pricingStrategy?: number;
    state?: string;
    itemCost?: number;
    itemQuantity?: number;
    highPrice?: boolean = false;
    lowPrice?: boolean = false;
    whCost?: number;
    statusId?: number;
    status?: {
        id: number;
        title?: string;
        code?: string;
    }
    totalQuantity?: number;
    unapprovedQuantity?: number;
    whQuantity?: number;
    comment?: string;
    reasonId?: number;
    reasonTitle?: string;

}

export class ParamDtSheetProduct {
    id?: number;
    libraryItemId?: number;
    title: string;
    cost?: number;
    quantity: number;
    price?: number;
    pricingStrategy?: number;
    state?: string;
    itemCost?: number;
    itemQuantity?: number;
    whCost?: number;
}

export class ReqSheetUpload {
    branchId: number;
    whId: number;
    products: DtSheetProduct[];
    branchPurchaseId?: number;
    deliveryOrderNo: string;
}

export class ReqWarehouseSheetUpload {
    whId: number;
    products: DtSheetProduct[];
    whPurchaseId?: number;
    whInvoiceId?: number;
    purchaseOrderNo?: string;
    countNumber?: string;
    supplier?: {
        id: number;
    }
    invoiceNo?: string;
    customer?: {
        id: number;
    }
    poNumber?: string;
}

export class ParamReqWarehouseSheetUpload {
    whId: number;
    products: ParamDtSheetProduct[];
    whPurchaseId?: number;
    whInvoiceId?: number;
    purchaseOrderNo?: string;
    countNumber?: string;
    supplier?: {
        id: number;
    }
    invoiceNo?: string;
    customer?: {
        id: number;
    }
    poNumber?: string;
}

export class ReqStoreSheetUpload {
    branchId: number;
    branchProducts: DtSheetProduct[];
    branchPurchaseId?: number;
    branchInvoiceId?: number;
    purchaseOrderNo?: string;
    supplier?: {
        id: number;
    }
    invoiceNo?: string;
    customer?: {
        id: number;
    }
    poNumber?: string;
    countNumber?: string;
}