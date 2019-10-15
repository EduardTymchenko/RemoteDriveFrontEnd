import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/services/authentication.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent {
  constructor(private authService: AuthenticationService, private router: Router) { }

  public goHomePage() {
    if (this.authService.isUserLoggedIn()) this.router.navigate(['/home']);
    else {
      alert("Авторизируйтесь!");
      return false;
    }
  }

}
