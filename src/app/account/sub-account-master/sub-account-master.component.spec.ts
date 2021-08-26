import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountMasterComponent } from './sub-account-master.component';

describe('SubAccountMasterComponent', () => {
  let component: SubAccountMasterComponent;
  let fixture: ComponentFixture<SubAccountMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAccountMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
