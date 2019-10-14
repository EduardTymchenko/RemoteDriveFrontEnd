import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


export class AuthRequest {
  private username: string;
  private password: string;
  public status: string;
  private role: string = 'USER';
  
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private router: Router) { }


  public authenticate(username: string, password: string, isNewUser: boolean, namePageRedirect: string) {
    let authUser: AuthRequest = new AuthRequest(username, password);
    const url_authenticate: string = '/authenticate';
    if (isNewUser) authUser.status = 'add';
    else authUser.status = 'auth';
    return this.httpClient.post<any>(url_authenticate, authUser).pipe(
      map(
        userData => {
          if (userData.token !== null && userData.token !== undefined) {
            sessionStorage.setItem('username', username);
            let tokenStr = 'Bearer ' + userData.token;
            sessionStorage.setItem('token', tokenStr);
            sessionStorage.setItem('role', this.getRoleJwt(userData));
            this.router.navigate([namePageRedirect]);
            return true;
          }
          return false;
        }
      )

    );
  }

  private getRoleJwt(dataToken: any): string {
    let jwtData: string = dataToken.token.split('.')[1];
    let decodedJwtJsonData: any = window.atob(jwtData);
    let decodedJwtData: any = JSON.parse(decodedJwtJsonData);
    return decodedJwtData.role;
  }


  public setDefault() {
    return this.httpClient.get('/rest/default');
  }

  public clearDisk() {
    return this.httpClient.get('/rest/clearDisk');
  }

  public isUserLoggedIn(): boolean {
    let token: string = sessionStorage.getItem('token');
    return !(token === null)
  }

  public logOut(namePageAfterLogout: string) {
    sessionStorage.clear();
    this.router.navigate([namePageAfterLogout]);
    
  }
}
