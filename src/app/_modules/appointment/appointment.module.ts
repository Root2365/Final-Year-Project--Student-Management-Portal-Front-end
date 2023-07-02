import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {RatingsRouting} from '../ratings/ratings.routing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {httpTranslateLoader} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {AlertModule} from '../../shared/services/_alert';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';
import {AppointmentRouting} from './appointment.routing';
import { ManageAppointmentComponent } from './_component/manage-appointment/manage-appointment.component';
import {NgbDatepickerModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule} from 'angular-calendar';

@NgModule({
  declarations: [ManageAppointmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AppointmentRouting),
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
    DataTablesModule,
    NgbDatepickerModule,
    FormsModule,
    CalendarModule,
    NgbTimepickerModule
  ]
})
export class AppointmentModule {
}
