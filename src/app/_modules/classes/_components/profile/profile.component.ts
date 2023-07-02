import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../../../shared/services/api.service';
import {Endpoints} from '../../../../shared/endpoints';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  profile: any;

  constructor(private apiManagerService: ApiService,
              private spinner: NgxSpinnerService,
              public translate: TranslateService,
              public endpoints: Endpoints,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.getProfile();
  }

  public doUpdate(name, email, phone): void {
    const data = {
      'name': name,
      'email': email,
      'phone': phone
    };
    this.spinner.show();
    this.apiManagerService.put(data, this.endpoints.profile + '/update', '').subscribe((response: any) => {
      this.dialogService.open('Profile Updated Successfully', environment.info_message, 'success', environment.info);
      this.getProfile();
      this.spinner.hide();
    });

  }

  public getProfile(): void {
    this.spinner.show();
    this.apiManagerService.get('', this.endpoints.profile + '/get').subscribe((response: any) => {
      console.log(response);
      this.profile = response;
      this.spinner.hide();
    });
  }

  updatePassword(old_password, new_password, confirm_password) {
    const passwords = {
      'old_password': old_password,
      'new_password': new_password,
    };

    if (new_password === confirm_password) {
      this.apiManagerService.put(passwords, this.endpoints.profile + '/update-password', '').subscribe((response: any) => {
          this.spinner.hide();
          this.dialogService.open('Password Updated Successfully', environment.info_message, 'success', environment.info);
        },
        error => {
          this.spinner.hide();
        });
    } else {
      this.dialogService.open('Password not matched', environment.error_message, 'danger', environment.error);
    }

  }
}
