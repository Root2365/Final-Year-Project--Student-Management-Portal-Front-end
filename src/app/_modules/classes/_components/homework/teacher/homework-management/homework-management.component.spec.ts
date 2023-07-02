import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkManagementComponent } from './homework-management.component';

describe('HomeworkManagementComponent', () => {
  let component: HomeworkManagementComponent;
  let fixture: ComponentFixture<HomeworkManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
