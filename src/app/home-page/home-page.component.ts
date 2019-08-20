import { Component,  Renderer2 } from '@angular/core';
import { ListFoldersService } from './services/list-folders.service';
import { ListFilesService } from './services/list-files.service';
import { FileModel } from './model/file-model';
import { FolderModel } from './model/folder-model';
import { ModalWindowModel } from './model/modal-window-model';
import { MoveMenuModel } from './model/move-menu-model';
import { OutDialogWindowChanges } from './model/out-dialog-window-changes';
import { Operations } from './model/operations.enum'

enum Operations1 { create, read, update, delete }


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [ListFoldersService, ListFilesService]
})

export class HomePageComponent {
  private host_url: string = "http://localhost:8080";
  private getAllFolders_url: string = "/rest/getFolders";
  private newFolder_url: string = "/rest/addFolders";
  private delFolder_url: string = "/rest/delFolder";
  private updateFolder_url: string = "/rest/updateFolder";
  // private moveFolder_url: string = "/rest/renameFolder";

  private getFiles_url: string = "/rest/getFiles";
  private uploadFiles_url: string = "/rest/uploadMultiFiles";
  private downloadFile_url: string = "/rest/downloadFile";
  private delFile_url: string = "/rest/delFile";
  private updateFile_url: string = "/rest/updateFile";

  private getSize_url: string = "/rest/getSize"
  // private renameFile_url: string = "/rest/renameFile"
  // private const commandsCRUD: string[]=['Create','Read','Update','Delete'];
  // For LOGIC
  private currentPath: string = '/';
  private allFoldersListFull: Array<FolderModel>;

  // For Viewer
  private currentFoldersListView: Array<FolderModel>;
  public currentPathViewer: Array<string> = ['Мой Диск'];
  private currenSizeView: string;
  private fullSizeView: string;
  private meterLowView: number;
  private meterHigtView: number;
  private meterMaxView: number;
  private meterValueView: number;
  private menuNumberView: number = 0;


  private operation = Operations;
  private currentOperation: Operations;

  private isModalDialogVisible: boolean = false;
  private dataModalDialogMain: ModalWindowModel;

  private contextMenuView: boolean = false;////
  private contextmenuXView: number;
  private contextmenuYView: number;
  private isFolderMenu: boolean;
  private menuNameFolder: string;
  private menuPathFolder: string;
  private idFile: number;
  private downloadLinkView: string;




  private currentListFiles: Array<FileModel>;


  private isMoveMenuVisible: boolean = false;///
  private dataMoveMenuMain: MoveMenuModel;

  private movePathView: string = '/';
  private moveListFoldersView: Array<string>;
  // private headerMoveMenu: string;



  constructor(private listFoldersService: ListFoldersService, private listFilesService: ListFilesService, private renderer: Renderer2) {
    this.getAllFoldersServer();
    this.getFilesList();
  }

  getAllFoldersServer() {
    this.listFoldersService.getAllFolders(this.host_url + this.getAllFolders_url).subscribe((data: FolderModel[]) => {
      this.allFoldersListFull = data;
      this.currentFoldersListView = this.listFoldersService.getFoldersListForViewer(this.currentPath, this.allFoldersListFull);
      // console.log(this.currentFoldersListView)
      // this.moveListFoldersView = this.currentFoldersListView;
    });

  }

  sizeDiskView() {
    this.listFoldersService.getSize(this.host_url, this.getSize_url).subscribe((size: string[]) => {
      this.meterMaxView = +size[0];
      this.meterLowView = Math.round(this.meterMaxView * 0.8);
      console.log(this.meterLowView)
      this.meterHigtView = Math.round(this.meterMaxView * 0.9);
      console.log(this.meterHigtView)
      this.fullSizeView = size[1];
      this.meterValueView = +size[2];
      this.currenSizeView = size[3];


    });
  }

  newFoldersListByClick(event) {
    let folderName: string = event.currentTarget.getAttribute('data-folderName');
    let folderPath: string = event.currentTarget.getAttribute('data-folderPath');
    let newPath: string = folderPath + folderName + '/';
    this.updateFolderListByPath(newPath);
  }

