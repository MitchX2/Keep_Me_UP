import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchdayPage } from './matchday.page';

describe('MatchdayPage', () => {
  let component: MatchdayPage;
  let fixture: ComponentFixture<MatchdayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchdayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
