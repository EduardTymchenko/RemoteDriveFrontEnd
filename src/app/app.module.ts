import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ContextMenuDirective } from './home-page/directives/context-menu.directive';
import { MoveDirective } from './home-page/directives/move.directive';
import { ClickOutsideDirective } from './home-page/directives/click-outside.directive';
import { ModalDialogComponent } from './home-page/componets/modal-dialog/modal-dialog.component';
import { MoveMenuComponent } from './home-page/componets/move-menu/move-menu.component';
import { DirectoryFoldersComponent } from './home-page/componets/directory-folders/directory-folders.component';
import { ViewTmpComponent } from './home-page/componets/view-tmp/view-tmp.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ContextMenuDirective,
    MoveDirective,
    ClickOutsideDirective,
    ModalDialogComponent,
    MoveMenuComponent,
    DirectoryFoldersComponent,
    ViewTmpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
