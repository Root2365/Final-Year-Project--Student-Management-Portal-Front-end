import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Endpoints} from '../../../../../../shared/endpoints';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../../shared/services/api.service';
import {DialogService} from '../../../../../../shared/_modal/dialog.service';
import {environment} from '../../../../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-homework-management',
  templateUrl: './homework-management.component.html',
  styleUrls: ['./homework-management.component.css']
})
export class HomeworkManagementComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 5,
    processing: true,
    searching: true,
  };
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger_list: Subject<any> = new Subject<any>();

  homeworkList: any[] = [];
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  submissionDeadline: NgbDateStruct;
  closeResult = '';
  createData: FormGroup;
  classes: any;
  activities: any;
  child: any;
  teacher: any;
  selectedClassId: any;
  present: any;
  absent: any;
  modalRef: NgbModalRef;
  homework: any;
  title: any;
  details: any;
  selectedHomeworkId: any;
  submittedHomeworkList: any;

  constructor(private httpClient: HttpClient,
              private endpoints: Endpoints,
              private calendar: NgbCalendar,
              private translate: TranslateService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private dialogService: DialogService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.teacher = null;
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getToday();
    this.submissionDeadline = this.calendar.getToday();
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

      this.httpClient.get<any[]>(this.endpoints.homework + '/get-by-class?classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to)
        .subscribe(data => {
          this.homeworkList = data;
          this.dtTrigger.next();
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

  filterData(classId) {
    const from = this.fromDate.year + '-' + this.padNumber(this.fromDate.month) + '-' + this.padNumber(this.fromDate.day);
    const to = this.toDate.year + '-' + this.padNumber(this.toDate.month) + '-' + this.padNumber(this.toDate.day);

    this.getFilteredData(classId, from, to);
  }

  private getFilteredData(classId, from: string, to: string) {
    this.spinner.show();
    this.httpClient.get<any[]>(this.endpoints.homework + '/get-by-class?classId=' + classId + '&startDate=' + from + '&endDate=' + to)
      .subscribe(data => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          this.modalService.dismissAll();
          dtInstance.destroy();
          setTimeout(() => {
            this.dtTrigger.next(void 0);
            this.homeworkList = data;

            this.spinner.hide();
          }, 100);
        });
      });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  getHomeworkByID(id, content) {
    this.spinner.show();
    this.apiService.getQuery(this.endpoints.homework + '/get-by-id?id=' + id)
      .subscribe(response => {
        this.spinner.hide();
        this.homework = response;
        // @ts-ignore
        this.selectedClassId = response.classId;
        // @ts-ignore
        this.title = response.name;
        // @ts-ignore
        this.details = response.details;
        // @ts-ignore
        const parts = response.deadline.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        this.selectedHomeworkId = id;
        this.submissionDeadline = {year: year, month: month, day: day};

        setTimeout(() => {
          this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
        }, 200);

      }, error => {
        this.spinner.hide();
      });
  }

  createHomework(title: string, details: string) {
    const deadline = this.submissionDeadline.year + '-' + this.padNumber(this.submissionDeadline.month) + '-' +
      this.padNumber(this.submissionDeadline.day);
    console.log(title + ' ' + details + ' ' + this.selectedClassId + ' ' + deadline);

    const data = {
      'name': title,
      'details': details,
      'deadline': deadline,
      'classId': this.selectedClassId
    };
    this.spinner.show();
    this.apiService.post(data, this.endpoints.homework + '/create')
      .subscribe(response => {
        this.spinner.hide();
        // @ts-ignore
        this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        this.modalRef.close();
      }, error => {
        this.spinner.hide();
      });
  }

  updateHomework() {
    const deadline = this.submissionDeadline.year + '-' + this.padNumber(this.submissionDeadline.month) + '-' +
      this.padNumber(this.submissionDeadline.day);
    const data = {
      'name': this.title,
      'details': this.details,
      'deadline': deadline,
      'classId': this.selectedClassId
    };
    this.spinner.show();
    this.apiService.put(data, this.endpoints.homework + '/update', this.selectedHomeworkId)
      .subscribe(response => {
        this.spinner.hide();
        // @ts-ignore
        this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        this.modalRef.close();
      }, error => {
        this.spinner.hide();
      });
  }

  getHomeworkSubmissionList(id): any {
    localStorage.removeItem('hid');
    localStorage.setItem('hid', id);
    this.router.navigate(['/classes/homework/submission-list']);
  }

  delete(id) {
    this.spinner.show();
    this.apiService.delete(id, this.endpoints.homework)
      .subscribe((response: any) => {
        this.dialogService.open('Deleted Successfully', environment.info_message, 'success', environment.info);
        this.spinner.hide();
        this.filterData(this.selectedClassId);
      }, error => {
        this.spinner.hide();
      });
  }
}
