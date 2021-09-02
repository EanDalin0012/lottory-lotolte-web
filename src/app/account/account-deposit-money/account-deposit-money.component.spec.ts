import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDepositMoneyComponent } from './account-deposit-money.component';

describe('AccountDepositMoneyComponent', () => {
  let component: AccountDepositMoneyComponent;
  let fixture: ComponentFixture<AccountDepositMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDepositMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDepositMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
