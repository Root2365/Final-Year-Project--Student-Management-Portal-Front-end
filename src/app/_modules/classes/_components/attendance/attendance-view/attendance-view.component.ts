import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {NgbCalendar, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Endpoints} from '../../../../../shared/endpoints';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../shared/services/api.service';
import {LoggerService} from '../../../../../shared/services/logger.service';

@Component({
    selector: 'app-attendance-view',
    templateUrl: './attendance-view.component.html',
    styleUrls: ['./attendance-view.component.css']
})
export class AttendanceViewComponent implements OnInit,OnDestroy {

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
    presentDay: any;
    absent: any;
    absentDay: any;
    total: any;
    selectedChildId: any;

    constructor(private httpClient: HttpClient,
                private endpoints: Endpoints,
                private calendar: NgbCalendar,
                private translate: TranslateService,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService,
                private apiService: ApiService,
                private loggerService: LoggerService) {
    }

    ngOnInit(): void {
        this.teacher = null;
        this.toDate = this.calendar.getToday();
        this.fromDate = this.calendar.getToday();

        this.selectedChildId = localStorage.getItem('child_id');
        this.selectedClassId = localStorage.getItem('class_id');

        this.getClasses(this.selectedChildId);
        this.getDefaultData();
    }

    getClasses(child_id) {
        this.spinner.show();
        this.apiService.get(child_id, this.endpoints.get_class_by_student).subscribe((response: any) => {
                this.spinner.hide();
                console.log(response);
                this.classes = response.data;
                this.selectedClassId = response.data[0].id;
            },
            error => {
                this.spinner.hide();
            }
        );
    }

    setClassId(classId) {
        this.selectedClassId = classId;
        this.loggerService.log(this.selectedClassId);
    }

    getDefaultData() {
        this.spinner.show();
        this.apiService.get('', this.endpoints.get_students_by_parent).subscribe((response: any) => {
                this.spinner.hide();
                this.loggerService.log(response);
                this.child = response.data;
                this.apiService.get(this.selectedChildId, this.endpoints.get_class_by_student).subscribe((response: any) => {
                    this.spinner.hide();
                    this.selectedClassId = response.data[0].id;
                    this.classes = response.data;

                    const from = this.fromDate.year + '-' + this.padNumber(this.fromDate.month) + '-' + this.padNumber(this.fromDate.day);
                    const to = this.toDate.year + '-' + this.padNumber(this.toDate.month) + '-' + this.padNumber(this.toDate.day);

                    this.httpClient.get<any[]>(this.endpoints.attendance + '/student?studentId=' + this.selectedChildId + '&classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to)
                        .subscribe(data => {
                            this.attendanceList = data;
                            this.dtTrigger.next();
                            this.apiService.getQuery(this.endpoints.attendance + '/report/student?studentId=' + this.selectedChildId + '&classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to).subscribe((response: any) => {
                                    this.present = response.present.toFixed(2);
                                    this.absent = response.absent.toFixed(2);
                                    this.absentDay = response.absentDay;
                                    this.presentDay = response.presentDay;
                                    this.total = response.total;
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
            },
            error => {
                this.spinner.hide();
            }
        );

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
        const from = this.fromDate.year + '-' + this.padNumber(this.fromDate.month) + '-' + this.padNumber(this.fromDate.day);
        const to = this.toDate.year + '-' + this.padNumber(this.toDate.month) + '-' + this.padNumber(this.toDate.day);

        this.getFilteredData(classId, from, to);
    }

    private getFilteredData(classId, from: string, to: string) {
        this.spinner.show();
        this.httpClient.get<any[]>(this.endpoints.attendance + '/student?studentId=' + this.selectedChildId + '&classId=' + classId + '&startDate=' + from + '&endDate=' + to)
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
                this.apiService.getQuery(this.endpoints.attendance + '/report/student?studentId=' + this.selectedChildId + '&classId=' + this.selectedClassId + '&startDate=' + from + '&endDate=' + to).subscribe((response: any) => {
                        this.present = response.present.toFixed(2);
                        this.absent = response.absent.toFixed(2);
                        this.absentDay = response.absentDay;
                        this.presentDay = response.presentDay;
                        this.total = response.total;
                    },
                    error => {
                        console.log(error);
                    }
                );
            });
    }
}
