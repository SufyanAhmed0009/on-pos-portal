export class DtPage {
    id?: number;
    whId?: number;
    languageId?: number;
    page: number;
    size: number;
    title?: string;
    date?: string;
    statusId?: number;
    branchId?: number;
    quantity?: number;
    discount?: number;
    dosIds?:number[];
    isApproved?: boolean;
    isHamper?: boolean; 
}

export class DtOrdersPage {
    size: number;
    page: number;
    id: number;
    statusId: number;
    end: string;
    start: string; // Format: "2019-11-08 18:28:04"
    userId: number;
    hqId: number;
    orderBy: string;
    branchId: number;
}

