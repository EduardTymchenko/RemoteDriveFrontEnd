export class BreadcrumbsFolder {
    name: string;
    isAttr: boolean;
    fullPath: string;
    constructor(name: string, fullPath: string) {
        this.name = name;
        this.fullPath = fullPath;
        this.setIsAttr(name);
    }
    private setIsAttr(name: string) {
        if (name.length > 8) this.isAttr = true;
        else this.isAttr = false;
    }
}
