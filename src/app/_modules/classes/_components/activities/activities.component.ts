import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbCalendar, NgbDate, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../shared/services/api.service';
import {AlertService} from '../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../shared/services/logger.service';
import {Endpoints} from '../../../../shared/endpoints';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  constructor(private calendar: NgbCalendar,
              private translate: TranslateService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private alertService: AlertService,
              private router: Router,
              private dialogService: DialogService,
              private loggerService: LoggerService,
              private endpoints: Endpoints) {
    translate.addLangs(['us', 'de']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromCreate: NgbDateStruct;
  closeResult = '';
  createData: FormGroup;
  classes: any;
  activities: any;
  child: any;
  teacher: any;

  startTime = {hour: 0, minute: 0};
  endTime = {hour: 0, minute: 0};

  loggedInUserRole: any;

  fileName: any;
  base64textString: any;

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.teacher = null;
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(new NgbDate(this.toDate.year, this.toDate.month, this.toDate.day - 1));
    const from = Date.parse(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day + ' 00' + ':00' + ':00');
    const to = Date.parse(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + ' 23' + ':59' + ':59');
    this.getActivities(localStorage.getItem('class_id'), from, to);

    this.fromCreate = this.calendar.getToday();
    this.createData = this.formBuilder.group({
      title: ['', [Validators.required]],
      filePath: ['', [Validators.required]],
      type: ['', [Validators.required]],
      activityDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      cid: ['', [Validators.required]]
    });
    this.getClasses();
    this.loggedInUserRole = localStorage.getItem('user_roles');
  }

  getClasses() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_class).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.classes = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ActivitiesComponent.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  create(cid) {
    this.createData.value['cid'] = cid;
    this.createData.value['filePath'] = this.base64textString;
    this.createData.value['activityDate'] = Date.now();
    if (this.base64textString) {
      this.createData.value['type'] = 'IMAGE';
    } else {
      this.createData.value['type'] = 'STATUS';
    }
    console.log(this.createData.value);

    this.apiService.post(this.createData.value, this.endpoints.create_activity).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.createData.reset();
        this.base64textString = null;
        this.modalService.dismissAll();
        setTimeout(() => {
          if (response.status) {
            this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
          } else {
            this.dialogService.open(response.message, environment.error_message, 'danger', environment.error);
          }
        }, 100);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  onUploadChange(file: any): any {
    if (file) {
      const reader = new FileReader();
      this.fileName = file.name;
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any): any {
    this.base64textString = btoa(e.target.result);
  }

  getActivities(classId, from, to) {
    console.log(from + '' + to);
    this.spinner.show();
    this.apiService.getQuery(this.endpoints.get_activity + '/' + classId + '?from=' + from + '&to=' + to).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.activities = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  filterData(classId) {
    const from = Date.parse(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day + ' 00' + ':00' + ':00');
    const to = Date.parse(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + ' 23' + ':59' + ':59');

    this.getActivities(classId, from, to);
  }
}
