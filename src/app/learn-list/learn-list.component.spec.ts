import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnListComponent } from './learn-list.component';

describe('LearnListComponent', () => {
  let component: LearnListComponent;
  let fixture: ComponentFixture<LearnListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnListComponent]
    });
    fixture = TestBed.createComponent(LearnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
