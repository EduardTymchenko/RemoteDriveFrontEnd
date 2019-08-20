import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListFilesService {

  constructor(private httpClient: HttpClient) { }

  public getFilesList(host_url: string, url_get: string ,currentPath: string) {
    let paramsFilesList = new HttpParams();
    paramsFilesList = paramsFilesList.append("folderPath", currentPath);
    return this.httpClient.get(host_url + url_get, { params: paramsFilesList});
  }

  public uploadFiles(host_url: string, uploadFiles_url: string, files:FileList, folderPath: string){
    let formData: FormData = new FormData();
    formData.append("folderPath", folderPath);
    for (let i = 0; i < files.length; i++) {
      formData.append('myfiles',files[i]);
    }
    console.log(formData.getAll('myfiles'));
    return this.httpClient.post(host_url + uploadFiles_url, formData)
  }

  public changeFiles(urlHost: string, urlAction: string, idFile: string, newName?: string, newPath?: string) {
    let paramsFile = new HttpParams();
    paramsFile = paramsFile.append("idFile", idFile);
    paramsFile = paramsFile.append("newName", newName);
    paramsFile = paramsFile.append("newPath", newPath);
    return this.httpClient.get(urlHost + urlAction, { params: paramsFile});//добавить обработку успех
  }
}
