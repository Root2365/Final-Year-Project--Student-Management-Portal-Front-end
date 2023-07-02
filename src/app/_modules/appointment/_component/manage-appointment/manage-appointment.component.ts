import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbCalendar, NgbDate, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../shared/services/api.service';
import {AlertService} from '../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../shared/services/logger.service';
import {Endpoints} from '../../../../shared/endpoints';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-manage-appointment',
  templateUrl: './manage-appointment.component.html',
  styleUrls: ['./manage-appointment.component.css']
})
export class ManageAppointmentComponent implements OnInit {

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
  appointments: any;
  child: any;
  teacher: any;

  startTime = {hour: 0, minute: 0};
  endTime = {hour: 0, minute: 0};

  loggedInUserRole: any;

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

  ngOnInit(): void {
    this.teacher = null;
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(new NgbDate(this.toDate.year, this.toDate.month, this.toDate.day - 1));
    const from = Date.parse(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day + ' 00' + ':00' + ':00');
    const to = Date.parse(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + ' 23' + ':59' + ':59');

    this.fromCreate = this.calendar.getToday();

    this.createData = this.formBuilder.group({
      sid: ['', [Validators.required]],
      cid: ['', [Validators.required]],
      tid: ['', [Validators.required]],
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      status: ['PENDING', [Validators.required]],
    });
    this.getChild();
    this.getAppointment(from, to);

    this.loggedInUserRole = localStorage.getItem('user_roles');
    console.log(this.loggedInUserRole);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  create() {
    const from = this.fromCreate.year + '-' + this.fromCreate.month + '-' + this.fromCreate.day
      + ' 0' + this.startTime.hour + ':0' + this.startTime.minute + ':00';
    const to = this.fromCreate.year + '-' + this.fromCreate.month + '-' + this.fromCreate.day
      + ' 0' + this.endTime.hour + ':0' + this.endTime.minute + ':00';

    this.createData.value['start'] = (Date.parse(from));
    this.createData.value['end'] = (Date.parse(to));

    console.log(this.createData.value);
    this.apiService.post(this.createData.value, this.endpoints.create_appointment).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.appointments = response.data;
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

  getClasses(childId) {
    this.spinner.show();
    this.apiService.get(childId, this.endpoints.get_class_by_student).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.classes = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getAppointment(from, to) {
    console.log(from + '' + to);
    this.spinner.show();
    this.apiService.getQuery(this.endpoints.get_appointment_by_user + '?from=' + from + '&to=' + to).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.appointments = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getChild() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_students_by_parent).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.child = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getTeacher(classId: string) {
    this.spinner.show();
    this.apiService.get(classId, this.endpoints.get_teacher_by_class).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.teacher = response.data.id;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getColor(status: string) {
    if (status === 'PENDING') {
      return ' bg-warning';
    }

    if (status === 'CANCELLED') {
      return ' bg-danger';
    }

    if (status === 'ACCEPTED') {
      return ' bg-success';
    }
  }

  filterData() {
    const from = Date.parse(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day + ' 00' + ':00' + ':00');
    const to = Date.parse(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + ' 23' + ':59' + ':59');

    this.getAppointment(from, to);
  }

  updateStatus(id, status: string) {
    const data = {'status': status};
    this.apiService.put(data, this.endpoints.update_appointment, id).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.filterData();
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
}
