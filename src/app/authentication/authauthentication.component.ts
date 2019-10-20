import { Component, OnInit} from '@angular/core';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-authauthentication',
  templateUrl: './authauthentication.component.html',
  styleUrls: ['./authauthentication.component.css']
})
export class AuthauthenticationComponent implements OnInit {

  public isLoginView: boolean;
  public isShowLoginMenu: boolean = false;
  private isShowRegistrMenu: boolean = false;
  private isShowInfoName: boolean = false;
  private isShowInfoPass: boolean = false;
  private isShowInfoPassRepeat: boolean = false;
  private isShowMenuUser: boolean = false;
  private loginForm: FormGroup;
  private userNameView: string;
  private userRoleView: string;
  private formErrView: string;


  constructor(private authService: AuthenticationService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.setViewIsLogin();
  }



  private showLoginMenu() {
    this.isShowRegistrMenu = false;
    this.isShowLoginMenu = !this.isShowLoginMenu;
  }
  private showRegistrMenu() {
    this.isShowRegistrMenu = !this.isShowRegistrMenu;
  }

  private initForm() {
    this.loginForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/[A-z0-9@]{3,}/)
      ]],
      pass: [null, [Validators.required,
      Validators.pattern(/[A-z0-9]{3,}/)
      ]],
      passRepeat: [null, [Validators.required,
      Validators.pattern(/[A-z0-9]{3,}/)]
      ]
    }, { validator: this.areEqual('pass', 'passRepeat') });
  }

  private areEqual(passKey: string, passRepeatKey: string) {
    return (group: FormGroup) => {
      let passInput = group.controls[passKey];
      let passRepeatInput = group.controls[passRepeatKey];
      if (passInput.value !== passRepeatInput.value && this.isShowRegistrMenu) {
        return passRepeatInput.setErrors({ notEquivalent: true })
      }
      else {
        return passRepeatInput.setErrors(null);
      }
    }
  }

  private onSubmit() {
    const controls = this.loginForm.controls;
    //  Проверяем форму на валидность
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.serverAuthorization(this.loginForm.value.name, this.loginForm.value.pass, this.isShowRegistrMenu)
  }


  private serverAuthorization(username: string, password: string, isNewUser: boolean) {
   this.authService.authenticate(username, password, isNewUser, 'home')
      .subscribe( (data) => {
        if (data) this.setViewIsLogin(); 
        else this.formErrView = 'Ошибка. Токен не получен.';
      },
        (error: HttpErrorResponse) => {
          this.setFormErrorView(error);
        });
  }

  private setViewIsLogin():boolean{
    let userIsLogin: boolean = this.authService.isUserLoggedIn();
    if(userIsLogin){
      this.userNameView = sessionStorage.getItem('username');
      this.userRoleView = this.setUserRole();
      this.isLoginView = true;
    } else {
      this.userNameView = '';
      this.userRoleView = '';
      this.isLoginView = false;
    }
    return userIsLogin;
  }

  private setFormErrorView(error: HttpErrorResponse) {
    let errMessage: string = '';
    const errStatus: number = error.status;
    switch (errStatus) {
      case 409:
        errMessage = 'Такое имя уже существует';
        break;
      case 400:
        errMessage = 'Неправильный запрос';
        break;
      case 401:
        errMessage = 'Ошибка в имени или пароле';
        break;
    case 0:
      errMessage = 'Нет связи с сервером.<br/> Повторите позже.'
      break;
      default:
          errMessage = error.message;
        break;
    }
    this.formErrView = errMessage;
  }
  private clearForm() {
    this.formErrView = '';
  }
  private logOut() {
    this.authService.logOut('start');
    this.setViewIsLogin();
    
  }

  private showInfoName() {
    this.isShowInfoName = !this.isShowInfoName;
  }
  private showInfoPass() {
    this.isShowInfoPass = !this.isShowInfoPass;
  }
  private showInfoPassRepeat() {
    this.isShowInfoPassRepeat = !this.isShowInfoPassRepeat;
  }
  private setUserRole(): string {
    if (sessionStorage.getItem('role') === 'USER') return 'user';
    if (sessionStorage.getItem('role') === 'ADMIN') return 'admin';
    return '';
  }
  private showMenuUser() {
    this.isShowMenuUser = !this.isShowMenuUser;
  }
  private baseDefault() {
    const messDefault: string = 'Настройки сервиса будут сброшены. Базы очищены, пользовотели только test и admin с одноименными паролями.\n\r Вы подтверждаете действие?';
    let isDefault = confirm(messDefault);
    if (isDefault) this.authService.setDefault().subscribe(() =>{ 
      this.setDefaultSeting();
      alert('База очищена');
    },
      (error: HttpErrorResponse) => {
        alert(error.status + '\n' + error.message)}
    );
  }
  private clearMyDisk(){
    const messDefault: string = 'ВСЕ папки и файлы на Вашем Диске будут удалены БЕЗВОЗВРАТНО!\n\r Вы подтверждаете действие?';
    let isDefault = confirm(messDefault);
    if (isDefault) this.authService.clearDisk().subscribe(() => {
      this.setDefaultSeting();
      alert('Диск очищен');
    }
    ,
      (error: HttpErrorResponse) => {
        alert(error.status + '\n' + error.message)}
    );
  }
  private setDefaultSeting(){
    sessionStorage.setItem('currentPath','/');
    window.location.reload();
  }
}
