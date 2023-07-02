import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFilesComponent } from './sub-files.component';

describe('SubFilesComponent', () => {
  let component: SubFilesComponent;
  let fixture: ComponentFixture<SubFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
