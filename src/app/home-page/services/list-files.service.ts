import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListFilesService {

  constructor(private httpClient: HttpClient) { }

  public getFilesList(url_get: string , typeSideMenu: string ,currentPath: string) {
    let paramsFilesList = new HttpParams();
    paramsFilesList = paramsFilesList.append("typeSideMenu", typeSideMenu);
    paramsFilesList = paramsFilesList.append("path", currentPath);
    return this.httpClient.get(url_get, { params: paramsFilesList});
  }

  public uploadFiles(uploadFiles_url: string, files:FileList, folderPath: string){
    
    let formData: FormData = new FormData();
    formData.append("folderPath", folderPath);
    for (let i = 0; i < files.length; i++) {
      formData.append('myfiles',files[i]);
    }
    return this.httpClient.post(uploadFiles_url, formData,{reportProgress:true,observe:"events"});
  }

  public downloadFile(downloadFile_url: string, idFile: number){
    return this.httpClient.get(downloadFile_url + '/' + idFile,{observe: "response" ,responseType:"blob" });
  }

  public changeFiles(urlAction: string, idFile: string, newName?: string, newPath?: string) {
    let paramsFile = new HttpParams();
    paramsFile = paramsFile.append("idFile", idFile);
    paramsFile = paramsFile.append("newName", newName);
    paramsFile = paramsFile.append("newPath", newPath);
    return this.httpClient.get(urlAction, { params: paramsFile});
  }
}
