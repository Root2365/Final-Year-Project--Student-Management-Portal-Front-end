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
  selector: 'app-child-details',
  templateUrl: './child-details.component.html',
  styleUrls: ['./child-details.component.css']
})
export class ChildDetailsComponent implements OnInit {
  currentJustify = 'fill';
  currentOrientation = 'horizontal';

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
  }

}
