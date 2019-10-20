import { Operations } from './enums/operations.enum';
import { TypeDialogWindow } from './enums/type-dialog-window.enum';
import { ContextMenuType } from '../model/enums/context-menu-type.enum';

export class ModalWindowModel {
    typeDialogWin: TypeDialogWindow;//тип сообщения контекст меню, ошибка 
    bodyMessage: string;
    comand: Operations;
    typeMenu: ContextMenuType;

    numberErr: number;
    nameErr: string;
    serverMess: string;
    todo: string;

    constructor(typeDialogWin: TypeDialogWindow, bodyMessage: string, comand?: Operations, typeMenu?: ContextMenuType) {
        this.typeDialogWin = typeDialogWin;
        this.bodyMessage = bodyMessage;

        this.comand = comand;
        this.typeMenu = typeMenu;
    }

}
