import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home110Component } from './home110.component';

describe('Home110Component', () => {
  let component: Home110Component;
  let fixture: ComponentFixture<Home110Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Home110Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
