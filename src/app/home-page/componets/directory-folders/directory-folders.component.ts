import { Component, Renderer2, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FolderModel } from '../../model/folder-model';
import { ContextMenu } from '../../model/context-menu'

export class FolderForView {
  public isOpen: boolean = false;
  constructor(
    public path: string,
    public name: string,
    public padding: string,
    public id: number
  ) { }

}


@Component({
  selector: 'app-directory-folders',
  templateUrl: './directory-folders.component.html',
  styleUrls: ['./directory-folders.component.css']
})
export class DirectoryFoldersComponent implements AfterViewChecked{
  
  private currentPath: string;
  private isFoldersSideMenu: boolean = false;

  //For View
  public rootIsOpenView: boolean;
  public listFoldersView: Array<FolderForView> = [];

  private allFoldersList: Array<FolderForView>;
  

  private typeObject: string = 'folderSide';

  @Input('directoryAllFoldersList') set changefolderListView(inAllFolders: Array<FolderModel>) {
    this.allFoldersList = this.getAllFolderListView(inAllFolders);
    this.listFoldersView = this.updateFolderListView(this.allFoldersList, this.listFoldersView);
  }

  @Input('currentPath') set showCurrentPathView(inCurrentPaht: string) {
    this.currentPath = inCurrentPaht;
    this.openTreeCurrentPath(inCurrentPaht, this.listFoldersView);
  }

  @Input('menuNameView') set activeShowCurrentPath(menuName: string) {
    if(menuName === 'folders') this.isFoldersSideMenu = true;
    else {this.isFoldersSideMenu = false;
      this.offShowCurentPathView();
    }
    console.log('show ' +this.isFoldersSideMenu)
  }

  @Output() changeCurrentPathOut: EventEmitter<string> = new EventEmitter();
  @Output() contextMenuDF: EventEmitter<ContextMenu> = new EventEmitter();

  constructor(private renderer: Renderer2) {}

  ngAfterViewChecked() {
    console.log(this.isFoldersSideMenu)
    if(this.isFoldersSideMenu)  this.updateCurrentPathView(this.currentPath);
    // else this.offShowCurentPathView();
  }

  private getAllFolderListView(inFolderList: Array<FolderModel>): Array<FolderForView> {
    let outList: Array<FolderForView> = [];
    let padding: string = 'px'
    inFolderList.forEach(el => {
      padding = ((el.folderPath.split('/').length - 1) * 15) + 'px';
      outList.push(new FolderForView(el.folderPath, el.name, padding, el.folderId))
    });
    return outList;
  }

  private sortListFolder(inFolderList: Array<FolderForView>): Array<FolderForView> {
    let childFolder: FolderForView;
    let searchPath: string;
    for (let i = 0; i < inFolderList.length; i++) {
      searchPath = inFolderList[i].path + inFolderList[i].name + '/';
      let k: number = 0;
      for (let j = i + 1; j < inFolderList.length; j++) {
        if (inFolderList[j].path === searchPath) {
          childFolder = inFolderList[j];
          inFolderList.splice(j, 1);
          inFolderList.splice(i + 1 + k, 0, childFolder);
          k++;
        }
      }
    }
    return inFolderList;
  }

  public viewFolderList(event) {
    const attrElement: Element = this.getAttributesElementByClick(event);
    const clickFolderPath: string = attrElement.getAttribute('data-folderPath');
    const clickFolderName: string = attrElement.getAttribute('data-folderName');
    const clickPath = clickFolderPath + clickFolderName + '/';
    let isOpen: boolean = event.target.classList.contains('is-open');
    if (isOpen) {
      this.renderer.removeClass(event.target, 'is-open');
      this.listFoldersView = this.delFolderForView(clickPath, this.listFoldersView);
    } else {
      this.renderer.addClass(event.target, 'is-open');
      this.addFolderForView(clickPath, this.listFoldersView, this.allFoldersList);
    }
    this.setIsOpen(this.listFoldersView)
  }

