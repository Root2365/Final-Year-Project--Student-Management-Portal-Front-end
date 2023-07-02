import {Routes} from '@angular/router';
import {ManageClassesComponent} from './_components/manage-classes/manage-classes.component';
import {ClassDetailsComponent} from './_components/class-details/class-details.component';
import {AttendanceComponent} from './_components/attendance/attendance.component';
import {AttendanceViewComponent} from './_components/attendance/attendance-view/attendance-view.component';
import {HomeworkViewComponent} from './_components/homework/parent/homework-view/homework-view.component';
import {HomeworkManagementComponent} from './_components/homework/teacher/homework-management/homework-management.component';
import {SubmissionListComponent} from './_components/homework/teacher/submission-list/submission-list.component';
import {FileManagementComponent} from './_components/file-management/file-management.component';
import {SubFilesComponent} from './_components/file-management/sub-files/sub-files.component';
import {FileCategoryComponent} from './_components/file-management/file-category/file-category.component';
import {FileViewComponent} from './_components/file-management/file-view/file-view.component';
import {FileViewSubComponent} from './_components/file-management/file-view/file-view-sub/file-view-sub.component';
import {ProfileComponent} from './_components/profile/profile.component';

export const ClassesRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: 'manage',
        component: ManageClassesComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'details',
        component: ClassDetailsComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'attendance',
        component: AttendanceComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'attendance/view',
        component: AttendanceViewComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'homework/view',
        component: HomeworkViewComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'homework/manage',
        component: HomeworkManagementComponent
      },
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'homework/submission-list',
        component: SubmissionListComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'file-management',
        component: FileManagementComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'file-management/sub',
        component: SubFilesComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'file-management/category',
        component: FileCategoryComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'file-management/view',
        component: FileViewComponent
      },
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'file-management/view/sub',
        component: FileViewSubComponent
      },
    ]
  },

  {
    path: '',
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
    ]
  },

];
