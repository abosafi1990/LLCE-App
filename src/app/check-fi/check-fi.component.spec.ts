import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFiComponent } from './check-fi.component';

describe('CheckFiComponent', () => {
  let component: CheckFiComponent;
  let fixture: ComponentFixture<CheckFiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckFiComponent]
    });
    fixture = TestBed.createComponent(CheckFiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
