import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {

  constructor(private httpClient: HttpClient) { }

  public getListAdditional(host_url: string, url_get: string){
    return this.httpClient.get(host_url + url_get);

  }
}
