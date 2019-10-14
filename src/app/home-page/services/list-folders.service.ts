import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FolderModel } from '../model/folder-model';

@Injectable({
  providedIn: 'root'
})
export class ListFoldersService {

  constructor(private httpClient: HttpClient) { }


  public getAllFolders(url: string) {
    return this.httpClient.get(url);
  }

  public getFoldersList(url_get: string , typeSideMenu: string ,currentPath: string) {
    let paramsFilesList = new HttpParams();
    paramsFilesList = paramsFilesList.append("typeSideMenu", typeSideMenu);
    paramsFilesList = paramsFilesList.append("path", currentPath);
    return this.httpClient.get(url_get, { params: paramsFilesList});
  }

  
  

  public getFoldersListForViewer(pathFolder: string, allFolders: Array<FolderModel>): Array<FolderModel> {
    let folderListByPath: Array<FolderModel> = [];
         allFolders.forEach(element => {
           if(element.folderPath === pathFolder && element.name !=='') folderListByPath.push(element);
      })
      return folderListByPath;
  }

  
}
