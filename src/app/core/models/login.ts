export class ReqLogin {
    languageInfo?: {
        code: string;
    } = {
            code: "LANG0001"
        };
    loginType?= " ";
    user: {
        username: string;
        password: string;
    };
    metaUserTypeInfoList?: string[] = [
        "UT000001",
		"UT000002",
		"UT000003",
		"UT000004",
		"UT000012",
		"UT000013",
		"UT000014",
		"UT000016",
		"UT000017",
        "UT000018",
        "UT000019"
    ];
    portalType?: string;
} 

export class RespLogin {
    authStat: boolean;
    branchList: {
        id: number;
        title: string;
        parent: number;
    }[];
    fullUsername: string;
    login: number;
    refreshTokenString: string; 
    tokenString: string;
    userId: number;
    userType: string;
    userTypeList?: number[];
    name: string;
    hqId: number;
    // whList: string;
    whList: {
        id: number;
        title: string;
        parent: number;
    }[];
    userbranchlist?: number[];
}