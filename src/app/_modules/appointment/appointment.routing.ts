import {Routes} from '@angular/router';
import {ManageAppointmentComponent} from './_component/manage-appointment/manage-appointment.component';

export const AppointmentRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: 'manage',
        component: ManageAppointmentComponent
      },
    ]
  }
];
