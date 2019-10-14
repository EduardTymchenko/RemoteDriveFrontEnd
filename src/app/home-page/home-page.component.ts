import { Component } from '@angular/core';
import { HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { ListFoldersService } from './services/list-folders.service';
import { ListFilesService } from './services/list-files.service';
import { AdditionalService } from './services/additional.service';

import { FileModel } from './model/file-model';
import { FolderModel } from './model/folder-model';
import { ModalWindowModel } from './model/modal-window-model';
import { MoveMenuModel } from './model/move-menu-model';
import { OutDialogWindowChanges } from './model/out-dialog-window-changes';
import { ProgressIndicator } from './model/progress-indicator'; // uploadFilesServer for upload element
import { SizeDisk } from './model/size-disk'; // setSizeDisk for size disk element
import { ContextMenu } from './model/context-menu'; // setSizeDisk for size disk element
import { BreadcrumbsFolder } from './model/breadcrumbs-folder';

import { TypeDialogWindow } from './model/enums/type-dialog-window.enum';
import { Operations } from './model/enums/operations.enum';
import { ContextMenuType } from './model/enums/context-menu-type.enum'
import { MenuSidebar } from './model/enums/menu-sidebar.enum';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [ListFoldersService, ListFilesService, AdditionalService]
})

export class HomePageComponent {

  private getAllFolders_url: string = "/rest/getAllFolders";
  private readFolders_url: string = "/rest/getFolders";
  private createFolder_url: string = "/rest/addFolders";
  private delFolder_url: string = "/rest/delFolder";
  private updateFolder_url: string = "/rest/updateFolder";

  private getFiles_url: string = "/rest/getFiles";
  private uploadFiles_url: string = "/rest/uploadMultiFiles";
  private downloadFile_url: string = "/rest/downloadFile";
  private delFile_url: string = "/rest/delFile";
  private updateFile_url: string = "/rest/updateFile";

  private getSize_url: string = "/rest/getSize";
  private search_url: string = "/rest/search";
  private changeStar_url: string = "/rest/changeStar";
  private clearBasket_url: string = "/rest/clearBasket";
  private recover_url: string = "/rest/recover";


  // For LOGIC
  private objectType = ContextMenuType;
  private menuSidebar = MenuSidebar;

  private currentPath: string; //setCurrentPath
  private allFoldersListFull: Array<FolderModel>; //getAllFoldersServer for tree folders in component

  private isGetFilesList: boolean;
  private isGetFoldersList: boolean;
  private countClickMenu: number = 0;
  // для хранения педыдкщего ответа из окна переместить
  private outDialogWindowChanges: OutDialogWindowChanges = null;

  // For Viewer
  private menuNameView: MenuSidebar; // setMenuNameView choosed menu of sidebar

  private statusDataView: string; //--- show tabele folder and files
  private currentFoldersListView: Array<FolderModel>; //setDataView
  private currentFilesListView: Array<FileModel>; //setDataView
  private pathBreadcrumbsViewer: Array<BreadcrumbsFolder>;//setCurrentPath
  private pogressIndikatorView: ProgressIndicator = new ProgressIndicator();
  private sizeDiskView: SizeDisk = new SizeDisk();
  private contextMenuView: ContextMenu = new ContextMenu();
  private searchStringView: string; //searchClick

  private operation = Operations;
  private typeModalWin = TypeDialogWindow;
  // private currentOperation: Operations;

  private isModalDialogVisible: boolean = false;
  private dataModalDialogMain: ModalWindowModel;

  // private menuNameFolder: string;
  // private menuPathFolder: string;
  private idFile: number;
  private downloadLinkView: string;

  private uploadProcess: any;


  private isMoveMenuVisible: boolean = false;///
  private dataMoveMenuMain: MoveMenuModel;

  private movePathView: string = '/';
  private moveListFoldersView: Array<string>;


