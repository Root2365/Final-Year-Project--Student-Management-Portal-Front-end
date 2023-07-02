import {Component, OnInit} from '@angular/core';
import {NgbCalendar, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Endpoints} from '../../../../../shared/endpoints';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../shared/services/api.service';
import {DialogService} from '../../../../../shared/_modal/dialog.service';
import {Router} from '@angular/router';
import {Stack} from '../Stack';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-sub-files',
  templateUrl: './sub-files.component.html',
  styleUrls: ['./sub-files.component.css']
})
export class SubFilesComponent implements OnInit {

  selectedCatId: any;
  modalRef: NgbModalRef;
  file: File;
  fileFolders: any;
  showFileInput: boolean;
  private selectedFile: any;
  stack = new Stack<number>();
  selectedType: 'FILES';
  selectedClass: any;
  selectedCategory: any;
  teacher: any;
  goBack: any;

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
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getFileFolders();
    this.selectedCategory = localStorage.getItem('category_name');
    this.selectedClass = localStorage.getItem('class_name');
    this.teacher = localStorage.getItem('teacher');
    if (!this.stack.isEmpty()) {
      this.goBack = 'Go Back';
    } else {
      this.goBack = 'Root Folder';
    }
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true});
  }


  getFileFolders() {
    this.spinner.show();
    console.log(this.stack);
    this.apiService.get('', this.endpoints.files + '/get-by-id/' + localStorage.getItem('prent_folder_id')).subscribe((response: any) => {
      this.fileFolders = response;
      console.log(this.fileFolders);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


  gotoSub(parent_id) {
    this.stack.push(Number(localStorage.getItem('prent_folder_id')));
    localStorage.removeItem('prent_folder_id');
    localStorage.setItem('prent_folder_id', parent_id);
    this.getFileFolders();
    this.goBack = 'Go Back';
  }

  gotoBack() {
    console.log(this.stack);
    if (!this.stack.isEmpty()) {
      const prev_id = this.stack.pop();
      console.log('pop' + prev_id);
      localStorage.setItem('prent_folder_id', String(prev_id));
      this.getFileFolders();
      if (this.stack.isEmpty()) {
        this.goBack = 'Go Root';
      }
    } else {
      this.router.navigate(['/classes/file-management']);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createFolder(name: string, files: boolean, folder: boolean) {
    const type = files === true ? 'FILE' : 'FOLDER';
    const data = {
      'name': name,
      'teacher_id': localStorage.getItem('user_id'),
      'type': type,
      'status': 'Active',
      'important': false,
      'allowed': true,
      'is_parent': false,
      'is_root': false,
      'parent_id': localStorage.getItem('prent_folder_id'),
      // 'category_id': localStorage.getItem('category_id'),
      // 'class_id': localStorage.getItem('class_id'),
      'file': this.selectedFile,
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
        this.dialogService.open(type + 'Created Successfully', environment.info_message, 'success', environment.info);
      }, 100);
      this.spinner.hide();
      this.getFileFolders();
    }, error => {
      this.spinner.hide();
      this.dialogService.open('Folder Creation Failed', environment.error_message, 'danger', environment.error);
    });
  }

  showUpload(a) {
    this.showFileInput = a;
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
        this.getFileFolders();
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
        this.getFileFolders();
      },
      error => {
        this.dialogService.open('Importance Updating Failed...', environment.error_message, 'danger', environment.error);
        this.spinner.hide();
      }
    );
  }

  // downloadFile(submission_id) {
  //   const url = this.endpoints.files + '/' + submission_id + '/file';
  //   const headers = new HttpHeaders().set('Accept', 'application/pdf');
  //
  //   this.http.get(url, {responseType: 'blob'}).subscribe((response) => {
  //     const newBlob = new Blob([response], {type: 'application/pdf'});
  //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //       window.navigator.msSaveOrOpenBlob(newBlob);
  //       return;
  //     }
  //
  //     const data = window.URL.createObjectURL(newBlob);
  //     const link = document.createElement('a');
  //     link.href = data;
  //     link.download = 'file' + submission_id;
  //     link.click();
  //     setTimeout(() => {
  //       // For Firefox it is necessary to delay revoking the ObjectURL
  //       window.URL.revokeObjectURL(data);
  //     }, 400);
  //   }, (error) => {
  //     console.error(error);
  //   });
  // }

  downloadFile(submission_id) {
    const url = this.endpoints.files + '/' + submission_id + '/file';

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



  delete(id) {
    this.spinner.show();
    this.apiService.delete(id, this.endpoints.files)
      .subscribe((response: any) => {
        this.dialogService.open('Deleted Successfully', environment.info_message, 'success', environment.info);
        this.spinner.hide();
        this.getFileFolders();
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
        this.getFileFolders();
      }, error => {
        this.spinner.hide();
      });
  }
}