  updateFolderListByPath(newPath: string) {
    this.currentPath = newPath;
    this.currentPathViewer = this.getCurrentPathViever(this.currentPath);
    this.currentFoldersListView = this.listFoldersService.getFoldersListForViewer(newPath, this.allFoldersListFull);
    this.getFilesList();
  }

  getCurrentPathViever(path: string): Array<string> {
    let newPathViewer: Array<string> = path.split('/');
    newPathViewer.pop();
    newPathViewer[0] = 'Мой Диск';
    console.log(newPathViewer)
    // Переход в root 
    // if (newPathViewer[1] === '') newPathViewer = newPathViewer.slice(0, 1);
    return newPathViewer;
  }
  // breadcrumbs
  currentFoldersListViewListByClick(event) {

    let listFolders: Array<string> = this.currentPathViewer.slice();
    const indexFolder: number = +event.currentTarget.getAttribute('data-ifolder');
    let newPath: string;
    if (indexFolder === 0) {
      newPath = '/';
    } else {
      listFolders[0] = '';
      newPath = listFolders.slice(0, indexFolder + 1).join('/') + '/';
    }
    console.log(newPath)
    this.updateFolderListByPath(newPath);
  }

  // onButtonClick(event) {
  //   console.log(event);
  //   this.contextmenuXView = event.clientX;
  //   this.contextmenuYView = event.clientY;
  //   this.contextMenuView = true;
  // }

  onrightClick(event) {
    let attrElement: Element = this.getAttributesElementByClick(event);
    console.log(attrElement);
    this.contextmenuXView = event.clientX;
    this.contextmenuYView = event.clientY;

    console.log(attrElement);
    this.isFolderMenu = Boolean(attrElement.getAttribute('data-isfolder'));
    console.log(this.isFolderMenu)
    this.contextMenuView = true;
    this.menuNameFolder = attrElement.getAttribute('data-folderName');
    this.menuPathFolder = attrElement.getAttribute('data-folderPath');
    if (!this.isFolderMenu) {
      this.idFile = +attrElement.getAttribute('data-ifile');
      console.log(this.idFile)
      this.downloadLinkView = this.host_url + this.downloadFile_url + '/' + this.idFile;

      console.log(this.menuNameFolder)
    }

    return false; //добавить в body здксь убрать
  }

  private getAttributesElementByClick(event): Element {
    let arrayElements: Element[] = event.path;
    for (let i = 0; i < arrayElements.length - 2; i++) {
      if (arrayElements[i].classList.contains("contener-elementFS")) {
        return arrayElements[i];
      }
    }
    return null;
  }

  public showDialog(comand: Operations) {
    this.contextMenuView = false;
    let header: string;
    let description: string;
    let currentName: string;
    switch (comand) {
      case (this.operation.create):
        header = 'Создать новую папку';
        description = 'Ведите имя новой папки';
        currentName = 'New'
        break;
      case (this.operation.update):
        if (this.isFolderMenu) {
          currentName = this.menuNameFolder
          header = 'Преименовать папку';
          description = 'Ведите новое имя папки';

        } else {
          currentName = this.getFileNameById(this.idFile, this.currentListFiles);
          header = 'Преименовать файл';
          description = 'Ведите новое имя файла';
        };
        break;
    }
    this.dataModalDialogMain = new ModalWindowModel(header, description, currentName);
    this.currentOperation = comand;
    this.isModalDialogVisible = true;
  }



  public showMoveMenu(comand: Operations) {
    this.contextMenuView = false;
    let headerMoveMenu: string;
    let clickName: string;
    if (this.isFolderMenu) {
      clickName = this.menuNameFolder;
      headerMoveMenu = 'Переместить папку';
    } else {
      clickName = this.getFileNameById(this.idFile, this.currentListFiles);
      headerMoveMenu = 'Переместить файл';
    };

    this.dataMoveMenuMain = new MoveMenuModel(this.allFoldersListFull, this.currentPath, clickName, headerMoveMenu);
    this.currentOperation = comand;
    this.isMoveMenuVisible = true;
  }

  public closeModalWindow(outData: OutDialogWindowChanges) {
    this.isModalDialogVisible = false;
    this.isMoveMenuVisible = false;
    if (!outData.isConfirmed) return;
    let contextMenuOperations: Operations = this.currentOperation;
    this.changeMainList(contextMenuOperations, outData.newName, outData.newPath);
    this.currentOperation = null;
  }

