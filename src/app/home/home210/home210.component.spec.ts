import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home210Component } from './home210.component';

describe('Home210Component', () => {
  let component: Home210Component;
  let fixture: ComponentFixture<Home210Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Home210Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home210Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
