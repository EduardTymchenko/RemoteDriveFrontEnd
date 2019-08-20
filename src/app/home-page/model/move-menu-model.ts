import { FolderModel } from '../model/folder-model';

export class MoveMenuModel {
    allFolders: Array<FolderModel>;
    currentPath: string;
    menuName: string;
    header: string;

    constructor(allFolders: Array<FolderModel>, currentPath: string, menuName: string, header: string) {
        this.allFolders = allFolders;
        this.currentPath = currentPath;
        this.menuName = menuName;
        this.header = header;
    }
    
}
