import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Endpoints} from '../../../../shared/endpoints';
import {NgbCalendar, NgbDate, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../shared/services/api.service';
import {AlertService} from '../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../shared/services/logger.service';
import {DataTableDirective} from 'angular-datatables';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 5,
    processing: true,
    searching: true,
  };
  dtTrigger: Subject<any> = new Subject<any>();

  attendanceList: any[] = [];
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
  selectedClassId: any;
  present: any;
  absent: any;

  constructor(private httpClient: HttpClient,
              private endpoints: Endpoints,
              private calendar: NgbCalendar,
              private translate: TranslateService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.teacher = null;
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getToday();
    this.getDefaultData();
  }

  getDefaultData() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_class).subscribe((response: any) => {
      this.spinner.hide();
      this.selectedClassId = response.data[0].id;
      this.classes = response.data;

      const from = this.fromDate.year + '-' + this.padNumber(this.fromDate.month) + '-' + this.padNumber(this.fromDate.day);
      const to = this.toDate.year + '-' + this.padNumber(this.toDate.month) + '-' + this.padNumber(this.toDate.day);

      this.httpClient.get<any[]>(this.endpoints.attendance + '?classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to)
        .subscribe(data => {
          this.attendanceList = data;
          this.dtTrigger.next();
          this.apiService.getQuery(this.endpoints.attendance + '/report?classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to).subscribe((response: any) => {
              this.present = response.present.toFixed(2);
              this.absent = response.absent.toFixed(2);
              ;
            },
            error => {
              console.log(error);
            }
          );
        });
      console.log(this.selectedClassId);
    }, error => {
      this.spinner.hide();
    });
  }

  padNumber(number: number) {
    return number < 10 ? '0' + number : number.toString();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
  }

  loadDatatables() {
    const that = this;
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true
    };
  }

  filterData(classId) {
    const from = this.fromDate.year + '-' + this.padNumber(this.fromDate.month) + '-' + this.padNumber(this.fromDate.day);
    const to = this.toDate.year + '-' + this.padNumber(this.toDate.month) + '-' + this.padNumber(this.toDate.day);

    this.getFilteredData(classId, from, to);
  }

  private getFilteredData(classId, from: string, to: string) {
    this.spinner.show();
    this.httpClient.get<any[]>(this.endpoints.attendance + '?classId=' + classId + '&startDate=' + from + '&endDate=' + to)
      .subscribe(data => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          this.modalService.dismissAll();
          dtInstance.destroy();
          setTimeout(() => {
            this.dtTrigger.next(void 0);
            this.attendanceList = data;
            this.spinner.hide();
          }, 100);
        });
        this.apiService.getQuery(this.endpoints.attendance + '/report?classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to).subscribe((response: any) => {
            this.present = response.present.toFixed(2);
            this.absent = response.absent.toFixed(2);
            ;
          },
          error => {
            console.log(error);
          }
        );
      });
  }

  downloadAttendance(classId: string) {
    const from = this.fromDate.year + '-' + this.padNumber(this.fromDate.month) + '-' + this.padNumber(this.fromDate.day);
    const to = this.toDate.year + '-' + this.padNumber(this.toDate.month) + '-' + this.padNumber(this.toDate.day);

    const url = this.endpoints.attendance + `/download?classId=${classId}&startDate=${from}&endDate=${to}`;
    const headers = new HttpHeaders().set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    this.httpClient.get(url, {responseType: 'blob', headers}).subscribe((response) => {
      const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'attendance.xlsx';
      link.click();
    }, (error) => {
      console.error(error);
    });
  }
}



