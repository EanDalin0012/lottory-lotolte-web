import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountMemberComponent } from './sub-account-member.component';

describe('SubAccountMemberComponent', () => {
  let component: SubAccountMemberComponent;
  let fixture: ComponentFixture<SubAccountMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAccountMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
