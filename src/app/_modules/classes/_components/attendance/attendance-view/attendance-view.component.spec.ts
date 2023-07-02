import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceViewComponent } from './attendance-view.component';

describe('AttendanceViewComponent', () => {
  let component: AttendanceViewComponent;
  let fixture: ComponentFixture<AttendanceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
