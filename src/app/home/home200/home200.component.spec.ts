import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home200Component } from './home200.component';

describe('Home200Component', () => {
  let component: Home200Component;
  let fixture: ComponentFixture<Home200Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Home200Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home200Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
