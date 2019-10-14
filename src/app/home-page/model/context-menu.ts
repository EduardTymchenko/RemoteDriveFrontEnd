import { Operations } from './enums/operations.enum';
import { ContextMenuType } from '../model/enums/context-menu-type.enum'

// Класс для работы с контекстным меню
export class ContextMenu {
    showX: number;
    showY: number;
    isShow: boolean ;
    // private typeMenu: ContextMenuType; //folder, file , global
    typeObject: ContextMenuType; //folder, file ....
    id: number;
    isStar:boolean;//изменение удалить/добавить в меню
    comand: Operations;


    public setTypeObjectOfString(typeObject: string){
      this.typeObject =  ContextMenuType[typeObject];
    }

    public getTypeMenu(): ContextMenuType{
      switch (this.typeObject) {
        case ContextMenuType.file:
        case ContextMenuType.folder:
        case ContextMenuType.global:
          return this.typeObject;
          case ContextMenuType.folderSide:
            return ContextMenuType.folder;
        default:
          return null;
      }
    }

    public getTypeMenuStringName(): string{
        return ContextMenuType[this.getTypeMenu()];
    }

}
