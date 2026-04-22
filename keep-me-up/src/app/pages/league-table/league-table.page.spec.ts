import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueTablePage } from './league-table.page';

describe('LeagueTablePage', () => {
  let component: LeagueTablePage;
  let fixture: ComponentFixture<LeagueTablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
