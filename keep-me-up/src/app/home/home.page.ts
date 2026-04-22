import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { League } from '../models/league.model';
import { Standing } from '../models/standing.model';
import { Match } from '../models/match.model';
import { LEAGUES } from '../data/leagues';
import { FootballService } from '../services/football.service';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../shared/constants/storage-keys';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class HomePage implements OnInit {
  leagues: League[] = LEAGUES;
  selectedLeague: League | null = null;
  standings: Standing[] = [];
  matches: Match[] = [];
  selectedTeamId: string | null = null;
  loading = false;

  constructor(
    private footballService: FootballService,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadInitialLeague();
    await this.loadLeagueData();
  }

  async loadInitialLeague(): Promise<void> {
    const storedLeagueId = await this.storageService.get<string>(STORAGE_KEYS.favouriteLeague);

    if (storedLeagueId) {
      this.selectedLeague = this.leagues.find(l => l.id === storedLeagueId) ?? this.leagues[0];
    } else {
      this.selectedLeague = this.leagues[0];
    }
  }

  async onLeagueChange(event: any): Promise<void> {
    const leagueId = event.detail.value;
    this.selectedLeague = this.leagues.find(l => l.id === leagueId) ?? this.leagues[0];
    this.selectedTeamId = null;

    await this.storageService.set(STORAGE_KEYS.favouriteLeague, this.selectedLeague.id);
    await this.loadLeagueData();
  }

  async loadLeagueData(): Promise<void> {
    if (!this.selectedLeague) return;

    this.loading = true;

    this.footballService.getStandings(this.selectedLeague.id).subscribe({
      next: (standings) => {
        this.standings = standings;
      },
      error: (err) => {
        console.error('Error loading standings', err);
        this.standings = [];
      }
    });

    this.footballService.getNextLeagueMatches(this.selectedLeague.id).subscribe({
      next: (matches: Match[]) => {
        this.matches = matches;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading matches', err);
        this.matches = [];
        this.loading = false;
      }
    });
  }

  selectTeam(teamId: string): void {
    this.selectedTeamId = teamId;
  }
}