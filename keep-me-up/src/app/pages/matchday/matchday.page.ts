import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';

import { FootballService } from '../../services/football.service';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';
import { Standing } from '../../models/standing.model';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-matchday',
  templateUrl: './matchday.page.html',
  styleUrls: ['./matchday.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PageHeaderComponent]
})
export class MatchdayPage {
  loading = true;

  homeTeam: Team | null = null;
  awayTeam: Team | null = null;

  homeMatches: Match[] = [];
  awayMatches: Match[] = [];

  homeStanding: Standing | null = null;
  awayStanding: Standing | null = null;

  matchInfo = {
    venue: '',
    date: '',
    time: '',
    leagueId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private footballService: FootballService
  ) {}

  ionViewWillEnter(): void {
    void this.loadMatchdayData();
  }

  private async loadMatchdayData(): Promise<void> {
    const homeId = this.route.snapshot.queryParamMap.get('homeId');
    const awayId = this.route.snapshot.queryParamMap.get('awayId');
    const leagueId = this.route.snapshot.queryParamMap.get('leagueId');

    this.matchInfo = {
      venue: this.route.snapshot.queryParamMap.get('venue') ?? '',
      date: this.route.snapshot.queryParamMap.get('date') ?? '',
      time: this.route.snapshot.queryParamMap.get('time') ?? '',
      leagueId: leagueId ?? ''
    };

    if (!homeId || !awayId || !leagueId) {
      this.loading = false;
      return;
    }

    this.loading = true;

    try {
      const result = await firstValueFrom(
        forkJoin({
          homeTeam: this.footballService.getTeamById(homeId),
          awayTeam: this.footballService.getTeamById(awayId),
          homeMatches: this.footballService.getLastTeamMatches(homeId),
          awayMatches: this.footballService.getLastTeamMatches(awayId),
          standings: this.footballService.getStandings(leagueId)
        })
      );

      this.homeTeam = result.homeTeam;
      this.awayTeam = result.awayTeam;
      this.homeMatches = result.homeMatches.slice(0, 5);
      this.awayMatches = result.awayMatches.slice(0, 5);

      this.homeStanding = result.standings.find(team => team.idTeam === homeId) ?? null;
      this.awayStanding = result.standings.find(team => team.idTeam === awayId) ?? null;
    } catch (error) {
      console.error('Error loading matchday data', error);
      this.homeTeam = null;
      this.awayTeam = null;
      this.homeMatches = [];
      this.awayMatches = [];
      this.homeStanding = null;
      this.awayStanding = null;
    } finally {
      this.loading = false;
    }
  }

  getTeamColumnStyle(team: Team | null): Record<string, string> {
    if (!team?.strColour1) {
      return {
        background: 'rgba(255, 255, 255, 0.14)',
        border: '1px solid rgba(0, 0, 0, 0.10)'
      };
    }

    return {
      background: team.strColour1,
      border: `1px solid ${this.hexToRgba(team.strColour1, 0.65)}`
    };
  }

  getSummaryCardStyle(team: Team | null): Record<string, string> {
    if (!team?.strColour1) {
      return {
        background: 'rgba(255, 255, 255, 0.28)'
      };
    }

    return {
      background: 'rgba(255, 255, 255, 0.28)',
      border: `1px solid ${this.hexToRgba(team.strColour1, 0.28)}`
    };
  }

  getMatchScore(match: Match): string {
    const homeScore = match.intHomeScore ?? '-';
    const awayScore = match.intAwayScore ?? '-';
    return `${homeScore} - ${awayScore}`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace('#', '');

    if (cleaned.length !== 6) {
      return `rgba(255,255,255,${alpha})`;
    }

    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}