  constructor(private listFoldersService: ListFoldersService,
    private listFilesService: ListFilesService, private additionalService: AdditionalService) {
    this.setCurrentPath(sessionStorage.getItem('currentPath'));
    this.setMenuNameView(+sessionStorage.getItem('menuNameView'));
    this.setSizeDiskView();
    this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath);
    this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
    this.setAllFoldersList();
  }

  ngAfterContentChecked() {
    this.setIsDataView();
  }
  // Set block
  private setCurrentPath(path: string) {

    if (path === null) path = '/';
    this.currentPath = path;
    this.pathBreadcrumbsViewer = new Array();
    let fullBreadcrumbs: Array<string> = path.split('/');
    fullBreadcrumbs.pop();
    let isLong: boolean;
    let lengthBreadcrumbs: number;
    let index: number;
    let fullPath: string;
    if (fullBreadcrumbs.length > 6) {
      isLong = true;
      lengthBreadcrumbs = 6;
    } else {
      isLong = false;
      lengthBreadcrumbs = fullBreadcrumbs.length;
    }
    for (let i = 0; i < lengthBreadcrumbs; i++) {
      if (isLong && i > 2) index = fullBreadcrumbs.length - lengthBreadcrumbs + i;
      else index = i;
      fullPath = fullBreadcrumbs.slice(0, index + 1).join('/') + '/';
      // console.log('fullPath = ' + fullPath)
      this.pathBreadcrumbsViewer.push(new BreadcrumbsFolder(fullBreadcrumbs[index], fullPath));
    }
    if (isLong) {
      this.pathBreadcrumbsViewer[3].name = '...';
      this.pathBreadcrumbsViewer[3].isAttr = false;
    }
    this.pathBreadcrumbsViewer[0].name = 'Мой диск';
    sessionStorage.setItem('currentPath', this.currentPath);
  }

  private setMenuNameView(menuName: MenuSidebar) {

    if (menuName === null) {
      menuName = this.menuSidebar.folders;
      this.countClickMenu = 1;
    }
    if (menuName === this.menuSidebar.folders) this.countClickMenu++;
    else this.countClickMenu = 0;
    console.log(this.countClickMenu)

    this.menuNameView = menuName;
    sessionStorage.setItem('menuNameView', this.menuNameView.toString());
  }



  private setFilesList(urlAction: string, typeSideMenu: string, path: string) {
    this.isGetFilesList = false;
    let newFilesList: Array<FileModel>;
    // this.currentListFilesView = [];
    this.listFilesService.getFilesList(urlAction, typeSideMenu, path).subscribe((data: FileModel[]) => {
      newFilesList = data;
      this.currentFilesListView = Array.from(newFilesList);
      this.isGetFilesList = true;
    },
      (error: HttpErrorResponse) => {
        this.showErrorDialog(error);
      });
  }
  private setFoldersList(urlAction: string, typeSideMenu: string, path: string) {
    let newFoldesList: Array<FolderModel>;
    this.isGetFoldersList = false;
    // this.currentFoldersListView = [];
    this.listFoldersService.getFoldersList(urlAction, typeSideMenu, path).subscribe((data: FolderModel[]) => {
      newFoldesList = data;
      this.currentFoldersListView = Array.from(newFoldesList);
      this.isGetFoldersList = true;
    },
      (error: HttpErrorResponse) => {
        this.showErrorDialog(error);
      });
  }

  private setIsDataView() {
    if (!this.isGetFilesList || !this.isGetFoldersList) this.statusDataView = 'isLoading';
    else if (this.currentFilesListView.length === 0 && this.currentFoldersListView.length === 0) this.statusDataView = 'isNoData';
    else this.statusDataView = 'isData';
    console.log(this.statusDataView)

  }

  private setSizeDiskView() {
    this.additionalService.getSize(this.getSize_url).subscribe((size: string[]) => {
      this.sizeDiskView.meterMaxView = +size[0];
      this.sizeDiskView.meterLowView = Math.round(this.sizeDiskView.meterMaxView * 0.8);
      this.sizeDiskView.meterHigtView = Math.round(this.sizeDiskView.meterMaxView * 0.9);
      this.sizeDiskView.fullSizeView = this.sizeByteToString(+size[0]);
      this.sizeDiskView.meterValueView = +size[1];
      this.sizeDiskView.currenSizeView = this.sizeByteToString(+size[1]);
    },
      (error: HttpErrorResponse) => {
        this.showErrorDialog(error);
      });
  }

  private setAllFoldersList() {
    this.listFoldersService.getAllFolders(this.getAllFolders_url).subscribe((data: FolderModel[]) => {
      this.allFoldersListFull = data;
    },
      (error: HttpErrorResponse) => {
        this.showErrorDialog(error);
      });
  }



  // Click block
  private buttonAddClick() {
    console.log(this.menuSidebar["folderSide"])
    if (this.menuNameView !== this.menuSidebar.folders) {
      this.sidebarMenuClick(this.menuSidebar.folders);
    }
    let contextMenu = new ContextMenu();
    contextMenu.showX = 10;
    contextMenu.showY = 110;
    contextMenu.isShow = true;
    contextMenu.typeObject = this.objectType.global;
    this.contextMenuView = contextMenu;
  }

  private sidebarMenuClick(nameMenu: MenuSidebar) {
    this.setMenuNameView(nameMenu);
    this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath);
    this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
  }

  private folderOrFileClick(event) {
    const attrArray: string[] = event.currentTarget.getAttribute('data-el').split('-');

    let typeElement: ContextMenuType = +attrArray[0];
    console.log(typeElement)
    // console.log(this.contextMenuType.)
    const idElement: number = +attrArray[1];
    let clickFolder: FolderModel;
    let clickFile: FileModel;
    let newPath: string;
    console.log(this.menuNameView)
    switch (this.menuNameView) {
      case this.menuSidebar.folders:
        if (typeElement === this.objectType.folder) {
          clickFolder = this.getFolderById(idElement, this.currentFoldersListView);
          newPath = clickFolder.folderPath + clickFolder.name + '/';
        } else return;
        break;
      case 2:
      case this.menuSidebar.search:
        if (typeElement === this.objectType.folder) {
          clickFolder = this.getFolderById(idElement, this.currentFoldersListView);
          newPath = clickFolder.folderPath;
        } else {
          clickFile = this.getFileById(idElement, this.currentFilesListView);
          newPath = clickFile.filePath;
        }
        break;

      default:
        return;
    }

    this.setCurrentPath(newPath);
    this.setMenuNameView(this.menuSidebar.folders);
    this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath)
    this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath)

  }

  private breadcrumbsClick(event) {
    const indexFolder: number = +event.currentTarget.getAttribute('data-ifolder');
    let newPath: string = this.pathBreadcrumbsViewer[indexFolder].fullPath;
    this.setCurrentPath(newPath);
    this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath);
    this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
  }

  private changeFolderListBySideMenu(clickPath: string) {
    if (this.countClickMenu < 1) return;
    this.setCurrentPath(clickPath);
    this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath);
    this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
  }
  private folderSizeClick(event) {
    const folderId = +event.currentTarget.getAttribute('data-el').split('-')[1];
    let clickFolder: FolderModel = this.getFolderById(folderId, this.currentFoldersListView);
    const fullPath = clickFolder.folderPath + clickFolder.name + '/';
    this.additionalService.getSize(this.getSize_url, fullPath)
      .subscribe((size: string[]) => clickFolder.folderSize = size[0],
        (error: HttpErrorResponse) => {
          this.showErrorDialog(error);
        });
  }

  private searchClick(search: string) {
    let foldersSearch: Array<FolderModel>;
    let filesSearch: Array<FileModel>;
    console.log(search)
    if (search.length === 0) return;//сообщение строка пустая
    this.setMenuNameView(this.menuSidebar.search);
    this.additionalService.search(this.search_url, search)
      .subscribe((data: any[]) => {
        foldersSearch = data[0];
        filesSearch = data[1];
        this.currentFoldersListView = this.setMarkerSearch(foldersSearch, search);
        this.currentFilesListView = this.setMarkerSearch(filesSearch, search);
      },
        (error: HttpErrorResponse) => {
          this.showErrorDialog(error);
        });
    this.searchStringView = search;
  }

  private setMarkerSearch(list: Array<any>, search: string): Array<any> {
    let nameIn: string;
    let newName: string;
    const re = new RegExp(search, 'ig')
    list.forEach(element => {
      nameIn = element.name;
      newName = nameIn.replace(re, '<mark>$&</mark>');
      element.name = newName;
    });
    return list;
  }

  private cancelUploadClick() {
    if (this.uploadProcess) {
      this.uploadProcess.unsubscribe();
      this.pogressIndikatorView.isCancel = true;
      this.uploadProcess = null;
    }
  }
  private closeUploadClick() {
    this.pogressIndikatorView.isVisual = false;
  }

  private clearBasketClick() {
    this.contextMenuView.isShow = false;
    this.contextMenuView.typeObject = this.objectType.global;
    this.showDialog(this.operation.delete, this.typeModalWin.warning);

  }

  private clearBasket() {
    this.additionalService.clearBasket(this.clearBasket_url).subscribe(() => {
      this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath)
      this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
    }, (error: HttpErrorResponse) => {
      this.showErrorDialog(error);
    });
  }

  private recoverClick() {
    this.contextMenuView.isShow = false;
    this.additionalService.recover(this.recover_url, this.contextMenuView.getTypeMenuStringName(), this.contextMenuView.id.toString()).subscribe(() => {
      this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath)
      this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
      this.setAllFoldersList();
      this.setSizeDiskView();
    }, (error: HttpErrorResponse) => {
      this.showErrorDialog(error);
    });
  }

  // Context menu block
  private onrightClick(event: any) {
    console.log(event.target)
    const stringAttr: string = event.currentTarget.getAttribute('data-el');
    if (stringAttr === null) return;
    const listAttr: Array<string> = stringAttr.split('-');
    let contextMenu = new ContextMenu();
    contextMenu.typeObject = +listAttr[0];
    contextMenu.id = +listAttr[1];
    if (contextMenu.getTypeMenu() === this.objectType.file) {
      contextMenu.isStar = this.getFileById(contextMenu.id, this.currentFilesListView).star;
    }
    if (contextMenu.getTypeMenu() === this.objectType.folder) {
      contextMenu.isStar = this.getFolderById(contextMenu.id, this.currentFoldersListView).star;
    }
    contextMenu.showX = this.setContextMenuX(event, contextMenu.typeObject);
    contextMenu.showY = this.setContextMenuY(event, contextMenu.typeObject);
    contextMenu.isShow = true;
    this.contextMenuView = contextMenu;

    return false; //добавить в body здксь убрать
  }


  private setContextMenuX(event, typeMenu: ContextMenuType): number {
    const widthContexMenu: number = 205;
    const clickX: number = event.clientX;
    const clientWidth = document.documentElement.clientWidth;
    let offsetRight: number = clientWidth - widthContexMenu;
    if (clickX <= offsetRight) {
      return clickX;
    } else {
      return clickX - widthContexMenu;
    }
  }

  private setContextMenuY(event, typeMenu: ContextMenuType): number {
    let heightContexMenu: number = 180;

    if (typeMenu === this.objectType.global && this.menuNameView === this.menuSidebar.folders) heightContexMenu = 90;
    if (typeMenu === this.objectType.global && this.menuNameView === this.menuSidebar.basket) heightContexMenu = 55;
    if (typeMenu === this.objectType.folder) heightContexMenu = 145;
    if (typeMenu === this.objectType.file) heightContexMenu = 180;
    const clickY: number = event.clientY;
    const clientHeight = document.documentElement.clientHeight;
    let offsetBottom: number = clientHeight - heightContexMenu;
    if (clickY <= offsetBottom) return clickY;
    return clickY - heightContexMenu;
  }

  private sideBarContextMenuOpen(contextMenuObj: ContextMenu) {
    this.contextMenuView = contextMenuObj;

  }

  private showDialog(comand: Operations, typeModalWindow: TypeDialogWindow) {
    console.log(this.contextMenuView)
    this.contextMenuView.isShow = false;
    this.contextMenuView.comand = comand;
    let defaultName: string = '';
    if (this.contextMenuView.getTypeMenu() === this.objectType.folder) {
      if (this.menuNameView === this.menuSidebar.basket) defaultName = this.getFolderById(this.contextMenuView.id, this.currentFoldersListView).name;
      else defaultName = this.getFolderById(this.contextMenuView.id, this.allFoldersListFull).name;
    }
    if (this.contextMenuView.getTypeMenu() === this.objectType.file) {
      defaultName = this.getFileById(this.contextMenuView.id, this.currentFilesListView).name;
    }
    this.dataModalDialogMain = new ModalWindowModel(typeModalWindow, defaultName, comand, this.contextMenuView.getTypeMenu());
    this.isModalDialogVisible = true;
  }

  public showErrorDialog(err: HttpErrorResponse) {
    this.contextMenuView.isShow = false;
    const numberErr: number = err.status;
    let message: string;
    let serverMess: string = '';

    if (err.error !== null && numberErr !== 0 && err.error.message !== undefined) {
      message = err.error.message;
      console.log(message)
    } else {
      message = 'Неизвестная ошибка ';
      serverMess = err.message;
    }

    this.dataModalDialogMain = new ModalWindowModel(this.typeModalWin.error, message);
    this.dataModalDialogMain.numberErr = numberErr;
    this.dataModalDialogMain.serverMess = serverMess;
    this.isModalDialogVisible = true;
  }


  public showMoveMenu(comand: Operations) {
    let name: string;
    this.contextMenuView.isShow = false;
    this.contextMenuView.comand = comand;
    if (this.contextMenuView.getTypeMenu() === this.objectType.folder) {
      name = this.getFolderById(this.contextMenuView.id, this.allFoldersListFull).name;
    }
    if (this.contextMenuView.getTypeMenu() === this.objectType.file) {
      name = this.getFileById(this.contextMenuView.id, this.currentFilesListView).name;
    }
    this.dataMoveMenuMain = new MoveMenuModel(this.allFoldersListFull, this.currentPath, this.contextMenuView.getTypeMenu(), name);
    this.isMoveMenuVisible = true;
  }

  public closeModalWindow(outData: OutDialogWindowChanges) {
    console.log(outData)
    this.isModalDialogVisible = false;
    this.isMoveMenuVisible = false;
    if (!outData.isConfirmed) {
      this.outDialogWindowChanges = null;
      return;
    }
    if (outData.newName && this.outDialogWindowChanges !== null) {
      outData.newPath = this.outDialogWindowChanges.newPath;

    }
    if (outData.errIsRename) {
      this.showDialog(this.operation.update, this.typeModalWin.context);
      console.log(this.dataModalDialogMain)
      return;
    }
    if (outData.newPath !== '') this.outDialogWindowChanges = outData;
    if (this.menuNameView === this.menuSidebar.basket && this.contextMenuView.typeObject === this.objectType.global) {
      this.clearBasket();
      return;
    }
    this.changeMainList(this.contextMenuView.comand, outData.newName, outData.newPath);
  }

  // Change data block
  private changeStar() {
    this.contextMenuView.isShow = false;
    this.additionalService.changeStarStatus(this.changeStar_url, this.contextMenuView.getTypeMenuStringName(), this.contextMenuView.id)
      .subscribe(() => {
        if (this.contextMenuView.getTypeMenu() == this.objectType.folder) this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath);
        if (this.contextMenuView.getTypeMenu() == this.objectType.file) this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
      },
        (error: HttpErrorResponse) => {
          this.showErrorDialog(error);
        });
  }


  public uploadFilesServer(event) {
    let files: FileList = event.target.files;
    if (files.length === 0) return;
    this.pogressIndikatorView = new ProgressIndicator();
    this.pogressIndikatorView.isVisual = true;
    this.pogressIndikatorView.amountFiles = files.length;
    this.uploadProcess = this.listFilesService.uploadFiles(this.uploadFiles_url, files, this.currentPath)
      .subscribe((event: HttpEvent<any>) => {

        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.pogressIndikatorView.max = 100;
            this.pogressIndikatorView.value = Math.round(event.loaded / event.total * 100) - 1;
            console.log(this.pogressIndikatorView.value)
            break;
          case HttpEventType.Response:
            this.pogressIndikatorView.value = 100;
            this.pogressIndikatorView.isDone = true;
            this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath);
            this.setSizeDiskView();
            setTimeout(() => {
              this.pogressIndikatorView.isVisual = false;
            }, 5000);
        }
      },
        (error: HttpErrorResponse) => {
          this.showErrorDialog(error);
        });
  }

  private downloadFile() {
    this.contextMenuView.isShow = false;
    this.listFilesService.downloadFile(this.downloadFile_url, this.contextMenuView.id)
      .subscribe((data) => {
        var a = document.createElement("a");
        a.setAttribute('style', 'display: none');
        a.href = URL.createObjectURL(data.body);
        a.download = data.headers.get('content-disposition').split('"')[1];
        a.click();
        a.remove();
      },
        (error: HttpErrorResponse) => {
          this.showErrorDialog(error);
        });
  }

  private changeMainList(doIt: Operations, newNameIn: string, newPathIn: string) {
    this.contextMenuView.isShow = false;
    let do_url: string;
    // if ((changeNameFolder === "." || changeNameFolder === "..") && doIt !== this.operation.create) return;// подумать где
    switch (doIt) {
      case this.operation.create:
        do_url = this.createFolder_url;
        if (this.contextMenuView.typeObject == this.objectType.global) newPathIn = this.currentPath;
        if (this.contextMenuView.typeObject == this.objectType.folderSide) {
          const clickFolder: FolderModel = this.getFolderById(this.contextMenuView.id, this.allFoldersListFull);
          newPathIn = clickFolder.folderPath + clickFolder.name + '/';
        }
        break;
      case this.operation.delete:
        if (this.contextMenuView.getTypeMenu() === this.objectType.folder) do_url = this.delFolder_url;
        if (this.contextMenuView.getTypeMenu() === this.objectType.file) do_url = this.delFile_url;
        break;
      case this.operation.update:
        if (this.contextMenuView.getTypeMenu() === this.objectType.folder) do_url = this.updateFolder_url;
        if (this.contextMenuView.getTypeMenu() === this.objectType.file) do_url = this.updateFile_url;
        break;
    }
    let currentId: string;
    if (this.contextMenuView.id === undefined || this.contextMenuView.id === null) currentId = '';
    else currentId = this.contextMenuView.id.toString();

    this.additionalService.changeData(do_url, currentId, newPathIn, newNameIn).subscribe(() => {
      this.checkCurentPathForChangeList(+currentId, doIt, newNameIn, newPathIn);
      if (doIt === this.operation.delete) this.setSizeDiskView();
      if (this.contextMenuView.getTypeMenu() === this.objectType.folder || doIt === this.operation.create) {
        this.setFoldersList(this.readFolders_url, this.menuSidebar[this.menuNameView], this.currentPath);
        this.setAllFoldersList();
        console.log(this.currentPath)

      }
      if (this.contextMenuView.getTypeMenu() === this.objectType.file) {
        this.setFilesList(this.getFiles_url, this.menuSidebar[this.menuNameView], this.currentPath)
      }
      // При удачной операции удаляем предыдущее значения
      if (doIt === this.operation.update) this.outDialogWindowChanges = null;
    },
      (error: HttpErrorResponse) => {
        this.showErrorDialog(error);
      });
  }
  // Проверяем папку которую изменяем | удаляем является ли текущей
  private checkCurentPathForChangeList(currentId: number, doIt: Operations, newNameIn: string, newPathIn: string) {
    if (this.menuNameView === this.menuSidebar.basket) return;
    if (this.contextMenuView.getTypeMenu() === this.objectType.folder &&
      (doIt === this.operation.update || doIt === this.operation.delete)) {
      const oldFolder: FolderModel = this.getFolderById(+currentId, this.allFoldersListFull);
      if (oldFolder.folderPath + oldFolder.name + '/' === this.currentPath) {
        let newCurentPath: string;
        if (doIt === this.operation.update) {
          if (newPathIn !== '') newCurentPath = newPathIn;
          else newCurentPath = oldFolder.folderPath;
          if (newNameIn !== '') newCurentPath = newCurentPath + newNameIn + '/';
          else newCurentPath = newCurentPath + oldFolder.name + '/';
        }
        if (doIt === this.operation.delete) {
          newCurentPath = oldFolder.folderPath;
        }

        this.setCurrentPath(newCurentPath);
      }
    }
  }
  // Service bloc
  private sizeByteToString(sizeByte: number): string {
    if (Number.isNaN(sizeByte)) return '';
    let resultBefore: number = sizeByte;
    if (sizeByte / 1024 < 1) {
      return sizeByte + ' байт';
    } else {
      resultBefore = sizeByte / 1024;
    }
    if (sizeByte / 1048576 < 1) {
      return resultBefore.toFixed(1) + ' Кб';
    } else {
      resultBefore = sizeByte / 1048576;
    }
    if (sizeByte / 1073741824 < 1) {
      return resultBefore.toFixed(1) + ' Мб';
    } else {
      resultBefore = sizeByte / 1073741824;
      return resultBefore.toFixed(1) + ' Гб';
    }
  }
  private getFolderById(id: number, listFolders: Array<FolderModel>): FolderModel {
    for (let i = 0; i < listFolders.length; i++) {
      if (listFolders[i].folderId === id) return listFolders[i];
    }
    return null;
  }
  private getFileById(id: number, listFiles: Array<FileModel>): FileModel {
    for (let i = 0; i < listFiles.length; i++) {
      if (listFiles[i].id === id) return listFiles[i];
    }
  }


}


