import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckScComponent } from './check-sc.component';

describe('CheckScComponent', () => {
  let component: CheckScComponent;
  let fixture: ComponentFixture<CheckScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckScComponent]
    });
    fixture = TestBed.createComponent(CheckScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
