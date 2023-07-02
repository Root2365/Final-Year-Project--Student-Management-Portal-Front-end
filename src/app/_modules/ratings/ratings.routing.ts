import {Routes} from '@angular/router';
import {RatingCategoryComponent} from './_components/rating-category/rating-category.component';

export const RatingsRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: 'manage',
        component: RatingCategoryComponent
      },
    ]
  }
];
