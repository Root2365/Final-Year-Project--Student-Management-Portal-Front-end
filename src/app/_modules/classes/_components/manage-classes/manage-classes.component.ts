import {Component, OnInit, TemplateRef} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {ApiService} from '../../../../shared/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../../environments/environment';
import {Endpoints} from '../../../../shared/endpoints';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../shared/services/logger.service';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.css']
})
export class ManageClassesComponent implements OnInit {
  closeResult = '';
  classes: any;
  classById: any;
  className: any;
  classId: any;
  classData: FormGroup;
  classDataUpdate: FormGroup;
  submitted = false;

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

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  confirmDelete(content, className, classId) {
    this.className = className;
    this.classId = classId;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
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

  ngOnInit(): void {
    this.getClasses();

    this.classData = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.classDataUpdate = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  get fields() {
    return this.classData.controls;
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

  createClass() {
    this.spinner.show();
    this.submitted = true;

    if (this.classData.invalid) {
      this.spinner.hide();
      return;
    }

    this.apiService.post(this.classData.value, this.endpoints.create_class).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.classes = response.data;
        this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        this.classData.reset({name: ''});
        this.submitted = false;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getClassById(classId: number) {
    this.spinner.show();
    this.apiService.get(classId, this.endpoints.get_class).subscribe((response: any) => {
        this.spinner.hide();
        this.classById = response.data;
        console.log(response);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  updateClass(classId: string) {
    this.spinner.show();
    this.submitted = true;

    if (this.classDataUpdate.invalid) {
      this.spinner.hide();
      return;
    }

    this.apiService.put(this.classDataUpdate.value, this.endpoints.update_class, classId).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.classes = response.data;
        this.modalService.dismissAll();
        setTimeout(() => {
          this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        }, 200);
        this.classDataUpdate.reset({name: ''});
        this.submitted = false;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  deleteClass(quesId: string) {
    this.spinner.show();
    this.apiService.delete(quesId, this.endpoints.delete_class).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.modalService.dismissAll();
        this.classes = response.data;
        setTimeout(() => {
          this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        }, 200);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  gotoDetails(id) {
    localStorage.removeItem('class_id');
    this.router.navigate(['classes/details']);
    localStorage.setItem('class_id', id);
  }
}
