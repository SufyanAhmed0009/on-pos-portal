export class RespDashboardFinance {
    gmvDay: string;
    gmvWeek: string;
    gmvMonth: string;
    profitMonth: string;
    countTotalOrdersDay: string;
    countInQueueNew: string;
    countReady: string;
    countDispatch: string;
    countDelivered: string;
    itemSoldToday: string;
    cosg: string;
    netProfit: string;
    avgInvCost: string;
    avgInvCount: string;
    resLsit: null
}

export class DailySales {
    enablers: BranchWiseDailySales[];
}

export class BranchWiseDailySales {
    branchId: number;
    branchTitle: string;
    date: number;
    sales: number;
    profit: number;
    inventoryCapital: number;
    beginningInventory: number;
    closingInventory: number;
    purchasing: number;
    corrections: number;
    payable: number;
    childDate?: Date;
    correctionList?:[{comment?:string,costBefore?:number,quantity?:number,currentQuantity?:number}]
    commentList?:string[];
    dosId?:number[];
}