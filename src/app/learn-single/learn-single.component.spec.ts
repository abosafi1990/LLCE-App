import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnSingleComponent } from './learn-single.component';

describe('LearnSingleComponent', () => {
  let component: LearnSingleComponent;
  let fixture: ComponentFixture<LearnSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnSingleComponent]
    });
    fixture = TestBed.createComponent(LearnSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
