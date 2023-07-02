import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../shared/services/api.service';
import {AlertService} from '../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from '../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../shared/services/logger.service';
import {Endpoints} from '../../../../shared/endpoints';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-rating-category',
  templateUrl: './rating-category.component.html',
  styleUrls: ['./rating-category.component.css']
})
export class RatingCategoryComponent implements OnInit {

  closeResult = '';
  dataList: any;
  rcById: any;
  rcName: any;
  rcId: any;
  createData: FormGroup;
  updateData: FormGroup;
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
    this.rcName = className;
    this.rcId = classId;

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
    this.get();

    this.createData = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.updateData = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  get fields() {
    return this.createData.controls;
  }

  get() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_rc).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.dataList = response.data;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  create() {
    this.spinner.show();
    this.submitted = true;

    if (this.createData.invalid) {
      this.spinner.hide();
      return;
    }

    this.apiService.post(this.createData.value, this.endpoints.create_rc).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.dataList = response.data;
        this.modalService.dismissAll();
        setTimeout(() => {
          this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        }, 100);
        this.submitted = false;
        this.createData.reset({name: ''});
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getById(targetId: number) {
    this.spinner.show();
    this.apiService.get(targetId, this.endpoints.get_rc).subscribe((response: any) => {
        this.spinner.hide();
        this.rcById = response.data;
        this.loggerService.log(response);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  update(targetId: string) {
    this.spinner.show();
    this.submitted = true;

    if (this.updateData.invalid) {
      this.spinner.hide();
      return;
    }

    this.apiService.put(this.updateData.value, this.endpoints.update_rc, targetId).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.dataList = response.data;
        this.modalService.dismissAll();
        setTimeout(() => {
          this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        }, 100);
        this.submitted = false;
        this.updateData.reset({name: ''});
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  delete(targetId: string) {
    this.spinner.show();
    this.apiService.delete(targetId, this.endpoints.delete_rc).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.modalService.dismissAll();
        this.dataList = response.data;
        setTimeout(() => {
          this.dialogService.open(response.message, environment.info_message, 'success', environment.info);
        }, 200);
      },
      error => {
        this.spinner.hide();
      }
    );
  }
}
