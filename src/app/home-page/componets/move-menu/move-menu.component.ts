import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoveMenuModel } from '../../model/move-menu-model';
import { OutDialogWindowChanges } from '../../model/out-dialog-window-changes';
import { FolderModel } from '../../model/folder-model';

@Component({
  selector: 'app-move-menu',
  templateUrl: './move-menu.component.html',
  styleUrls: ['./move-menu.component.css']
})
export class MoveMenuComponent implements OnInit {
  @Input() dataMoveMenu: MoveMenuModel;
  @Output() dataMoveMenuOut: EventEmitter<any> = new EventEmitter();
  // For Viewer
  public headerView: string;
  public nameView: string;
  public currentPathView: string;
  public newPathView: string;
  public allFoldersList: Array<FolderModel>;

  // For metods
  
  private outDialogWindow: OutDialogWindowChanges = new OutDialogWindowChanges();

  ngOnInit() {
    this.allFoldersList = this.dataMoveMenu.allFolders;
    this.setHeaderView();
    this.currentPathView = this.dataMoveMenu.currentPath;
    this.newPathView = this.currentPathView;
  }

  public confirm() {
    this.outDialogWindow.isConfirmed = true;
    this.outDialogWindow.newPath = this.newPathView;
    this.dataMoveMenuOut.emit(this.outDialogWindow);
  }

  public close() {
    this.dataMoveMenuOut.emit(this.outDialogWindow.isConfirmed = false);
  }
  
  private setHeaderView() {
    if (this.dataMoveMenu.getTypeMenuStringName() === 'folder') {
      this.headerView = 'Переместить папку';
    }
    if (this.dataMoveMenu.getTypeMenuStringName() === 'file') {
      this.headerView = 'Переместить файл';
    }
    this.nameView = this.dataMoveMenu.name;

  }
  public changeMovePath(clickPath: string) {
    this.newPathView = clickPath;
  }
}
