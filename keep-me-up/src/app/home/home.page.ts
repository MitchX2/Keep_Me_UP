import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';

import { League } from '../models/league.model';
import { Standing } from '../models/standing.model';
import { Match } from '../models/match.model';
import { LEAGUES } from '../data/leagues';
import { FootballService } from '../services/football.service';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../shared/constants/storage-keys';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PageHeaderComponent]
})
export class HomePage implements OnInit {
  leagues: League[] = LEAGUES;
  selectedLeague: League | null = null;
  standings: Standing[] = [];
  matches: Match[] = [];
  selectedTeamId: string | null = null;
  favouriteTeamId: string | null = null;
  loading = false;

  constructor(
    private footballService: FootballService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadFavouriteTeam();
    await this.loadInitialLeague();
    await this.loadLeagueData();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadFavouriteTeam();
  }

  private async loadFavouriteTeam(): Promise<void> {
    this.favouriteTeamId = await this.storageService.get<string>(STORAGE_KEYS.favouriteTeam);
  }

  private async loadInitialLeague(): Promise<void> {
    const storedLeagueId = await this.storageService.get<string>(STORAGE_KEYS.favouriteLeague);

    if (storedLeagueId) {
      this.selectedLeague = this.leagues.find(league => league.id === storedLeagueId) ?? this.leagues[0];
    } else {
      this.selectedLeague = this.leagues[0];
    }
  }

  async onLeagueChange(event: CustomEvent): Promise<void> {
    const leagueId = event.detail.value as string;

    this.selectedLeague = this.leagues.find(league => league.id === leagueId) ?? this.leagues[0];
    this.selectedTeamId = null;

    await this.storageService.set(STORAGE_KEYS.favouriteLeague, this.selectedLeague.id);
    await this.loadLeagueData();
  }

  async loadLeagueData(): Promise<void> {
    if (!this.selectedLeague) {
      return;
    }

    this.loading = true;
    this.standings = [];
    this.matches = [];

    try {
      const result = await firstValueFrom(
        forkJoin({
          standings: this.footballService.getStandings(this.selectedLeague.id),
          matches: this.footballService.getNextLeagueMatches(this.selectedLeague.id)
        })
      );

      this.standings = result.standings;
      this.matches = result.matches;
    } catch (error) {
      console.error('Error loading home page data', error);
      this.standings = [];
      this.matches = [];
    } finally {
      this.loading = false;
    }
  }

  selectTeam(teamId: string): void {
    this.selectedTeamId = teamId;
  }

  isFavouriteTeam(teamId: string): boolean {
    return this.favouriteTeamId === teamId;
  }

  getTeamBadge(teamId?: string): string | null {
    if (!teamId) {
      return null;
    }

    const team = this.standings.find(standingTeam => standingTeam.idTeam === teamId);
    return team?.strBadge ?? null;
  }

  getHomeRowClass(team: Standing): string {
    const description = (team.strDescription || '').toLowerCase();
    const rank = Number(team.intRank);

    if (rank === 1) {
      return 'row-first';
    }

    if (description.includes('champions league')) {
      return 'row-champions';
    }

    if (description.includes('europa league')) {
      return 'row-europa';
    }

    if (description.includes('relegation')) {
      return 'row-relegation';
    }

    return '';
  }

  openMatchday(match: Match): void {
    this.router.navigate(['/matchday'], {
      queryParams: {
        homeId: match.idHomeTeam,
        awayId: match.idAwayTeam,
        leagueId: this.selectedLeague?.id,
        date: match.dateEvent,
        time: match.strTime,
        venue: match.strVenue
      }
    });
  }
}