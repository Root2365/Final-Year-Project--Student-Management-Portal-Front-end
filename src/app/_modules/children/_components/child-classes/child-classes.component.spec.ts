import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildClassesComponent } from './child-classes.component';

describe('ChildClassesComponent', () => {
  let component: ChildClassesComponent;
  let fixture: ComponentFixture<ChildClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
