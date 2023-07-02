import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChildComponent} from './_components/child/child.component';
import {RouterModule} from '@angular/router';
import {RatingsRouting} from '../ratings/ratings.routing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {httpTranslateLoader} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {AlertModule} from '../../shared/services/_alert';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';
import {ChildrenRouting} from './children.routing';
import { ChildClassesComponent } from './_components/child-classes/child-classes.component';
import { ChildDetailsComponent } from './_components/child-details/child-details.component';
import { ChildRatingComponent } from './_components/child-rating/child-rating.component';
import { ChildClassActivityComponent } from './_components/child-class-activity/child-class-activity.component';
import {NgbDatepickerModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ChildComponent, ChildClassesComponent, ChildDetailsComponent, ChildRatingComponent, ChildClassActivityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ChildrenRouting),
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
    NgbTabsetModule,
    NgbDatepickerModule,
    FormsModule,
  ]
})
export class ChildrenModule {
}
