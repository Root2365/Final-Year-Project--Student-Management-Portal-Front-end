import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(public translate: TranslateService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang('us');

    if (localStorage.getItem('selected_lang') == null) {
      localStorage.setItem('selected_lang', 'us');
    }
  }

  ngOnInit(): void {

  }

}