  public openTreeCurrentPath(currentPath: string, listFoldersView: Array<FolderForView>) {
    const currentPathListFolders: string[] = currentPath.split('/');
    let checkPath: string = '';
    const listOpenFolders: string[] = this.getOpenedPathList(listFoldersView);
    for (let i = 0; i < currentPathListFolders.length - 2; i++) {
      checkPath = checkPath + currentPathListFolders[i] + '/';
      if (!listOpenFolders.includes(checkPath)) {
        this.addFolderForView(checkPath, listFoldersView, this.allFoldersList);
      }
    }
    this.setIsOpen(listFoldersView);
  }

  public updateCurrentPathView(path: string) {
    let folderList: any = document.querySelectorAll(".style-block-folder-sidebar");
    let pathFolder: string;
    let nameFolder: string;
    let fullPath: string;
    for (let i = 0; i < folderList.length; i++) {
      pathFolder = folderList[i].parentNode.getAttribute('data-folderPath');
      nameFolder = folderList[i].parentNode.getAttribute('data-folderName');
      fullPath = pathFolder + nameFolder + '/';
      if (fullPath === path) {
        this.renderer.addClass(folderList[i], 'show-currentPath');
      } else {
        this.renderer.removeClass(folderList[i], 'show-currentPath');
      }
    }
  }
  private offShowCurentPathView(){
    let node = document.querySelector('.directory-folder .show-currentPath');
    console.log(node)
    if(node === null) return;
    this.renderer.removeClass(node,'show-currentPath');
  }

  public openFolder(event) {
    let attrElement: Element = this.getAttributesElementByClick(event);
    const nameFolder = attrElement.getAttribute('data-folderName');
    const pathFolder = attrElement.getAttribute('data-folderPath');
    const clickFolderPath: string = pathFolder + nameFolder + '/';
    this.changeCurrentPathOut.emit(clickFolderPath);
    console.log(clickFolderPath)
  }

  public addFolderForView(path: string, listFolderView: Array<FolderForView>, allListFolder: Array<FolderForView>) {
    allListFolder.forEach(element => {
      if (element.path === path) listFolderView.push(element);
    });
    this.sortListFolder(listFolderView);
    
  }

  public delFolderForView(path: string, listFolderView: Array<FolderForView>): Array<FolderForView> {
    let newFolderList: Array<FolderForView> = [];
    listFolderView.forEach(element => {
      element.isOpen = false;
      if (element.path.indexOf(path, 0) === -1)
        newFolderList.push(element);
    });

    return this.sortListFolder(newFolderList);
  }

  public updateFolderListView(allFoldersList: Array<FolderForView>, listFoldersView: Array<FolderForView>): Array<FolderForView> {
    let updateList: Array<FolderForView> = [];
    const pathList: Array<string> = this.getOpenedPathList(listFoldersView);
    pathList.forEach(element => {
      this.addFolderForView(element, updateList, allFoldersList);
    });
    this.setIsOpen(updateList);
    return updateList;
  }

  private setIsOpen(listFoldersView: Array<FolderForView>) {
    if(listFoldersView.length === 0) this.rootIsOpenView = false;
    else this.rootIsOpenView = true;
    const pathList: Array<string> = this.getOpenedPathList(listFoldersView);
    pathList.forEach(path => {
      listFoldersView.forEach(el => {
        if ((el.path + el.name + '/') === path) el.isOpen = true;
      });
    });
  }

  private getOpenedPathList(listFolderView: Array<FolderForView>): Array<string> {
    let listPath: Array<string> = [];
    listFolderView.forEach(element => {
      if (listPath.includes(element.path)) return;
      listPath.push(element.path);
    });
    return listPath;
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

  private contextMenuDFClick(event){
    if(!this.isFoldersSideMenu) return;
    const stringAttr: string = event.currentTarget.getAttribute('data-el1');
    const listAttr: Array<string> = stringAttr.split('-');
    let contextMenuDFOut: ContextMenu = new ContextMenu();
    contextMenuDFOut.showX = event.clientX;
    contextMenuDFOut.showY = event.clientY;
    contextMenuDFOut.id = +listAttr[1];
    contextMenuDFOut.setTypeObjectOfString(this.typeObject);
    contextMenuDFOut.isShow = true;
    this.contextMenuDF.emit(contextMenuDFOut);
    return false; //добавить в body здксь убрать
  }
}

