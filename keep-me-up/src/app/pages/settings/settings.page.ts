import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { League } from '../../models/league.model';
import { Team } from '../../models/team.model';
import { LEAGUES } from '../../data/leagues';
import { FootballService } from '../../services/football.service';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from '../../shared/constants/storage-keys';

import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class SettingsPage implements OnInit {
  leagues: League[] = LEAGUES;
  teams: Team[] = [];

  selectedLeagueId = '';
  selectedTeamId = '';
  selectedThemeMode: ThemeMode = 'team';

  loadingTeams = false;
  saving = false;

  constructor(
    private router: Router,
    private location: Location,
    private footballService: FootballService,
    private storageService: StorageService,
    private themeService: ThemeService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSavedSettings();
  }

  private async loadSavedSettings(): Promise<void> {
    const favouriteLeague = await this.storageService.get<string>(STORAGE_KEYS.favouriteLeague);
    const favouriteTeam = await this.storageService.get<string>(STORAGE_KEYS.favouriteTeam);
    const themeMode = await this.storageService.get<ThemeMode>(STORAGE_KEYS.themeMode);

    this.selectedLeagueId = favouriteLeague ?? this.leagues[0]?.id ?? '';
    this.selectedTeamId = favouriteTeam ?? '';
    this.selectedThemeMode = themeMode ?? 'team';

    if (this.selectedLeagueId) {
      await this.loadTeamsForLeague(this.selectedLeagueId);
    }
  }

  async onLeagueChange(event: CustomEvent): Promise<void> {
    const leagueId = event.detail.value as string;
    this.selectedLeagueId = leagueId;
    this.selectedTeamId = '';
    await this.loadTeamsForLeague(leagueId);
  }

  private async loadTeamsForLeague(leagueId: string): Promise<void> {
    const league = this.leagues.find(item => item.id === leagueId);

    if (!league) {
      this.teams = [];
      return;
    }

    this.loadingTeams = true;
    this.teams = [];

    this.footballService.getTeamsByLeague(league.name).subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loadingTeams = false;
      },
      error: (error) => {
        console.error('Error loading teams for settings', error);
        this.teams = [];
        this.loadingTeams = false;
      }
    });
  }

  async saveSettings(): Promise<void> {
    this.saving = true;

    try {
      if (this.selectedLeagueId) {
        await this.storageService.set(STORAGE_KEYS.favouriteLeague, this.selectedLeagueId);
      }

      if (this.selectedTeamId) {
        await this.storageService.set(STORAGE_KEYS.favouriteTeam, this.selectedTeamId);
      } else {
        await this.storageService.remove(STORAGE_KEYS.favouriteTeam);
      }

      await this.themeService.saveTheme(this.selectedThemeMode);
      await this.themeService.refreshTeamTheme();
    } finally {
      this.saving = false;
    }
  }

  async clearSettings(): Promise<void> {
    this.selectedLeagueId = this.leagues[0]?.id ?? '';
    this.selectedTeamId = '';
    this.selectedThemeMode = 'team';

    await this.storageService.remove(STORAGE_KEYS.favouriteLeague);
    await this.storageService.remove(STORAGE_KEYS.favouriteTeam);
    await this.storageService.remove(STORAGE_KEYS.themeMode);

    await this.themeService.applyTheme('team');

    if (this.selectedLeagueId) {
      await this.loadTeamsForLeague(this.selectedLeagueId);
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goBack(): void {
    this.location.back();
  }
}