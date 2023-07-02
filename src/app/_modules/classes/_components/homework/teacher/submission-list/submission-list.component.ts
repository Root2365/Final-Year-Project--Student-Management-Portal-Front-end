import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Endpoints} from '../../../../../../shared/endpoints';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../../shared/services/api.service';
import {DialogService} from '../../../../../../shared/_modal/dialog.service';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 5,
    processing: true,
    searching: true,
  };
  dtTrigger: Subject<any> = new Subject<any>();

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
  selectedStudentId: any;

  constructor(private httpClient: HttpClient,
              private endpoints: Endpoints,
              private calendar: NgbCalendar,
              private translate: TranslateService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private dialogService: DialogService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.teacher = null;
    this.getDefaultData();
  }

  getDefaultData() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_class).subscribe((response: any) => {
      this.spinner.hide();
      this.selectedClassId = response.data[0].id;
      this.classes = response.data;
      this.httpClient.get<any[]>(this.endpoints.homework + '/get-by-id?id=' + localStorage.getItem('hid'))
        .subscribe(data => {
          this.selectedHomeworkId = localStorage.getItem('hid');
          // @ts-ignore
          this.submittedHomeworkList = data.studentHomeworkList;
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
    localStorage.removeItem('hid');
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  getHomeworkSubmissionList(id, homework_list_modal): any {
    this.spinner.show();
    this.apiService.getQuery(this.endpoints.homework + '/get-by-id?id=' + id)
      .subscribe(response => {
        this.spinner.hide();
        // @ts-ignore
        this.submittedHomeworkList = response.studentHomeworkList;
        this.dtTrigger.next();
        console.log(this.submittedHomeworkList);
        setTimeout(() => {
          this.modalRef = this.modalService.open(homework_list_modal, {ariaLabelledBy: 'modal-basic-title', centered: true});
        }, 200);

      }, error => {
        this.spinner.hide();
      });
  }

  markHomework(mark) {
    const data = {
      'homeworkId': this.selectedHomeworkId,
      'studentId': this.selectedStudentId,
      'marks': mark
    };

    this.spinner.show();
    this.apiService.put(data, this.endpoints.homework + '/mark-homework', '')
      .subscribe(response => {
        this.spinner.hide();
        console.log(response);
        // @ts-ignore
        this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
      }, error => {
        this.spinner.hide();
      });
  }

  downloadFile(submission_id) {
    const url = this.endpoints.homework + '/' + submission_id + '/file';
    const headers = new HttpHeaders().set('Accept', 'application/pdf');

    this.http.get(url, { responseType: 'blob', observe: 'response' }).subscribe((response) => {
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Response:', response);
      console.log('Content-Disposition:', contentDisposition);

      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      console.log('Matches:', matches);

      const filename = matches && matches[1] ? matches[1].replace(/['"]/g, '') : 'file';
      console.log('Filename:', filename);

      const newBlob = new Blob([response.body], { type: response.body.type });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob, filename);
        return;
      }

      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      link.download = filename;
      link.click();
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 400);
    }, (error) => {
      console.error(error);
    });
  }


  markHomeworkModal(sid, homework_mark) {
    this.selectedStudentId = sid;
    this.modalRef = this.modalService.open(homework_mark, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }
}


