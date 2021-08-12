import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlayoutComponent } from './mlayout.component';

describe('MlayoutComponent', () => {
  let component: MlayoutComponent;
  let fixture: ComponentFixture<MlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
