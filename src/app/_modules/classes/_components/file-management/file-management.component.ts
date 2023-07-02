import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Endpoints} from '../../../../shared/endpoints';
import {NgbCalendar, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../shared/services/api.service';
import {DialogService} from '../../../../shared/_modal/dialog.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit {
  @ViewChild('catId') catName: ElementRef;
  @ViewChild('classId') className: ElementRef;

  categories: any;
  selectedCat: any;
  selectedCatId: any;
  modalRef: NgbModalRef;
  file: File;
  rootFolders: any;
  selectedClass: any;
  selectedClassId: any;
  classes: any;
  teacher: any;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  selectedClassForCreation = [];
  updateNameFile: any;
  updateNameId: any;


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
    this.selectedClassForCreation = new Array();
    this.g();
    this.getCategory();
    setTimeout(() => {
      this.getClasses();
      setTimeout(() => {
        this.getRootFolders();
      }, 500);
    }, 500);
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  getCategory() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.category + '/get-by-teacherId/' + localStorage.getItem('user_id')).subscribe((response: any) => {
      this.spinner.hide();
      this.categories = response;
      this.selectedCatId = response[0].id;
      this.selectedCat = response[0].name;
    }, error => {
      this.spinner.hide();
    });
  }

  getClasses() {
    this.spinner.show();
    console.log(this.selectedCatId);
    this.apiService.get('', this.endpoints.get_class + '/category/' + this.selectedCatId).subscribe((response: any) => {
      this.classes = response;
      this.selectedClassId = response[0].id;
      this.selectedClass = response[0].className;

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

  filterFolders(classId: string, categoryId: string) {
    this.spinner.show();
    this.apiService.getQuery(this.endpoints.files + '/get-root?classId=' + classId + '&categoryId=' + categoryId)
      .subscribe((response: any) => {
        this.rootFolders = response;
        if (this.rootFolders.length !== 0) {
          this.teacher = response[0].teacher;
        }
        console.log(this.rootFolders);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
  }

  getRootFolders() {
    this.spinner.show();
    this.apiService.getQuery(this.endpoints.files + '/get-root?classId=' + this.selectedClassId + '&categoryId=' + this.selectedCatId)
      .subscribe((response: any) => {
        this.rootFolders = response;
        if (this.rootFolders.length !== 0) {
          this.teacher = response[0].teacher;
        }
        // console.log(this.rootFolders);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
  }

  gotoSub(parent_id, selectedClassId: string, selectedCategoryId: string) {
    localStorage.removeItem('prent_folder_id');
    localStorage.removeItem('category_id');
    localStorage.removeItem('class_id');
    localStorage.removeItem('category_name');
    localStorage.removeItem('class_name');
    localStorage.removeItem('teacher');

    localStorage.setItem('prent_folder_id', parent_id);
    localStorage.setItem('category_id', selectedCategoryId);
    localStorage.setItem('category_name', this.selectedCat);
    localStorage.setItem('class_id', selectedClassId);
    localStorage.setItem('class_name', this.selectedClass);
    localStorage.setItem('teacher', this.teacher);

    console.log(this.selectedCat);
    console.log(this.selectedClass);

    this.router.navigate(['/classes/file-management/sub']);
  }

  createFolder(name: string) {
    const data = {
      'name': name,
      'teacher_id': localStorage.getItem('user_id'),
      'type': 'FOLDERS',
      'status': 'Active',
      'important': true,
      'allowed': true,
      'is_parent': true,
      'is_root': true,
      'category_id': this.selectedCatId,
      // 'class_id': this.selectedClassId,
      'file': this.file,
    };

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    for (const cat of this.selectedClassForCreation) {
      formData.append('class_id', cat.item_id);
    }

    console.log(formData);

    this.spinner.show();
    this.apiService.post(formData, this.endpoints.files + '/create').subscribe((response: any) => {
      console.log(response);
      this.modalService.dismissAll();
      setTimeout(() => {
        this.dialogService.open('Folder Created Successfully', environment.info_message, 'success', environment.info);
      }, 100);
      this.spinner.hide();
      this.getRootFolders();
    }, error => {
      this.spinner.hide();
      this.dialogService.open('Folder Creation Failed', environment.error_message, 'danger', environment.error);
    });
  }

  updateCatName() {
    this.selectedCat = this.catName.nativeElement.selectedOptions[0].textContent;
  }

  updateClassName() {
    this.selectedClass = this.className.nativeElement.selectedOptions[0].textContent;
  }

  updateUploadPermission(id, permission: boolean) {
    console.log(permission);
    this.spinner.show();

    const data = {
      'allowed': permission,
    };

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    console.log(permission);
    this.apiService.put(formData, this.endpoints.files + '/update-permission', id).subscribe(
      (response: any) => {
        console.log(response);
        this.spinner.hide();
        this.dialogService.open('Permission Updated', environment.info_message, 'success', environment.info);
        this.getRootFolders();
      },
      error => {
        this.dialogService.open('Permission Updating Failed...', environment.error_message, 'danger', environment.error);
        this.spinner.hide();
      }
    );
  }

  updateImportance(id, importance: boolean) {
    this.spinner.show();

    const data = {
      important: importance
    };

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });


    this.apiService.put(formData, this.endpoints.files + '/update-important', id).subscribe(
      (response: any) => {
        console.log(response);
        this.spinner.hide();
        this.dialogService.open('Importance Updated', environment.info_message, 'success', environment.info);
        this.getRootFolders();
      },
      error => {
        this.dialogService.open('Importance Updating Failed...', environment.error_message, 'danger', environment.error);
        this.spinner.hide();
      }
    );
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

  delete(id) {
    this.spinner.show();
    this.apiService.delete(id, this.endpoints.files)
      .subscribe((response: any) => {
        this.dialogService.open('Deleted Successfully', environment.info_message, 'success', environment.info);
        this.spinner.hide();
        this.getRootFolders();
      }, error => {
        this.spinner.hide();
      });
  }

  openModal(id, name, file_edit_modal) {
    this.updateNameFile = name;
    this.updateNameId = id;
    this.open(file_edit_modal);
  }

  updateName(name: string) {
    this.spinner.show();
    const data = {
      name: name
    };
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    this.apiService.put(formData, this.endpoints.files + '/update-name', this.updateNameId, )
      .subscribe((response: any) => {
        this.dialogService.open('Updated Successfully', environment.info_message, 'success', environment.info);
        this.spinner.hide();
        this.modalRef.dismiss();
        this.getRootFolders();
      }, error => {
        this.spinner.hide();
      });
  }
}
