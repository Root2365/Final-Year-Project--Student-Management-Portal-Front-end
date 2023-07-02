import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewSubComponent } from './file-view-sub.component';

describe('FileViewSubComponent', () => {
  let component: FileViewSubComponent;
  let fixture: ComponentFixture<FileViewSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
