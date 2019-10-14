import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OutDialogWindowChanges } from '../../model/out-dialog-window-changes';
import { ModalWindowModel } from '../../model/modal-window-model';
import { Operations } from '../../model/enums/operations.enum';
import { TypeDialogWindow } from '../../model/enums/type-dialog-window.enum';
import { ContextMenuType } from '../../model/enums/context-menu-type.enum';

@Component({
	selector: 'app-modal-dialog',
	templateUrl: './modal-dialog.component.html',
	styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent {

	@Input() set dataModalDialog(dataModalDialog: ModalWindowModel) {
		this.typeWinView = dataModalDialog.typeDialogWin;

		console.log(dataModalDialog);
		if (this.typeWinView === this.typeModalWin.warning) {
			if (dataModalDialog.comand === this.operation.delete) {
				this.header = 'Удалить';
				this.description = 'Удалить ';
				switch (dataModalDialog.typeMenu) {
					case ContextMenuType.file:
						this.description = this.description + 'файл "' + dataModalDialog.bodyMessage + '"';
						break;
					case ContextMenuType.folder:
						this.description = this.description + 'папку "' + dataModalDialog.bodyMessage + '"';
						break;
					case ContextMenuType.global:
						this.description =this.description + 'ВСЕ объекты '
						break;
				}
				this.description = this.description + ' навсегда?'
			};
		}

		if (this.typeWinView === this.typeModalWin.error) {
			this.header = 'Ошибка';
			this.codeErr = dataModalDialog.numberErr;
			this.description = dataModalDialog.bodyMessage;
			this.serverMess = dataModalDialog.serverMess;

		}
		if (this.typeWinView === this.typeModalWin.context) {
			switch (dataModalDialog.comand) {
				case (this.operation.create):
					this.header = 'Создать новую папку';
					this.description = 'Ведите имя новой папки';
					this.inputName = 'New';
					break;
				case (this.operation.update):
					if (dataModalDialog.typeMenu === ContextMenuType.folder) {
						this.header = 'Преименовать папку';
						this.description = 'Ведите новое имя папки';
					} else if (dataModalDialog.typeMenu === ContextMenuType.file) {
						this.header = 'Преименовать файл';
						this.description = 'Ведите новое имя файла';
					} else {
						this.header = 'Ошибка данных';
						this.description = 'Ошибка данных';
					}
					this.inputName = dataModalDialog.bodyMessage;
					break;
			}
		}
	};

	@Output() dataModalDialogOut: EventEmitter<any> = new EventEmitter();


	private outDialogWindow: OutDialogWindowChanges;
	// For view
	private typeWinView: TypeDialogWindow;
	private header: string;
	private codeErr: number;
	private description: string;
	private serverMess: string;
	private inputName: string;
	// For logic
	private operation = Operations;
	private typeModalWin = TypeDialogWindow;


	private confirm() {
		this.outDialogWindow = new OutDialogWindowChanges()
		this.outDialogWindow.isConfirmed = true;
		this.outDialogWindow.newName = this.inputName;
		if (this.typeWinView === this.typeModalWin.error) {
			if (this.codeErr === 409) this.outDialogWindow.errIsRename = true;
		};
		this.dataModalDialogOut.emit(this.outDialogWindow);
	}

	private close() {
		this.outDialogWindow = new OutDialogWindowChanges()
		this.dataModalDialogOut.emit(this.outDialogWindow.isConfirmed = false);
	}
}
