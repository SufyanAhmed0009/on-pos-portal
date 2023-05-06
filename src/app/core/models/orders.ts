export class RespOrdersList {
    branchPojo: RespOrder[];
    count: number;
    statusCount: {
        code: string;
        title: string;
        count: number;
        amount: number;
    }[];
    deliveredOrders: number[];
    cancelledOrders: number[];
    callededWorth: number;
    deliveredWorth: number;
}

export class RespOrder {
    id: number;
    userId: number;
    userName: string;
    branchId: number;
    branchTitle: string;
    actualAmount: number;
    addressId: number;
    amountRecieved: number;
    amountRecievedDate: number;
    date: number;
    discountedAmount: number;
    orderItem: string;
    orderNumber: string;
    shippingFees: number;
    status: string;
    takeaway: boolean;
    totalAmount: number;
    walletAmount: number;
    deliveredTime?: string;
    branchTitles: string[];
    franchiseTitle: string;
    walletAmountUsed: number;
    riderId: number;
    placedTime: number;
    tat: number;
    expectedDeliveryTime: string;
    appVersion: string;
    timeLog: {
        placed?: Date;
        expected?: Date;
        delivered?: Date;
    };
    orderStatusLog: {
        code: string;
        tsClient: number;
        tsServerTime: number;
    }[];
    membershipType: {
        id: number;
        title: string;
        code: string;
    }
}

export class RespOrderDetails {
    orderItemList: {
        id: number;
        price: number;
        quantity: number;
        cost: number;
        discount: number;
        netPrice: number;
        itemName: string;
        branchId: number;
        branchTitle: string;
        fileName: string;
        fileUrl: string;
        orderItemId: number;
    }[];
    orderDetails: {
        date: string;
        id: number;
        orderNumber: string;
        actualAmount: number;
        totalAmount: number;
        discountedAmount: number;
        walletAmountUsed: number;
        branchId: number;
        branchTitle: string;
        shippingFees: number;
        userId: number;
        userName: string;
        orderItem: string;
        status: string;
        amountRecieved: number;
        amountRecievedDate: Date;
        walletAmount: number;
        takeaway: boolean;
        isReviewd: boolean;
        riderId?: number;
    };
    customerInfo: {
        id: number;
        phone: string;
        countryInfo: string;
        languageInfo: string;
        user: string;
        title: string;
        address: string;
        flag: string;
        email: string;
        firstName: string;
        lastName: string;
        gender: string;
        otp: string;
        token: string;
    };
    orderItems: number;
    customerOrder: string;
    orderId: number;
    deliveryCharges: number;
    orderItemIds: number;
    amountRecieved: number;
    instructionComment: string;
    feedbacks: {
        id: number;
        title: string;
        feedBack: string;
        score: number;
    }[];
}

export class DtOrdersStatusCount {
    title: string;
    code: string;
    count: number;
    amount: number;
}

export class ReqUpdateOrderStatus {
    languageInfo: {
        code: string;
    };
    timeStamp: string;
    customerOrderId: string;
    branchId: string;
}

export class RespOrdersStatus {
    statusCount: DtOrdersStatusCount[];
    deliveredOrders: number;
	cancelledOrders: number;
	callededWorth: number;
	deliveredWorth: number;
}