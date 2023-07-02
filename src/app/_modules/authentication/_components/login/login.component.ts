import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../../../shared/services/_alert';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from 'src/app/shared/services/logger.service';
import {ApiService} from '../../../../shared/services/api.service';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {environment} from '../../../../../environments/environment';
import {Endpoints} from '../../../../shared/endpoints';
import {PARENT_ROUTES, TEACHER_ROUTES} from '../../../../shared/sidebar/menu-items';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  loginData: FormGroup;
  submitted = false;

  loginform = true;
  recoverform = false;

  returnUrl: string;

  constructor(private apiManagerService: ApiService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              public translate: TranslateService,
              private loggerService: LoggerService,
              private dialogService: DialogService,
              private endpoints: Endpoints) {
    translate.addLangs(['us', 'de']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {
    this.loginData = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get fields() {
    return this.loginData.controls;
  }

  ngAfterViewInit() {
    if (this.route.snapshot.queryParams['verified'] === 'true') {
      this.alertService.success('succ_email_verified', {autoClose: true});
    }

    if (this.route.snapshot.queryParams['verified'] === 'false') {
      this.alertService.error('err_email_verify_expired', {autoClose: true});
    }
  }

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }

  showLoginForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }

  public doLogin(): void {
    this.spinner.show();
    this.submitted = true;

    if (this.loginData.invalid) {
      this.spinner.hide();
      return;
    }

    this.apiManagerService.post(this.loginData.value, this.endpoints.login).subscribe((response: any) => {
        this.spinner.hide();
        const data = response.data;
        this.loggerService.log('response', data);
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_username', data.username);
        localStorage.setItem('user_roles', data.roles);
        let defaultUrl = '';
        if (localStorage.getItem('user_roles').includes('ROLE_TEACHER')) {
          defaultUrl = 'classes/manage';
        } else {
          defaultUrl = 'child/manage';
        }
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || defaultUrl;
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error.status);
        if (error.status === 401) {
          this.dialogService.open('err_invalid_cred', environment.error_message, 'danger', environment.error);
        } else {
          this.dialogService.open('err_invalid_cred', environment.error_message, 'danger', environment.error);
        }
      });
  }

  sendResetLink(reg_email: any) {
    this.spinner.show();

    const data = {
      'email': reg_email
    };

     this.apiManagerService.post(data, this.endpoints.reset).subscribe((response: any) => {
         this.spinner.hide();
         this.showLoginForm();
         this.dialogService.open('Reset link sent to your email.', environment.info_message, 'success', environment.info);
       },
       error => {
         this.spinner.hide();
         this.loggerService.log('error', error.status);
         if (error.status === 401) {
           this.alertService.error('err_invalid_cred', {autoClose: false});
         } else {
           this.alertService.error('err_common', {autoClose: false});
         }
       });
  }
}
