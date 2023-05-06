export class RespRiderReport {
    riderId: number;
    riderName: string;
    orderId: number;
    orderAmount: number;
    status: string;
    tsUpd: Date;
}

export class RespRiderReportList {
    riderReportList: RespRiderReport[];
    count: number;
}

export class RiderReport {
    riderId: number;
    riderName: string;
    totalSales: number;
    totalOrders: number;
}

export class OrderRiderReportRequest {
    id: number;
    dateString: string;
}
