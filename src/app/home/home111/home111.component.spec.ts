import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home111Component } from './home111.component';

describe('Home111Component', () => {
  let component: Home111Component;
  let fixture: ComponentFixture<Home111Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Home111Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home111Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
