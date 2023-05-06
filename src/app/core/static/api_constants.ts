export class ApiConstants {

    /* FOR AUTHENTICATION SERVICE */

    public static _AUTH = {
        GET: {
            REFRESH_TOKEN: "api/refreshtoken"
        },
        POST: {
            LOGIN: "api/branch/signin",
            CHECK_IF_VALID_USERNAME: "api/checkuser",
            CHECK_IF_VALID_STORENAME: "api/checkstorename",
            CHECK_IF_VALID_OTP: "api/accountverification",
            VERIFY_ACCOUNT: "api/accountvalidation",
            FORGOT_PASSWORD: "api/account/resetpassword"
        }
    };

    /* FOR COUNTRIES */

    public static _COUNTRY = {
        GET: {
            COUNTRIES: "api/countries"
        }
    };

    /* FOR CURRENCIES */

    public static _CURRENCY = {
        GET: {
            CURRENCIES: "api/currency"
        }
    };

    /* FOR CUSTOMER SERVICE */

    public static _CUSTOMER = {
        GET: {
            CUSTOMERS_LIST: "api/getusers"
        }
    };

    /* FOR DASHBOARD SERVICE */

    public static _DASHBOARD = {
        GET: {
            HIGHLIGHTS: "api/dashboard/highlights",
            SALES_PER_STORE: "api/dashboard/sales/perstore",
            SALES_PER_MONTH_GRAPH: "api/dashboard/salesorders/permonth",
            AT_A_GLANCE_DATE: "api/dashboard/getconsolidateddata"
        },
        POST: {
            BRANCH_FINANCE: "api/branch/dashboard",
            DAILY_SUMMARY: "api/BranchDailySales"
        }
    };

    /* FOR DISCOUNT COUPON */

    public static _DISCOUNT_COUPON = {
        POST: {
            ADD_COUPON: "api/couponusergroup",
            COUPON_LIST: "api/listdiscountcoupon",
            COUPON_USERS_LIST: "api/listdiscouncouponusers",
            ADD_COUPON_USER: "api/addcouponuser",
            DELETE_COUPON_USER: "api/deletecouponuser",
            COUPON_STORES_LIST: "api/branchcoupon/", // ../COUPON_ID/LANG_ID PAGEABLE
            ASSIGN_COUPON_TO_STORE: "api/applyBranchCoupon/"
        },
        PUT: {
            UPDATE_COUPON: "api/couponusergroup"
        },
        DELETE: {
            REMOVE_STORE: "api/branchcoupon/"
        }
    };

    /* FOR FRANCHISE SERVICE */

    public static _FRANCHISE = {
        GET: {
            FRANCHISE_LIST: "api/gethq",
            FRANCHISE_EMAIL: "api/franchise/emails/"
        },
        POST: {
            FRANCHISE_TRANSACTIONS_LIST: "api/franchisetransactionlist",
            FRANCHISE_CASH: "api/franchisecash",
            FRANCHISE_CONSOLIDATED: "api/getfranchiseconsolidated",
            FRANCHISE_ADD_CASH: "api/franchiseaddcash",
            FRANCHISE_LIST: "api/franchise/list",
            ADD_FRANCHISE: "api/franchise",
            ADD_FRANCHISE_EMAIL: "api/franchise/emails/",
            UPDATE_TRANSACTION_COMMENT: "api/addtransactioncomment"
        },
        PUT: {
            UPDATE_FRANCHISE: "api/franchise",
            UPDATE_FRANCHISE_EMAIL: "api/franchise/emails/"
        }
    };

    /* FOR IMAGE SERVICE */

    public static _IMAGE = {
        POST: {
            UPLOAD_IMAGE: "api/storeimage"
        },
    };

    /* FOR INVENTORY SERVICE */
    public static _INVENTORY = {
        GET: {
            STORE_PRODUCTS_ALL: "api/branchitems/",
            QUANTITY_AMEND_REASON: "api/quantityAmendReason"
        },
        POST: {
            STORE_PRODUCTS_LIST: "api/branchinventory",
            TRANSFER_PRODUCTS: "api/saveitemlist",
            TRANSFER_SINGLE_PRODUCT: "api/branch/item",
            LIBRARY_ITEM_PRODUCTS: "api/getlibraryitembranches",
            STORE_LIBRARY_ITEMS: "api/branch/item/libraryitems",
            UPDATE_PRODUCT_QUANTITY: "api/branch/item/quantity/",
            UPDATE_BRANCH_ITEMS: "api/invoiceItems",
            ITEM_HISTORY_LIST:  "api/dashboard/itemSale",
            ITEM_HISTORY_LIST_DATE:  "api/dashboard/itemSaleByDate",
            UPDATE_BRANCH_PRODUCT: "api/updatePosItem",
            CONVERT_QUANTITY: "api/convertQuantity"
        },
        PUT: {
            UPDATE_STORE_PRODUCTS: "api/saveitemlist"
        }
    };

    /* FOR WAREHOUSE-INVENTORY SERVICE */
    public static _WAREHOUSE_INVENTORY = {
        GET: {
            WAREHOUSE_INVENTORY_SUMMARY: "api/wh/inventorySummary/",
            QUANTITY_AMEND_REASON: "api/quantityAmendReason"
        },
        POST: {
            WAREHOUSE_PRODUCTS_LIST: "api/wh/inventory",
            UPDATE_WAREHOUSE_PRODUCT: "api/wh/updatePosItem",
            DOWNLOAD_WAREHOUSE_INVENTORY: "api/wh/download/inventory.xlsx",
            CONVERT_QUANTITY: "api/wh/convertQuantity"
        },
        PUT: {
            UPDATE_WAREHOUSE_PRODUCTS: "api/wh/saveitemlist"
        }
    };

    /* FOR WAREHOUSE SUPPLIERS */
    public static _WAREHOUSE_SUPPLIERS = {
        GET: {
            SUPPLIERS_LIST: "api/suppliers?supplierName=",
            CUSTOMERS_LIST: "api/customers?customerName="
        }
    }

    /* FOR INVOICES SERVICE */
    public static _INVOICES = {
        POST: {
            SYNC_PENDING_INVOICES: "api/invoicesync",
            INVOICES_LIST: "api/invoicelisting",
            INVOICE_SALES: "api/branchclosing",
            INVOICES_ITEM_SALES: "api/branchinvoicebetween"
        }
    }

    /* FOR LANGUAGE-API SERVICE */
    public static _LANGUAGE_API = {
        POST: {
            TEMS_LIST: "api/language",
            ADD_TERM: "api/addlanguage"
        },
        PUT: {
            UPDATE_TERM: "api/updatelanguage"
        }
    }

    /* FOR LANGUAGE SERVICE */
    public static _LANGUAGE = {
        GET: {
            PACKAGE: "api/ipackage"
        }
    }

    /* FOR LIBRARY_CATEGORY */

    public static _LIBRARY_CATEGORY = {
        POST: {
            CATEGORY_LIST: "api/librarycategories",
            CATEGORIES_ALL: "api/parentlibrarycategory",
            ADD_CATEGORY: "api/librarycategory"
        },
        PUT: {
            UPDATE_CATEGORY: "api/librarycategory"
        },
        GET: {
            DEFAULT_LANGUAGE: "api/librarycategoryLanguage/"
        }
    };

    /* FOR LIBRARY_PRODUCT */

    public static _LIBRARY_PRODUCT = {
        POST: {
            STORE_PRODUCT_REQUESTS: "api/requestedlibraryitems",
            ADMIN_PRODUCT_REQUESTS: "api/approvelibraryitems",
            APP_PRODUCT_REQUEST: "api/requestedproducts",
            PRODUCTS_LIST: "api/libraryitems",
            ENABLED_PRODUCTS_LIST: "api/branch/libraryitems",
            ADD_PRODUCT: "api/libraryitem",
            PRODUCT_TAGS: "api/getkeywords",
            SHEET_UPLOAD: "api/utils/uploadcsv"
        },
        PUT: {
            UPDATE_PRODUCT: "api/libraryitem",
            UPDATE_BRANCH_ITEMS: "api/updatebranchitems"
        },
        DELETE: {
            DELETE_PRODUCT: "api/libraryitem/"
        },
        GET: {
            DEFAULT_LANGUAGE: "api/libraryitemLanguage/",
            BARCODE_SEARCH: "api/searchByBarcode/"
        }
    };


    /* FOR BRANDS */

    public static _BRANDS = {
        POST: {
            BRANDS_LIST: "api/library/brands",
            ADD_BRAND: "api/library/brand"
        },
        PUT: {
            UPDATE_BRAND: "api/library/brand"
        }
    };

    /* FOR MENU SERVICE */
    public static _MENU = {
        GET: {
            MENU_LIST: "api/config/menu",
            ALL_MENUS_LIST: "api/menus/",
            MENU_RIGHTS_BY_ID: "api/menus/profile/"
        },
        PUT: {
            UPDATE_MENU_RIGHTS: "api/menus/profile/"
        }
    }

    /* FOR ORDERS SERVICE */
    public static _ORDERS = {
        GET: {
            CANCELLATION_REASON: 'api/ordercancellation/',
            ORDERS_BY_CUSTOMER_ID: "api/getCustomerOrders/",
            ITEM_BY_ID: "api/itemdetails/",
            BRANCH_ORDERS_HIGHLIGHTS: "api/orders/highlights/branch/"
        },
        POST: {
            ORDERS_LIST: "api/orders",
            BRANCH_ORDERS_LIST: "api/branch/orders",
            ORDER_DETAILS: "api/orderinfo",
            UPDATE_ORDER: "api/ammendcustomerorder",
            UPDATE_ORDER_NEW: "api/ammendcustomerordernew",
            VOICE_ORDERS_LIST: "api/voiceorders",
            VOICE_ORDER_CUSTOMER: "api/voiceorder/customer",
            ORDER_REVIEW: "api/orderdetails",
            PLACE_ORDER: "api/order",
            APP_USERS_LIST: "api/franchiseusers",
            APP_USER_ADDRESSES: "api/referral/appusers/addresses",
            ORDER_REVIEWS_LIST_APPROVED: "api/feedbacks/reviewed/approved",
            ORDER_REVIEWS_LIST_UNAPPROVED: "api/feedbacks/reviewed/unapproved",
            APPROVE_ORDER_REVIEW: "api/feedbacks/reviewed",
            CONFIRM_ORDER: "api/portal/confirmorder",
            ASSIGN_RIDER: "api/portal/changeorderrider",
            MAKE_READY: "api/OrderReadyFromBranch",
            DISPATCH_ORDER: "api/dispatchOrderFromBranch"
        },
        PUT: {
            UPDATE_USER_ADDRESS: "api/referral/appusers/addresses"
        }
    }

    /* FOR REPORTS SERVICE */
    public static _REPORTS = {
        GET: {
            NOT_AVAILABLE_ITEMS_DATA: "api/report/itemsNa",
            VARIANCE_DATA: "api/report/variance",
            COMPOUND_VARIANCE_DATA: "api/report/variance/compound",
            AMENDED_ORDERS: "api/report/ordersammended",
            PRODUCT_PRICES_PER_STORE: "api/report/itemlisting",
            ORDER_RIDER_REPORT: "api/dashboard/orderRiderReport/"
        },
        POST: {
            REPORTS_LIST: "api/reports",
            WALLET_TRANSACTIONS_DATA: "api/report/wallettransactionperday",
            WALLET_PER_TRANSACTIONS_DATA: "api/report/walletpertransactionperday",
            USERS_DATA: "UserReport",
            PROMOTERS_DATA: "PromoterReport",
            ORDER_RIDER_REPORT: "api/dashboard/orderRiderReport"
        }
    }

    /* FOR RIDERS SERVICE */
    public static _RIDERS = {
        GET: {
            TRACKING_LIST: "track/RidersCurrentLocation",
            RIDERS_LIST: "api/selectors/riders/",
            RIDER_BY_ID: "api/riders/"
        },
        POST: {
            ONHOLD_RIDERS_LIST: "api/rider/onholdriders",
            RIDER_DETAILS: "api/rider/riderdetails",
            APPROVE_RIDER: "api/rider/approverider",
            RIDERS_LIST: "api/riders",
            RIDER_ORDERS_LIST: "api/rider/details"
        },
        DELETE: {
            DELETE_RIDER: "api/rider/"
        },
        PUT: {
            UPDATE_FRANCHISE: 'api/rider/franchise'
        }
    }

    /* FOR SALES SERVICE */
    public static _SALES = {
        GET: {
            DAILY_BRANCH_SALES_LIST: "api/dashboard/saleCostDaily/",
            AVAILABLE_INVENTORY: "api/dashboard/availableInHandByBranch/",
            PENDING_ORDERS_SALE: "api/dashboard/saleCostInProcessOrders/"
        },
        POST: {
            TOPFIVE_ITEMS_SALES: "api/dashboard/items/topfive/sale",
            TOPFIVE_CATEGORIES_SALES: "api/dashboard/category/topfive/sale",
            TOPFIVE_ITEMS_QUANTITY: "api/dashboard/items/topfive/quantity",
            TOPFIVE_CATEGORIES_QUANTITY: "api/dashboard/category/topfive/quantity",
            TOPFIVE_ITEMS_SALES_GRAPH: "api/dashboard/items/topfive/salegraph",
            TOPFIVE_ITEMS_QUANTITY_GRAPH: "api/dashboard/items/topfive/quantitygraph",
            TOPFIVE_CATEGORIES_SALES_GRAPH: "api/dashboard/category/topfive/salegraph",
            TOPFIVE_CATEGORIES_QUANTITY_GRAPH: "api/dashboard/category/topfive/quantitygraph",
            ITEMS_SALES_LIST: "api/dashboard/getitemsdashboardtable",
            CATEGORIES_SALES_LIST: "api/dashboard/getcategorydashboardtable"
        }
    }

    /* FOR STATUS SERVICE */
    public static _STATUS = {
        POST: {
            UPDATE_LIBRARY_ITEM_STATUS: "api/updatestatuslibraryitem",
            UPDATE_STORE_STATUS: "api/updatestatusbranch",
            UPDATE_LIBRARY_CATEGORY_STATUS: "api/updatestatuslibrarycategory",
            UPDATE_BRANCH_ITEM_STATUS: "api/updatestatusitem",
            DO_STATUS_LIST: "api/getStatus",
        }
    }

    /* FOR STORES SERVICE */
    public static _STORES = {
        GET: {
            STORES_ALL: "api/branchlist",
            STORE_DELIVERY_CHARGES: "api/branchdeliverycharges/",
            STORE_DELIVERY_CHARGES_PER_KM: "api/branchkmdeliverycharges/",
            STORE_GROUPS_LIST: "api/branchgroup/groups",
            GROUP_STORES_LIST: "api/branchgroup/group/",
            STORE_FRANCHISES_LIST: "api/branch/extension/"
        },
        POST: {
            STORES_LIST: "api/branches",
            ADD_STORE: "api/branch",
            ADD_STORE_WITH_USER: "api/registerbranch",
            STORE_USERS_LIST: "api/branchusers",
            ADD_STORE_USER: "api/branchuser",
            REPLICATE_INVENTORY: "api/replicateinventory",
            FRANCHISE_STORES: "api/storelist",
            STORE_TIMINGS_LIST: "api/branchday",
            UPDATE_STORE_DELIVERY_CHARGES: "api/branchdeliverycharges",
            UPDATE_STORE_DELIVERY_CHARGES_PER_KM: "api/branchkmdeliverycharges",
            ADD_STORE_GROUP: "api/branchgroup/addgroup",
            ASSIGN_GROUP_TO_STORE: "api/branchgroup/addbranchtogroup",
            UPDATE_IS_FIXED: "api/setfixed/",
            ADD_STORE_FRANCHISE: "api/branch/extension"
        },
        PUT: {
            UPDATE_STORE: "api/branch",
            UPDATE_STORE_USER: "api/branchuser",
            UPDATE_STORE_TIMINGS: "api/branchday/",
            UPDATE_STORE_FRANCHISES_LIST: "api/branch/extension"
        },
        DELETE: {
            DELETE_STORE_FRANCHISE: "api/branch/extension/"
        }
    }

    /* FOR SYNC ITEMS SERVICE */
    public static _SYNC_ITEMS = {
        POST: {
            ALL_STORE_ITEMS: "api/getbranchinventorylocalstorage"
        }
    }

    /* FOR USER GROUPS SERVICE */
    public static _USER_GROUPS = {
        GET: {
            USER_GROUPS_ALL: "api/coupongroups"
        },
        POST: {
            ADD_USER_GROUP: "api/usergroup",
            USER_BY_PHONE: "api/fetchuserapp",
            USER_GROUPS_LIST: "api/listusergroup",
            GROUPS_USERS_LIST: "api/listgroupusers",
            ADD_GROUP_USER: "api/addgroupuser",
            REMOVE_GROUP_USER: "api/deletegroupuser"
        }
    }

    /* FOR USERS SERVICE */
    public static _USERS = {
        GET: {
            USER_PROFILES_LIST: "api/menus/usertypes"
        },
        POST: {
            USERS_LIST: "api/getusersportal",
            ADD_USER: "api/registerportaluser",
            SET_PASSWORD: "api/portalaccountvalidation"
        }
    }

    /* FOR PURCHASE SERVICE */
    public static _PURCHASES = {
        GET: {
            // PURCHASE_INFO : "api/branch/purchase/transactions/{id}/{langId}"
            PURCHASE_INFO: "api/branch/purchase/transactions/",
            WH_LIST: "api/wh/getWhs",
            SHOW_TITLE: "api/appConstants/showTitleS/",
            PS_LIST: "api/pricingStrategy/",
            PO_LIST: "api/branch/getPos/",
            PURCHASE_COMPARISION_LIST: "api/branch/purchase/comparison/",
            DISPUTE_REASON_LIST: "disputeReasons"
        },
        POST: {
            ADD_PURCHASE: "api/branch/purchase",
            PURCHASE_LIST: "api/branch/purchase/transactions",
            UPLOAD_SHEET: "api/branch/purchase/excelInvoice",
            CONFIRM_UPLOAD_SHEET: "api/branch/purchase/excelInvoice/approve",
        },
        PUT: {
            UPDATE_INVENTORY: "api/branch/purchase/excelInvoice"
        }
    }

    /* FOR WAREHOUSE PURCHASE SERVICE */
    public static _WAREHOUSE_PURCHASES = {
        GET: {
            PURCHASE_INFO: "api/wh/purchase/transactions/",
            SHOW_TITLE: "api/appConstants/showTitleW/",
            PO_LIST: "api/wh/getPos/",
            PURCHASE_COMPARISION_LIST: "api/wh/purchase/comparison/",
            FILE_ATTACHMENTS: "api/wh/whtransactiondocs/",
            DOWNLOAD_FILE_ATTACHMENTS: "api/downloadFile/",
        },
        POST: {
            ADD_PURCHASE: "api/wh/purchase",
            PURCHASE_LIST: "api/wh/purchase/transactions",
            UPLOAD_SHEET: "api/wh/purchase/excelInvoice",
            CONFIRM_UPLOAD_SHEET: "api/wh/purchase/excelInvoice/approve",
            UPDATE_INVENTORY: "api/wh/purchase/updateexcelInvoice"
        },
        PUT: {
            UPDATE_INVENTORY: "api/wh/purchase/excelInvoice"
        },
        DELETE: {
            DELETE_FILE_ATTACHMENTS: "api/wh/whtransactiondocs/",
        }
    }

    /* FOR WAREHOUSE COUNT SERVICE */
    public static _WAREHOUSE_COUNT = {
        GET: {
            COUNT_INFO: "api/wh/whcount/transactions/",
            SHOW_TITLE: "api/appConstants/showTitleW/",
            COUNT_OPEN: "api/wh/whcount/open/"
        },
        POST: {
            ADD_COUNT: "api/wh/whcount",
            COUNT_LIST: "api/wh/whcount/transaction",
        },
        PUT: {
            UPDATE_COUNT: "api/wh/whcount"
        }
    }

    /* For POS COUNT SERVICE */
    public static _BRANCH_COUNT = {
        GET: {
            COUNT_INFO: "api/branch/branchcount/transactions/",
            SHOW_TITLE: "api/appConstants/showTitleW/",
            COUNT_OPEN: "api/branch/branchcount/open/"
        },
        POST: {
            ADD_COUNT: "api/branch/branchcount",
            COUNT_LIST: "api/branch/branchcount/transaction",
        },
        PUT: {
            UPDATE_COUNT: "api/branch/branchcount"
        }
    }



    /* FOR WAREHOUSE PURCHASE SERVICE */
    public static _WAREHOUSE_INVOICE = {
        GET: {
            INVOICE_INFO: "api/wh/invoice/transactions/",
            SHOW_TITLE: "api/appConstants/showTitleW/"
        },
        POST: {
            ADD_INVOICE: "api/wh/invoice",
            INVOICE_LIST: "api/wh/invoice/transactions",
            CONFIRM_UPLOAD_SHEET: "api/wh/invoice/excelInvoice/approve"
        },
        PUT: {
            UPDATE_INVOICE: "api/wh/invoice/excelInvoice"
        }
    }

    /* FOR WAREHOUSE PRE PURCHASE SERVICE */
    public static _WAREHOUSE_PRE_PURCHASES = {
        GET: {
            PRE_PURCHASE_INFO: "api/wh/prepurchase/transactions/",
            PRE_PURCHASE_APPROVE: "api/wh/prepurchse/auth/",
            PRE_PURCHASE_OPEN: "api/wh/prepurchse/open/",

            // SHOW_TITLE: "api/appConstants/showTitleW/"
        },
        POST: {
            // ADD_PURCHASE: "api/wh/purchase",
            PRE_PURCHASE_LIST: "api/wh/prepurchase/transaction",
            UPLOAD_SHEET: "api/wh/prepurchase",
            // CONFIRM_UPLOAD_SHEET: "api/wh/purchase/excelInvoice/approve"
        },
        PUT: {
            // UPDATE_INVENTORY: "api/wh/purchase/excelInvoice"
        }
    }

    /* FOR STORE PRE PURCHASE SERVICE */
    public static _BRANCH_PRE_PURCHASES = {
        GET: {
            PRE_PURCHASE_INFO: "api/branch/prepurchase/transactions/",
            PRE_PURCHASE_APPROVE: "api/branch/prepurchase/auth/",
            PRE_PURCHASE_OPEN: "api/branch/prepurchse/open/",

            // SHOW_TITLE: "api/appConstants/showTitleW/"
        },
        POST: {
            // ADD_PURCHASE: "api/wh/purchase",
            PRE_PURCHASE_LIST: "api/branch/prepurchase/transaction",
            UPLOAD_SHEET: "api/branch/prepurchase",
            // CONFIRM_UPLOAD_SHEET: "api/wh/purchase/excelInvoice/approve"
        },
        PUT: {
            // UPDATE_INVENTORY: "api/wh/purchase/excelInvoice"
        }
    }


    /* FOR REFERRALS SERVICE */
    public static _REFERRALS = {
        GET: {
            INVITES_LIST: "api/referral/invitedetails/",
            INVITE_PROMOTERS_LIST: "api/referral/promoter/campaigns/",
            PROMOTER_REFERRALS: "api/feedbacks/promoters/users/"
        },
        PUT: {
            UPDATE_INVITE: "api/referral/invitedetails",
            UPDATE_PROMOTER: "api/referral/promoters"
        },
        POST: {
            ADD_INVITE_PROMOTERS: "api/referral/promoter/campaigns"
        },
        DELETE: {
            REMOVE_PROMOTER: "api/referral/promoters/"
        }
    }

    /* FOR APP USERS SERVICE */
    public static _APP_USERS = {
        POST: {
            USERS_LIST: "api/referral/appusers",
            CHANGE_PROMOTE_STATE: "api/referral/promoters",
            SEND_EMAIL: "api/customer/mail",
            PROMOTER_DOWNLOADS: "api/referral/promoters/downloads"
        },
        PUT: {
            UPDATE_APP_USER: "api/portal/userapp"
        }
    }

    /* FOR NOTIFICATIONS SERVICE */
    public static _NOTIFICATIONS = {
        GET: {
            LIST: "api/announcements/",
            USERS_LIST: "api/announcements/users/"
        },
        POST: {
            CREATE: "api/announcements/send"
        },
        PUT: {
            UPDATE_NOTIFICATION: "api/announcements"
        }
    }

    /* FOR MESSAGES SERVICE */
    public static _MESSAGES = {
        GET: {
            HISTORY: "chat/getCustomerCareMessagesList",
            SEARCH_USERS: "chat/searchUser/"
        },
        POST: {
            USER_MESSAGES: "chat/getOneToOneMessages",
            CLOSE_ISSUE: "chat/closeIssue",
            USERNAME_BY_ID: "chat/getUserInfo"
        }
    }

    /* FOR SELECTORS */
    public static _SELECTORS = {
        GET: {
            APP_USERS: "api/selectors/appusers/",
            FRANCHISES: "api/selectors/franchises/",
            STORES: "api/selectors/stores/"
        }
    }

}

