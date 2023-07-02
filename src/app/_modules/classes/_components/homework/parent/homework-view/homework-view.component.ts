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
import {Router} from '@angular/router';
import {environment} from '../../../../../../../environments/environment';
import {LoggerService} from '../../../../../../shared/services/logger.service';

@Component({
  selector: 'app-homework-view',
  templateUrl: './homework-view.component.html',
  styleUrls: ['./homework-view.component.css']
})
export class HomeworkViewComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 5,
    processing: true,
    searching: true,
  };
  dtTrigger: Subject<any> = new Subject<any>();
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  closeResult = '';
  createData: FormGroup;
  classes: any;
  activities: any;
  child: any;
  teacher: any;
  selectedClassId: any;
  present: any;
  absent: any;
  selectedChildId: any;
  selectedHomeworkId: any;
  homeworkList: any;
  modalRef: NgbModalRef;
  selectedFile: any;

  constructor(private httpClient: HttpClient,
              private endpoints: Endpoints,
              private calendar: NgbCalendar,
              private translate: TranslateService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private loggerService: LoggerService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.teacher = null;
    this.toDate = this.calendar.getToday();
    this.fromDate = this.calendar.getToday();

    this.selectedChildId = localStorage.getItem('child_id');

    this.getDefaultData(this.selectedChildId);
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  setClassId(classId) {
    this.selectedClassId = classId;
    this.loggerService.log(this.selectedClassId);
  }

  getDefaultData(child_id) {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_students_by_parent).subscribe((response: any) => {
      this.spinner.hide();
      this.selectedChildId = response.data[0].id;
      this.child = response.data;

      this.httpClient.get<any[]>(this.endpoints.homework + '/get-by-student-id?id=' + this.selectedChildId)
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
    this.getFilteredData(classId);
  }

  private getFilteredData(childId) {
    this.spinner.show();
    this.httpClient.get<any[]>(this.endpoints.homework + '/get-by-student-id?id=' + childId)
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

  submitHomework(submit_modal, homeworkId: any) {
    this.selectedHomeworkId = homeworkId;
    this.open(submit_modal);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('studentId', this.selectedChildId);
    formData.append('homeworkId', this.selectedHomeworkId);

    this.apiService.post(formData, this.endpoints.homework + '/submit-homework')
      .subscribe(
        (response) => {
          // @ts-ignore
          this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
          this.modalRef.close();
        },
        (error) => {
          this.dialogService.open(error.message, environment.error_message, 'danger', environment.error);
          this.modalRef.close();
        }
      );
  }
}
