import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildClassActivityComponent } from './child-class-activity.component';

describe('ChildClassActivityComponent', () => {
  let component: ChildClassActivityComponent;
  let fixture: ComponentFixture<ChildClassActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildClassActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildClassActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