  // public closeMoveMenu(outData: MoveMenuModel) {
  //   this.isMoveMenuVisible = false;
  //   if (!outData["isConfirmed"]) return;
  //   this.changeMainList(this.operation.update, outData["newName"] ,outData["newPath"]);
  // }

  getFilesList() {

    this.listFilesService.getFilesList(this.host_url, this.getFiles_url, this.currentPath).subscribe((data: FileModel[]) => {
      this.currentListFiles = data;
      this.sizeDiskView();
    });
  }





  changeMainList(doIt: Operations, newNameIn?: string, newPathIn?: string) {
    this.contextMenuView = false;
    let do_url: string;
    let changeNameFolder: string = this.menuNameFolder;
    let changeIdFile: number = this.idFile;
    let pathChange: string = this.currentPath;

    let currentNameToServer: string = '';
    let newNameToServer: string = '';
    // if ((changeNameFolder === "." || changeNameFolder === "..") && doIt !== this.operation.create) return;// подумать где
    switch (doIt) {
      case this.operation.create:
        this.isFolderMenu = true;
        do_url = this.newFolder_url;
        console.log(newNameIn)
        newNameToServer = pathChange + newNameIn + '/';
        break;
      case this.operation.delete:
        if (this.isFolderMenu) {
          do_url = this.delFolder_url;
          currentNameToServer = this.menuPathFolder + this.menuNameFolder + '/';
        }
        else do_url = this.delFile_url;
        break;
      case this.operation.update:
        if (this.isFolderMenu) {
          do_url = this.updateFolder_url;
          currentNameToServer = this.menuPathFolder + this.menuNameFolder + '/';
          // переименование
          if (newPathIn === '' && newNameIn !== '') {
            newNameToServer = this.menuPathFolder + newNameIn + '/';
          } else
            // перенос папки
            if (newPathIn !== '' && newNameIn === '') {
              newNameToServer = newPathIn + this.menuNameFolder + '/';
            } else return;
        } else {
          do_url = this.updateFile_url;
        }
        break;
    }

    if (this.isFolderMenu) {
      this.listFoldersService.changeFolders(this.host_url, do_url, currentNameToServer, newNameToServer)
        .subscribe(() => {
          this.getAllFoldersServer();
          if(do_url === this.delFolder_url) this.sizeDiskView();
        });
    } else {
      this.listFilesService.changeFiles(this.host_url, do_url, String(changeIdFile), newNameIn, newPathIn)
        .subscribe(() => this.getFilesList());
    }
    // this.sizeDiskView();
  }

  // createPathByFolderName(folderName: string, path: string): string {
  //   let folderPath: string;
  //   if (path === "/") {
  //     folderPath = path + folderName;
  //   } else {
  //     folderPath = path + "/" + folderName;
  //   }
  //   return folderPath;
  // }

  uploadFilesServer(event) {
    let files: FileList = event.target.files;
    if (files.length === 0) return;
    this.listFilesService.uploadFiles(this.host_url, this.uploadFiles_url, files, this.currentPath)
      .subscribe(() =>
        // сообщение ок или errjr ф-ю убрать
        this.getFilesList());
  }
  getFileNameById(id: number, listFiles: Array<FileModel>): string {
    for (let i = 0; i < listFiles.length; i++) {
      if (listFiles[i].id === id) return listFiles[i].fileName;
    }
    return null;
  }


  foldersView($event){
    this.menuNumberView = 0;
    this.showActiveMenu(event.target);
  }
  basketView(event){
    let folderListByPath: Array<FolderModel> = [];
    this.menuNumberView = 1;
    this.showActiveMenu(event.target);
  }

  starView(event){
    let folderListByPath: Array<FolderModel> = [];
    this.menuNumberView = 2;
    this.showActiveMenu(event.target);
  }

private showActiveMenu(node:any){
  let nodeList =  document.querySelectorAll(".show-currentPath");
  nodeList.forEach(element => {
    this.renderer.removeClass(element,'show-currentPath');
  });
  if(this.menuNumberView !== 0) this.renderer.addClass(node,'show-currentPath');
}








}


