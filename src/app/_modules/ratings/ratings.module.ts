import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingCategoryComponent } from './_components/rating-category/rating-category.component';
import {RouterModule} from '@angular/router';
import {RatingsRouting} from './ratings.routing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {httpTranslateLoader} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {AlertModule} from '../../shared/services/_alert';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
  declarations: [RatingCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(RatingsRouting),
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
  ]
})
export class RatingsModule { }
