import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FolderModel } from '../model/folder-model';

@Injectable({
  providedIn: 'root'
})
export class ListFoldersService {
  public b:string;

  constructor(private httpClient: HttpClient) { }

  public getAllFolders(url: string) {
    
    return this.httpClient.get(url);
  }
  public getSize(urlHost: string, urlAction: string, pathFolder?: string) {
    let params = new HttpParams();
    pathFolder = '';
    params = params.append("pathFolder", pathFolder);
    return this.httpClient.get(urlHost + urlAction, { params: params});//добавить обработку успех
  }

  public getFoldersListForViewer(pathFolder: string, allFolders: Array<FolderModel>): Array<FolderModel> {
    let folderListByPath: Array<FolderModel> = [];
         allFolders.forEach(element => {
           if(element.folderPath === pathFolder && element.folderName !=='') folderListByPath.push(element);
      })
      return folderListByPath;
  }

  // public getFoldersListForViewer(pathFolder: string, allFolders: Array<FolderModel>) {
  //   let obj: object = {};// Для получения массива с уникальными именами
  //   if (pathFolder != "/") {
  //     // obj = { ".": true, "..": true };
  //     pathFolder = pathFolder + "/";
  //   }

  //   allFolders.forEach(element => {
  //     if (element.folderName.indexOf(pathFolder, 0) < 0) return; // проверяем путь
  //     if (element.split(pathFolder)[1] === "") return; // нет вложеной
  //     obj[element.split(pathFolder)[1].split('/')[0]] = true;
  //   });

  //   return Object.keys(obj);
  // }

  public changeFolders(urlHost: string, urlAction: string, currentFullName: string, newFullName?: string) {
    let currentFolderPath: string;
    let newFolderPath: string;
    let paramsFolders = new HttpParams();
    
    paramsFolders = paramsFolders.append("currentFolder", currentFullName);
    paramsFolders = paramsFolders.append("newFolder", newFullName);
    return this.httpClient.get(urlHost + urlAction, { params: paramsFolders});//добавить обработку успех
  }
}
