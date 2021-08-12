import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home230Component } from './home230.component';

describe('Home230Component', () => {
  let component: Home230Component;
  let fixture: ComponentFixture<Home230Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Home230Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home230Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
