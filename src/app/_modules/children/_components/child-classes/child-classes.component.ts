import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../shared/services/api.service';
import {AlertService} from '../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../shared/services/logger.service';
import {Endpoints} from '../../../../shared/endpoints';

@Component({
  selector: 'app-child-classes',
  templateUrl: './child-classes.component.html',
  styleUrls: ['./child-classes.component.css']
})
export class ChildClassesComponent implements OnInit {
  classes: any;

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private alertService: AlertService,
              private router: Router,
              private translate: TranslateService,
              private dialogService: DialogService,
              private loggerService: LoggerService,
              private endpoints: Endpoints) {
    translate.addLangs(['us', 'de']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit(): void {
    this.getClasses();
  }

  gotoDetails(id) {
    localStorage.removeItem('class_id');
    this.router.navigate(['child/classes/details']);
    localStorage.setItem('class_id', id);
  }

  getClasses() {
    this.spinner.show();
    this.apiService.get(localStorage.getItem('child_id'), this.endpoints.get_class_by_student).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.classes = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

}
