import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {

  constructor(private httpClient: HttpClient) { }

  public changeStarStatus(urlAction: string, typeMenu: string, id: number) {
    let paramsList = new HttpParams();
    paramsList = paramsList.append('typeMenu',typeMenu);
    paramsList = paramsList.append('id',id.toString());
    return this.httpClient.get(urlAction, { params: paramsList});
  }

  public getSize(urlAction: string, pathFolder?: string) {
    let params = new HttpParams();
    if(pathFolder === undefined) 
    pathFolder = '';
    params = params.append("pathFolder", pathFolder);
    return this.httpClient.get(urlAction, { params: params});//добавить обработку успех
  }
  
  public search(urlAction: string, searchString: string) {
    let params = new HttpParams();
        params = params.append("searchString", searchString);
    return this.httpClient.get(urlAction, { params: params});//добавить обработку успех
  }

  public changeData(urlAction: string, currentFolderId: string, newPath:string = '', newName:string = '') {
    let paramsFolders = new HttpParams();
    paramsFolders = paramsFolders.append("id", currentFolderId);
    paramsFolders = paramsFolders.append("newPath", newPath);
    paramsFolders = paramsFolders.append("newName", newName);
    return this.httpClient.get(urlAction, { params: paramsFolders});//добавить обработку успех
  }

  public clearBasket (urlAction: string){
    return this.httpClient.get(urlAction);
  }
  public recover (urlAction: string, typeObject: string, id: string){
    let paramsRecover = new HttpParams();
    paramsRecover = paramsRecover.append("id", id);
    paramsRecover = paramsRecover.append("typeObject", typeObject);
    return this.httpClient.get(urlAction,{ params: paramsRecover});
  }
}
