import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ModalDialogComponent } from './home-page/componets/modal-dialog/modal-dialog.component';
import { MoveMenuComponent } from './home-page/componets/move-menu/move-menu.component';
import { DirectoryFoldersComponent } from './home-page/componets/directory-folders/directory-folders.component';
import { StartPageComponent } from './start-page/start-page.component';
import { AuthauthenticationComponent } from './authentication/authauthentication.component';
import { BasicAuthInterceptorService } from './authentication/services/basic-auth-interceptor.service';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { LocationStrategy, PathLocationStrategy,HashLocationStrategy, APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ClickOutsideDirective,
    ModalDialogComponent,
    MoveMenuComponent,
    DirectoryFoldersComponent,
    StartPageComponent,
    AuthauthenticationComponent,
    AutoFocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {  
      provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptorService, multi:true
    }
    // ,
    // {
    //   provide: LocationStrategy, useClass: HashLocationStrategy
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
