
import { environment } from '../../../environments/environment';

export class Servers {
    // public static TEST_MODE = environment.TEST_MODE;
    public static TEST_MODE = false;
    public static GKE = "https://gke.october-now.com/";
    public static GKE_READ = "https://gke-r.october-now.com/";
    public static ONLINE_TEST = "https://test-consumer.october-now.com/portal/";
    // public static ONLINE_TEST = "http://localhost:8089/portal/";
    public static LOCAL_TEST = "http://0.0.0.0:3000/"
    public static EXALTED_SERVER = "https://exalted-cell-257706.appspot.com/";
    public static CHAT_SERVER = "https://master.october-now.com/";
    public static RIDER_TEST_SERVER = "https://test-consumer.october-now.com/rider/";
    public static PORTAL_SERVER = "https://master.october-now.com/portal/"
}

export class AppConstants {
    
    public static SERVER_URL = Servers.TEST_MODE ? Servers.ONLINE_TEST : Servers.PORTAL_SERVER;
    public static SERVER_TEST_URL = Servers.LOCAL_TEST;
    public static SERVER_READONLY_URL = Servers.TEST_MODE ? Servers.ONLINE_TEST : Servers.PORTAL_SERVER;
    public static CHAT_SERVER_URL = Servers.TEST_MODE ? Servers.CHAT_SERVER :  Servers.CHAT_SERVER;
    public static RIDER_SERVER_URL = Servers.TEST_MODE ? Servers.RIDER_TEST_SERVER: Servers.GKE_READ;

    public static AUDIT_URL = "https://audit-project-ef97a.firebaseio.com/";

    public static FIREBASE_CONFIG = {
        apiKey: "AIzaSyAdtUwqqrvcONXZ4_7OTfqJMRivjhxPeMw",
        projectId: "smarty-252407",
        databaseURL: "https://audit-project-ef97a.firebaseio.com/",
        storageBucket: "gs://smarty-252407.appspot.com"
    }

    public static MAPS_CONFIG = {
        apiKey: 'AIzaSyAdtUwqqrvcONXZ4_7OTfqJMRivjhxPeMw',
        libraries: ['places']
    }

    public static VERSION = "1.2.0"; 

    public static INVALID_STORES = [
        5, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 17, 18, 19, 20, 21,
        22, 30, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 66, 23, 31, 29, 41, 42,
        43, 68, 69, 70, 71, 72, 73, 77, 78,
        79, 80, 81, 82, 83, 84
    ];

    public static COLORS = {
        TITLE_BAR: "rgb(76, 93, 122)",
        WH_TITLE_BAR:  "#993399",
        MENU_BAR: "white",
        WH_MENU_BAR: "white"
    }

    public static LANGUAGE_CODES = [
        { id: 1, code: "LANG0001" },
        { id: 2, code: "LANG0002" }
    ]
}
