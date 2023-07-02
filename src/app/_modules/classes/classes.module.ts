import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ClassesRouting} from './classes.routing';
import {ManageClassesComponent} from './_components/manage-classes/manage-classes.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {httpTranslateLoader} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {AlertModule} from '../../shared/services/_alert';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ClassDetailsComponent} from './_components/class-details/class-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StudentsComponent} from './_components/students/students.component';
import {ActivitiesComponent} from './_components/activities/activities.component';
import {AttendanceComponent} from './_components/attendance/attendance.component';
import {DataTablesModule} from 'angular-datatables';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AttendanceViewComponent} from './_components/attendance/attendance-view/attendance-view.component';
import {HomeworkManagementComponent} from './_components/homework/teacher/homework-management/homework-management.component';
import {HomeworkViewComponent} from './_components/homework/parent/homework-view/homework-view.component';
import {SubmissionListComponent} from './_components/homework/teacher/submission-list/submission-list.component';
import {FileManagementComponent} from './_components/file-management/file-management.component';
import {SubFilesComponent} from './_components/file-management/sub-files/sub-files.component';
import { FileCategoryComponent } from './_components/file-management/file-category/file-category.component';
import { FileViewComponent } from './_components/file-management/file-view/file-view.component';
import { FileViewSubComponent } from './_components/file-management/file-view/file-view-sub/file-view-sub.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ProfileComponent} from './_components/profile/profile.component';

@NgModule({
  declarations: [
    ManageClassesComponent,
    ClassDetailsComponent,
    StudentsComponent,
    ActivitiesComponent,
    AttendanceComponent,
    AttendanceViewComponent,
    HomeworkManagementComponent,
    HomeworkViewComponent,
    SubmissionListComponent,
    FileManagementComponent,
    SubFilesComponent,
    FileCategoryComponent,
    FileViewComponent,
    FileViewSubComponent,
    ProfileComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(ClassesRouting),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AlertModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        NgbModule,
        FormsModule,
        DataTablesModule,
        NgxDatatableModule,
        NgMultiSelectDropDownModule
    ]
})
export class ClassesModule {
}
