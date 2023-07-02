import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkViewComponent } from './homework-view.component';

describe('HomeworkViewComponent', () => {
  let component: HomeworkViewComponent;
  let fixture: ComponentFixture<HomeworkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
