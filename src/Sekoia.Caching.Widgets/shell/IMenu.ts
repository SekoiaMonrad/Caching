interface IMenu {
    name: string;
    pages: {
        name: string;
        moduleId: string;
        route: string;
    }[];
}

export = IMenu;