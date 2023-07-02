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
  selector: 'app-child-rating',
  templateUrl: './child-rating.component.html',
  styleUrls: ['./child-rating.component.css']
})
export class ChildRatingComponent implements OnInit {
  childRatings: any;
  classes: any;
  child: any;
  selectedChildId: any;
  selectedClassId: any;

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
    this.selectedChildId = localStorage.getItem('child_id');
    this.selectedClassId = localStorage.getItem('class_id');
    this.loggerService.log(this.selectedChildId);
    this.loggerService.log(this.selectedClassId);

    this.getStudentRatings(this.selectedClassId, this.selectedChildId);
    this.getClasses(this.selectedChildId);
    this.getChild();
  }

  getStudentRatings(classId, childId) {
    this.spinner.show();
    this.apiService.get('student/' + childId + '/classes/' + classId, this.endpoints.get_rating)
      .subscribe((response: any) => {
          this.spinner.hide();
          this.childRatings = response.data;
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

  filterRating(classId: string, childId: string) {
    localStorage.setItem('class_id', classId);
    localStorage.setItem('child_id', childId);

    this.getClasses(childId);

    setTimeout(() => {
      this.getStudentRatings(classId, childId);
    }, 500);
    this.selectedChildId = localStorage.getItem('child_id');
    this.selectedClassId = localStorage.getItem('class_id');

  }
}
