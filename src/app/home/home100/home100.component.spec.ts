import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home100Component } from './home100.component';

describe('Home100Component', () => {
  let component: Home100Component;
  let fixture: ComponentFixture<Home100Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Home100Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
