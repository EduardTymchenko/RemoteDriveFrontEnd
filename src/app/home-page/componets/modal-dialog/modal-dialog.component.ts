import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OutDialogWindowChanges } from '../../model/out-dialog-window-changes'
import { ModalWindowModel } from '../../model/modal-window-model'

@Component({
	selector: 'app-modal-dialog',
	templateUrl: './modal-dialog.component.html',
	styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {

	@Input() dataModalDialog: ModalWindowModel;
	@Output() dataModalDialogOut: EventEmitter<any> = new EventEmitter();

	private outDialogWindow: OutDialogWindowChanges = new OutDialogWindowChanges();
	// For view
	private header: string;
	private description: string;
	private inputName: string;

	ngOnInit() {
		this.header = this.dataModalDialog.header;
		this.description = this.dataModalDialog.description;
		this.inputName = this.dataModalDialog.defaultName;
	}


	private confirm() {
		this.outDialogWindow.isConfirmed = true;
		this.outDialogWindow.newName = this.inputName;
		this.dataModalDialogOut.emit(this.outDialogWindow);
	}

	private close() {
		this.dataModalDialogOut.emit(this.outDialogWindow.isConfirmed = false);
	}
}
