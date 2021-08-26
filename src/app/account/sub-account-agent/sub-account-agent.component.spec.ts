import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountAgentComponent } from './sub-account-agent.component';

describe('SubAccountAgentComponent', () => {
  let component: SubAccountAgentComponent;
  let fixture: ComponentFixture<SubAccountAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAccountAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
