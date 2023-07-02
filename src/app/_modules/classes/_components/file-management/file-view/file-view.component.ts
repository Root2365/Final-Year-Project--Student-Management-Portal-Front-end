import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbCalendar, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {Endpoints} from '../../../../../shared/endpoints';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../shared/services/api.service';
import {DialogService} from '../../../../../shared/_modal/dialog.service';
import {Router} from '@angular/router';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
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
  child: any;


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

  selectedChildId: any;

  ngOnInit(): void {
    this.getChild();

    setTimeout(() => {
      this.getClasses(this.selectedChildId);
      setTimeout(() => {
        setTimeout(() => {
          this.getRootFolders();
        }, 500);
      }, 500);
    }, 1000);
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }

  getCategory() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.category + '/get-by-classId/' + this.selectedClassId).subscribe((response: any) => {
      this.spinner.hide();
      this.categories = response;
      this.selectedCatId = response[0].id;
      this.selectedCat = response[0].name;
      console.log(this.selectedCat);

    }, error => {
      this.spinner.hide();
    });
  }

  getChild() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_students_by_parent).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.child = response.data;
        this.selectedChildId = response.data[1].id;
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getClasses(child_id) {
    this.spinner.show();
    this.apiService.get(child_id, this.endpoints.get_class_by_student).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.classes = response.data;
        this.selectedClass = response.data[0];
        this.selectedClassId = response.data[0].id;
        this.selectedClass = response.data[0].className;
        this.getCategory();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  /*getClasses() {
    this.spinner.show();
    this.apiService.get('', this.endpoints.get_class).subscribe((response: any) => {
      this.classes = response.data;
      this.selectedClass = response.data[0];
      this.selectedClassId = response.data[0].id;
      this.selectedClass = response.data[0].className;
      console.log(this.selectedClass);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }*/


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
        console.log(this.rootFolders);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
  }

  gotoSub(parent_id, selectedClassId: string, selectedCategoryId: string, allowed) {
    localStorage.removeItem('prent_folder_id');
    localStorage.removeItem('category_id');
    localStorage.removeItem('class_id');
    localStorage.removeItem('category_name');
    localStorage.removeItem('class_name');
    localStorage.removeItem('teacher');
    localStorage.removeItem('type');
    localStorage.removeItem('child_id');

    localStorage.setItem('prent_folder_id', parent_id);
    localStorage.setItem('category_id', selectedCategoryId);
    localStorage.setItem('category_name', this.selectedCat);
    localStorage.setItem('class_id', selectedClassId);
    localStorage.setItem('class_name', this.selectedClass);
    localStorage.setItem('teacher', this.teacher);
    localStorage.setItem('allowed', allowed);
    localStorage.setItem('child_id', this.selectedChildId);

    console.log(this.selectedCat);
    console.log(this.selectedClass);

    this.router.navigate(['/classes/file-management/view/sub']);
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
      'class_id': this.selectedClassId,
      'file': this.file,
    };

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

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

}
