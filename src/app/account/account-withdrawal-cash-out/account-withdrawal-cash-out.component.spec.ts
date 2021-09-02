import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWithdrawalCashOutComponent } from './account-withdrawal-cash-out.component';

describe('AccountWithdrawalCashOutComponent', () => {
  let component: AccountWithdrawalCashOutComponent;
  let fixture: ComponentFixture<AccountWithdrawalCashOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountWithdrawalCashOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWithdrawalCashOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
