import {RouteInfo} from './sidebar.metadata';

export const TEACHER_ROUTES: RouteInfo[] = [

  {
    path: '/classes/manage',
    title: 'manage_classes',
    icon: 'icon-Bell-2',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/classes/attendance',
    title: 'Manage Attendance',
    icon: 'icon-Calendar',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/rating/manage',
    title: 'manage_rc',
    icon: 'icon-Car-Wheel',
    class: '',
    extralink: false,
    submenu: []
  },

  {
    path: '/classes/details',
    title: 'class_details',
    icon: 'icon-Warehouse',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/appointment/manage',
    title: 'manage_appointment',
    icon: 'icon-Time-Backup',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/classes/homework/manage',
    title: 'Manage Homework',
    icon: 'icon-Fax',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/classes/file-management',
    title: 'File Management',
    icon: 'icon-Fax',
    class: '',
    extralink: false,
    submenu: []
  },

  {
    path: '/classes/file-management/category',
    title: 'Category Management',
    icon: 'icon-Car-Wheel',
    class: '',
    extralink: false,
    submenu: []
  },
];


export const PARENT_ROUTES: RouteInfo[] = [
  {
    path: '/child/manage',
    title: 'manage_child',
    icon: 'icon-User',
    class: '',
    extralink: false,
    submenu: []
  },

  {
    path: '/appointment/manage',
    title: 'manage_appointment',
    icon: 'icon-Time-Backup',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/classes/attendance/view',
    title: 'View Attendance',
    icon: 'icon-Time-Backup',
    class: '',
    extralink: false,
    submenu: []
  },

  {
    path: '/classes/homework/view',
    title: 'View Homework',
    icon: 'icon-Time-Backup',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/classes/file-management/view',
    title: 'View Files',
    icon: 'icon-Fax',
    class: '',
    extralink: false,
    submenu: []
  },

];
