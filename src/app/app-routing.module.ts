import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { StartPageComponent } from './start-page/start-page.component';
import { AuthauthenticationComponent } from './authentication/authauthentication.component'
import { AuthGaurdService } from './authentication/services/auth-gaurd.service';

const routes: Routes = [
  { path: 'home', component: HomePageComponent, canActivate:[AuthGaurdService] },
  { path: '', component: StartPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
