import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAddAccountComponent } from './show-add-account.component';

describe('ShowAddAccountComponent', () => {
  let component: ShowAddAccountComponent;
  let fixture: ComponentFixture<ShowAddAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAddAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
