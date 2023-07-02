import {Component, OnInit} from '@angular/core';
import {NgbCalendar, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Stack} from '../../Stack';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Endpoints} from '../../../../../../shared/endpoints';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from '../../../../../../shared/services/api.service';
import {DialogService} from '../../../../../../shared/_modal/dialog.service';
import {Router} from '@angular/router';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'app-file-view-sub',
  templateUrl: './file-view-sub.component.html',
  styleUrls: ['./file-view-sub.component.css']
})
export class FileViewSubComponent implements OnInit {

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
  isAllowed: any;

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
    this.isAllowed = localStorage.getItem('allowed');
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


  gotoSub(parent_id, allowed: any) {
    this.stack.push(Number(localStorage.getItem('prent_folder_id')));
    localStorage.removeItem('prent_folder_id');
    localStorage.removeItem('allowed');
    localStorage.setItem('prent_folder_id', parent_id);
    localStorage.setItem('allowed', allowed);
    this.isAllowed = localStorage.getItem('allowed');
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
      this.router.navigate(['/classes/file-management/view']);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createFolder(name: string, files: boolean, folder: boolean) {
    const type = files === true ? 'FILES' : 'FOLDERS';
    const data = {
      'name': name,
      'student_id': localStorage.getItem('child_id'),
      'type': type,
      'status': 'Active',
      'important': false,
      'allowed': false,
      'is_parent': false,
      'is_root': false,
      'parent_id': localStorage.getItem('prent_folder_id'),
      'category_id': localStorage.getItem('category_id'),
      'class_id': localStorage.getItem('class_id'),
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
        this.dialogService.open(type + ' Created Successfully', environment.info_message, 'success', environment.info);
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

}
