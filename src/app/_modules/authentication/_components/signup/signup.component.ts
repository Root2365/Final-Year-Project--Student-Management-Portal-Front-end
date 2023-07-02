import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../../../shared/services/_alert';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from 'src/app/shared/services/logger.service';
import {ApiService} from '../../../../shared/services/api.service';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {Endpoints} from '../../../../shared/endpoints';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, AfterViewInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  registerForm: FormGroup;
  submitted = false;

  signupFormShow = false;
  allCustomers: any;

  userType: any;

  constructor(private apiManagerService: ApiService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private loggerService: LoggerService,
              private dialogService: DialogService,
              private endpoints: Endpoints) {
    translate.addLangs(['us', 'de']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
          this.userType = params.type;
        }
      );

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      con_password: ['', Validators.required],
      role: [[this.userType]]
    });


    /*if (localStorage.getItem('user_token')) {
      this.router.navigate(['dashboard/home']);
    }*/
  }

  ngAfterViewInit() {
  }

  get fields() {
    return this.registerForm.controls;
  }

  public doRegistration(): void {
    this.spinner.show();
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.spinner.hide();
      this.loggerService.log('registerForm', this.registerForm);
      return;
    }

    this.apiManagerService.post(this.registerForm.value, this.endpoints.registration).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log('response', response);

        if (!response.status) {
          this.dialogService.open(response.message, environment.error_message, 'danger', environment.error);
          return;
        }
        this.router.navigate(['authentication/login']);

      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.dialogService.open(error.error.message, environment.error_message, 'danger', environment.error);
      });
  }
}
