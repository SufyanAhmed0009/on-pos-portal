import { DtListMenu } from '../models/menu';

export class MenuConstants {
    public static MENU_LIST: DtListMenu[] = [
        // {
        //     "id": 2, "name": "Finance",
        //     "link": "inventory", "imageClass": "fa fa-dollar", "subMenus": [
        //         { "id": 12, "name": "Summary", "link": "finance/summary" },
        //         { "id": 13, "name": "Sales", "link": "finance/sales" },
        //     ]
        // },
        {
            "id": 37, "name": "Dashboard",
            "link": "finance", "imageClass": "fa fa-bar-chart", "subMenus": [
                { "id": 9, "name": "Sales Summary", "link": "finance/summary" },
                { "id": 10, "name": "Daily Sales Summary", "link": "finance/summary/2" }
            ]
        },
        // {
        //     "id": 100, "name": "Dashboard",
        //     "link": 'finance/sales-summary', "imageClass": "fa fa-bar-chart", "subMenus": []
        // },
        {
            "id": 15, "name": "Library",
            "link": null, "imageClass": "fa fa-list", "subMenus": [
                { "id": 19, "name": "Transfer Products", "link": "inventory/library-products" },
            ]
        },
        {
            "id": 1, "name": "Orders",
            "link": "orders", "imageClass": "fa fa-file", "subMenus": [
                { "id": 5, "name": "Manage Orders", "link": "orders/manage" },
                { "id": 6, "name": "Sales", "link": "orders/sales" },
                { "id": 8, "name": "Order Bikers Report", "link": "orders/rider-report" }
            ]
        },
        {
            "id": 2, "name": "Inventory",
            "link": "inventory", "imageClass": "fa fa-cube", "subMenus": [
                { "id": 7, "name": "Manage Products", "link": "inventory/products" }
            ]
        },
        {
            "id": 49, "name": "Purchases",
            "link": "purchases/manage", "imageClass": "fa fa-money", "subMenus": []
        }
    ];

    public static WAREHOUSE_MENU_LIST: DtListMenu[] = [
        {
            "id": 2, "name": "Warehouse Inventory",
            "link": "inventory", "imageClass": "fa fa-cube", "subMenus": [
                { "id": 7, "name": "Manage Warehouse Products", "link": "inventory/products" }
            ]
        },
        {
            "id": 49, "name": "Warehouse Purchases",
            "link": "purchases", "imageClass": "fa fa-money", "subMenus": [
                { "id": 50, "name": "Manage Warehouse Purchases", "link": "purchases/manage" },
                { "id": 51, "name": "Manage Warehouse Pre-Purchases", "link": "purchases/pre-purchases" },
            ]
        }

        //   {
        //     "id": 49, "name": "Warehouse Purchases",
        //     "link": "purchases/manage", "imageClass": "fa fa-money", "subMenus": []
        // }
    ]
}