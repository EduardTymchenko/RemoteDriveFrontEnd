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
  private headerView: string;
  private nameView: string;
  private currentPathView: string;
  private newPathView: string;
  private folderListView: Array<string>;

  // For metods
  private outDialogWindow: OutDialogWindowChanges = new OutDialogWindowChanges();
  private allFoldersList: Array<FolderModel>;
  private changePath: string;

  ngOnInit() {
    this.allFoldersList = this.dataMoveMenu.allFolders;
    this.changePath = this.dataMoveMenu.currentPath;

    this.headerView = this.dataMoveMenu.header;
    this.nameView = this.dataMoveMenu.menuName;
    this.currentPathView = this.dataMoveMenu.currentPath;
    this.newPathView = this.currentPathView;
    this.folderListView = this.getFoldersListForViewer(this.changePath, this.allFoldersList);
  }

  private confirm() {
    this.outDialogWindow.isConfirmed = true;
    this.outDialogWindow.newPath = this.newPathView;
    this.dataMoveMenuOut.emit(this.outDialogWindow);
  }

  private close() {
    this.dataMoveMenuOut.emit(this.outDialogWindow.isConfirmed = false);
  }

  public getFoldersListForViewer(pathFolder: string, allFolders: Array<FolderModel>): Array<string> {
    let folderList: Array<string> = [];
    if (pathFolder != "/") {
      folderList.push('.');
      folderList.push('..');
    }
    allFolders.forEach(element => {
      if(element.folderPath === pathFolder) folderList.push(element.folderName);
    });
    return folderList;
  }

  newFoldersListByClick(event) {
    let changePath: string = this.changePath;
    let currentFoldersList: Array<string> = this.folderListView;
    const indexFolder: number = +event.currentTarget.getAttribute('data-ifolder');
    let newPath: string = '';
    if (changePath === '/') {
      newPath = changePath + currentFoldersList[indexFolder] + '/';
    }
    else {
      switch (indexFolder) {
        case 0:
          newPath = '/';
          break;
        case 1:
          let lengthChangePath: number = changePath.slice(0,-1).lastIndexOf("/");
          newPath = changePath.substring(0, lengthChangePath + 1);
          break;
        default:
          newPath = changePath + currentFoldersList[indexFolder] + '/';
          break;
      }
    }
    this.changePath = newPath;
    this.folderListView = this.getFoldersListForViewer(newPath, this.allFoldersList);
    this.newPathView = newPath;
  }
}
