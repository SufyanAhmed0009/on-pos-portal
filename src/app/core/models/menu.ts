export class DtMenu {
    id: number;
    name: string;
    link: string;
    parentId: number;
    iconClass: string;
    portalType?: string;
}

export class RespMenu {
    id: number;
    menu: {
        id: number;
        displayName: string;
        parentID: { id: number };
        link: string;
        iconClass: string;
        portalType: string;
    };
    viewrights: boolean;
}

export class DtListMenu {
    id: number;
    name: string;
    link: string;
    imageClass: string;
    subMenus: DtListSubMenu[];
    portalType?: string;
}

export class DtListSubMenu {
    id: number;
    name: string;
    link: string;
}

export class DtMenusRights {
    id: number;
    title: string;
    link: string;
    parentId: number;
    viewRights: boolean;
    addRights: boolean;
    editRights: boolean;
    deleteRights: boolean;
}
