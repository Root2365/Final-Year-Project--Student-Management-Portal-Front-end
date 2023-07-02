import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../shared/services/api.service';
import {AlertService} from '../../../../../shared/services/_alert';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from '../../../../../shared/services/_modal/dialog.service';
import {LoggerService} from '../../../../../shared/services/logger.service';
import {Endpoints} from '../../../../../shared/endpoints';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-file-category',
  templateUrl: './file-category.component.html',
  styleUrls: ['./file-category.component.css']
})
export class FileCategoryComponent implements OnInit {

  closeResult = '';
  dataList: any;
  rcById: any;
  rcName: any;
  rcId: any;
  submitted = false;
  classes: any;
  selectedClasses: any;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  selectedClassForCreation = [];

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
    this.selectedClassForCreation = new Array();
    this.get();
    this.g();
    this.getClasses();
  }

  getClasses() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_class).subscribe((response: any) => {
      this.classes = response.data;
      console.log(this.classes);
      this.dropdownList = new Array();
      for (let i = 0; i < this.classes.length; i++) {
        const data = {item_id: this.classes[i].id, item_text: this.classes[i].className};
        this.dropdownList.push(data);
      }
      console.log(this.dropdownList);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  g() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  get() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.category).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.dataList = response;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  create(name: string) {
    this.spinner.show();
    const classIds = new Array();
    for (let i = 0; i < this.selectedClassForCreation.length; i++) {
      classIds.push(this.selectedClassForCreation[i].item_id);
    }
    const data = {
      name: name,
      classIds: classIds,
      teacherId: localStorage.getItem('user_id')
    };
    console.log(data);
    this.apiService.post(data, this.endpoints.category).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log(response);
        this.get();
        this.modalService.dismissAll();
        setTimeout(() => {
          this.dialogService.open('Category Created Successfully', environment.info_message, 'success', environment.info);
        }, 100);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getById(targetId: number) {
    this.spinner.show();
    this.apiService.get(targetId, this.endpoints.category).subscribe((response: any) => {
        this.spinner.hide();
        this.rcById = response;
        this.loggerService.log(response);
        this.selectedClasses = this.rcById.classes;
        this.selectedClassForCreation = new Array();

        for (let i = 0; i < this.selectedClasses.length; i++) {
          const data = {'item_id': this.selectedClasses[i].id, 'item_text': this.selectedClasses[i].className};
          this.selectedClassForCreation.push(data);
        }
        console.log(this.selectedClassForCreation);

        this.getClasses();

        setTimeout(() => {
          this.selectedItems = new Array();
          for (let i = 0; i < this.selectedClasses.length; i++) {
            const data = {item_id: this.selectedClasses[i].id, item_text: this.selectedClasses[i].className};
            this.selectedItems.push(data);
          }
        }, 500);
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  update(targetId: string, name: string) {
    this.spinner.show();
    const classIds = new Array();
    for (let i = 0; i < this.selectedClassForCreation.length; i++) {
      classIds.push(this.selectedClassForCreation[i].item_id);
    }

    const data = {
      name: name,
      classIds: classIds,
      teacherId: localStorage.getItem('user_id')
    };
    console.log(data);
    this.apiService.put(data, this.endpoints.category, targetId).subscribe((response: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        setTimeout(() => {
          this.dialogService.open('Category Updated Successfully', environment.info_message, 'success', environment.info);
        }, 100);
        this.get();
        this.submitted = false;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  delete(targetId: string) {
    this.spinner.show();
    this.apiService.delete(targetId, this.endpoints.category).subscribe((response: any) => {
        this.spinner.hide();
        this.modalService.dismissAll();
        setTimeout(() => {
          this.dialogService.open('Deleted Successfully', environment.info_message, 'success', environment.info);
        }, 200);
        this.get();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  onItemSelect(item: any) {
    this.selectedClassForCreation.push(item);
    console.log(this.selectedClassForCreation);
  }

  onDeSelect(item: any) {
    const index = this.selectedClassForCreation.findIndex(selectedItem => selectedItem.item_id === item.item_id);
    if (index !== -1) {
      this.selectedClassForCreation.splice(index, 1);
    }
    console.log(this.selectedClassForCreation);
  }

  onSelectAll(items: any) {
    this.selectedClassForCreation = items;
    console.log(items);
  }

  onDeSelectAll() {
    this.selectedClassForCreation = [];
    console.log(this.selectedClassForCreation);
  }

}
