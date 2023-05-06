export class RespStoreProductsList {
    branchItems: RespStoreProduct[];
    totalRecords: number;
}

export class RespWarehouseProductsList {
    whItems: RespWarehouseProduct[];
    totalRecords: number;
}

export class RespWarehouseProduct {
    id: number;
    title: string;
    name?: string;
    details?: string;
    barcode: string;
    branchId?: number;
    fileUrl?: string;
    fileName?: string;
    retailPrice: number;
    cost: number;
    price: number;
    discountAmount: number;
    netSalePrice: number;
    quantity: number;
    minQuantity: number;
    maxQuantity: number;
    isSelected?: boolean;
    isAlreadyAdded?: boolean;
    selectedQuantity?: number;
    isEnabled?: boolean;
    status?: {
        id: number;
        code: string;
    };
    inventoryId?: number;
    pricingStrategyId: number;
    verified?: boolean;
}

export class ReqWarehouseProductsUpdateList {
    whItems: {
        item: {
            id?: number;
            price: number;
            quantity: number;
            minQuantity: number;
            maxQuantity: number;
            cost: number;
            discountAmount: number;
            netSalePrice: number;
            barcode?: string;
            metaInventory: {
                id: number;
            },
            pricingStrategy: {
                id: number;
            }
            verified?: boolean;
        }
        libraryItemId?: number;
        statusId?: number;

    }[];
    whId?: number;
}

export class RespStoreProduct {
    id: number;
    title: string;
    name?: string;
    details?: string;
    barcode: string;
    branchId?: number;
    fileUrl?: string;
    fileName?: string;
    retailPrice: number;
    cost: number;
    price: number;
    storeDiscount: number;
    octoberDiscount: number;
    discountAmount: number;
    quantityPerItem: number;
    quantityPerOrder: number;
    netSalePrice: number;
    quantity: number;
    unapprovedQuantity?: number;
    minQuantity: number;
    maxQuantity: number;
    isSelected?: boolean;
    isAlreadyAdded?: boolean;
    selectedQuantity?: number;
    isEnabled?: boolean;
    status?: {
        id: number;
        code: string;
    };
    inventoryId?: number;
    pricingStrategyId: number;
    verified?: boolean;
    whCost?: number;
}

export class ReqStoreProductsUpdateList {
    branchItems: {
        item: {
            id?: number;
            price: number;
            quantity: number;
            minQuantity: number;
            maxQuantity: number;
            cost: number;
            discountAmount: number;
            netSalePrice: number;
            barcode?: string;
            metaInventory: {
                id: number;
            },
            pricingStrategy: {
                id: number;
            }
            verified?: boolean;
        }
        libraryItemId?: number;
        statusId?: number;

    }[];
    branchId?: number;
}

export class DtStoreOfflineProduct {
    barcode: string;
    cost: number;
    discountAmount: number;
    id: number;
    netSalePrice: number;
    price: number;
    quantity: number;
    title: string;
    name: string;
}

export class DtPurchaseProduct {
    id: number;
    name: string;
    barcode: string;
    retailPrice?: number;
    quantity?: number;
    totalQuantity?: number;
    unapprovedQuantity?: number;
    cost?: number;
    price?: number;
    strategyId: number;
    itemCost?: number;
    highCost?: boolean;
    lowCost?: boolean;
    whCost?: number;
}

export class DtWhPurchaseProduct {
    id?: number;
    libraryItemId?: number;
    name: string;
    barcode: string;
    quantity?: number;
    retailPrice?: number;
    cost?: number;
    price?: number;
    strategyId: number;
    itemCost?: number;
    highCost?: boolean;
    lowCost?: boolean;
}


export class ReqPasswordProductUpdateList {
    itemDto: {
        itemId: number;
        price: number;
        cost: number;
        quantity: number;
        netSalePrice: number;
        discountAmount: number;
        comments: string;
        statusId: number;
        verified?: boolean;
        minQuantity?: number;
        maxQuantity?: number;
        strategyId: number;
        storeDiscount?: number;
        onDiscount?: number;
        quantityPerItem?: number;
        quantityPerOrder?: number;
        quantityAmendReasonId?: number;
    }[];

}

export class ReqPasswordProductUpdateExcel {
    itemId: number;
    price: number;
    cost: number;
    netSalePrice: number;
    discountAmount: number;
    storeDiscount: number;
    onDiscount: number;
    comments: string;
    quantityPerItem: number;
    quantityPerOrder: number;
}

export class ReqPasswordWHProductUpdate {
    itemId: number;
    price: number;
    setPrice: boolean;
    cost: number;
    quantity: number;
    quantityAmendReasonId?: number;
    minQuantity?: number;
    maxQuantity?: number;
    strategyId: number;
    netSalePrice: number;
    storeDiscount?: number;
    onDiscount?: number;
    discountAmount: number;
    quantityPerItem?: number;
    quantityPerOrder?: number;
    comments: string;
    statusId: number;
    verified: boolean;
}

export class ReqPasswordProductUpdate {
    itemDto: {
        itemId: number;
        price: number;
        setPrice: boolean;
        cost: number;
        quantity: number;
        quantityAmendReasonId?: number;
        minQuantity?: number;
        maxQuantity?: number;
        strategyId: number;
        netSalePrice: number;
        storeDiscount?: number;
        onDiscount?: number;
        discountAmount: number;
        quantityPerItem?: number;
        quantityPerOrder?: number;
        comments: string;
        statusId: number;
        verified: boolean;
    }[];

}


export class ResponseInventorySummary {
    approvedInventory: number;
    unApprovedInventory: number;
    count: number;
    totalInventoryValueWh: number;
    // whInventory: []
}

export class ModelStoreProductList {
    branchItems: ModelStoreProductResponse[];
    totalRecords: number;
}

export class ModelStoreProductResponse {
    id: number;
    libItemId?: number;
    title: string;
    name?: string;
    details?: string;
    barcode: string;
    branchId?: number;
    fileUrl?: string;
    fileName?: string;
    cost: number;
    price: number;
    discountAmount: number;
    netSalePrice: number;
    quantity: number;
    quantityAvailable?: number;
    quantityTotal?: number;
    isSelected?: boolean;
    isAlreadyAdded?: boolean;
    selectedQuantity?: number;
    isEnabled?: boolean;
    //enabler branch
    isEnabler?: boolean;
    pricingStrategyId: number;
    status?: {
        id: number;
        code: string;
    };
    inventoryId?: number;
    verified?: boolean;
    taxedCost?: number;
    taxedPrice?: number;
}
export class ModelConvertQuantity{

    branchId?: number;
    whId?: number;
	quantity: number;
	libItemId: number;
	id: number;

}

export class AttachFilesResponse {
    id?: number;
    whPurchaseTransaction?: number;
    documentUpload?: {
        id?: number;
        fileName: string;
        fileContent?: string;
        isZipped?: boolean;
    }
}
