import { FolderModel } from '../model/folder-model';
import { ContextMenuType } from '../model/enums/context-menu-type.enum';

export class MoveMenuModel {
    allFolders: Array<FolderModel>;
    currentPath: string;
    typeMenu: ContextMenuType; //folder, file 
    name: string;


    constructor(allFolders: Array<FolderModel>, currentPath: string, typeMenu: ContextMenuType, name: string) {
        this.allFolders = allFolders;
        this.currentPath = currentPath;
        this.typeMenu = typeMenu;
        this.name = name;
    }
    public getTypeMenuStringName(): string {
        return ContextMenuType[this.typeMenu];
    }

}
