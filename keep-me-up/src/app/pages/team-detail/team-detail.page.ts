import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

import { FootballService } from '../../services/football.service';
import { StorageService } from '../../services/storage.service';
import { ThemeService } from '../../services/theme.service';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';
import { STORAGE_KEYS } from '../../shared/constants/storage-keys';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, PageHeaderComponent]
})
export class TeamDetailPage {
  team: Team | null = null;
  matches: Match[] = [];
  loading = true;
  isFavourite = false;

  constructor(
    private route: ActivatedRoute,
    private footballService: FootballService,
    private storageService: StorageService,
    private themeService: ThemeService
  ) {}

  ionViewWillEnter(): void {
    const teamId = this.route.snapshot.paramMap.get('id');

    if (!teamId) {
      this.loading = false;
      this.team = null;
      this.matches = [];
      return;
    }

    void this.loadTeamData(teamId);
  }

  private async loadTeamData(teamId: string): Promise<void> {
    this.loading = true;
    this.team = null;
    this.matches = [];

    try {
      const result = await firstValueFrom(
        forkJoin({
          team: this.footballService.getTeamById(teamId),
          matches: this.footballService.getLastTeamMatches(teamId)
        })
      );

      this.team = result.team;
      this.matches = result.matches;
      await this.checkFavourite(teamId);
    } catch (error) {
      console.error('Error loading team detail data', error);
      this.team = null;
      this.matches = [];
      this.isFavourite = false;
    } finally {
      this.loading = false;
    }
  }

  private async checkFavourite(teamId: string): Promise<void> {
    const favouriteTeamId = await this.storageService.get<string>(STORAGE_KEYS.favouriteTeam);
    this.isFavourite = favouriteTeamId === teamId;
  }

  async toggleFavourite(): Promise<void> {
    if (!this.team) return;

    if (this.isFavourite) {
      await this.storageService.remove(STORAGE_KEYS.favouriteTeam);
      this.isFavourite = false;
    } else {
      await this.storageService.set(STORAGE_KEYS.favouriteTeam, this.team.idTeam);
      this.isFavourite = true;
    }

    await this.themeService.refreshTeamTheme();
  }

  async openWebsite(): Promise<void> {
    if (!this.team?.strWebsite) return;

    const website = this.team.strWebsite.startsWith('http')
      ? this.team.strWebsite
      : `https://${this.team.strWebsite}`;

    await Browser.open({ url: website });
  }

  async openMapsSearch(): Promise<void> {
    if (!this.team) return;

    const query = encodeURIComponent(
      `${this.team.strStadium || ''} ${this.team.strStadiumLocation || ''}`.trim()
    );

    if (!query) return;

    await Browser.open({
      url: `https://www.google.com/maps/search/?api=1&query=${query}`
    });
  }

  getMatchScore(match: Match): string {
    const homeScore = match.intHomeScore ?? '-';
    const awayScore = match.intAwayScore ?? '-';
    return `${homeScore} - ${awayScore}`;
  }

  getTeamAccentStyle(): Record<string, string> {
    if (!this.team?.strColour1) return {};

    return {
      'border-top': `4px solid ${this.team.strColour1}`,
      'box-shadow': `inset 0 0 0 1px ${this.hexToRgba(this.team.strColour1, 0.18)}`
    };
  }

  getInfoPillStyle(): Record<string, string> {
    if (!this.team?.strColour1) return {};

    return {
      background: this.hexToRgba(this.team.strColour1, 0.14)
    };
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

  getPageBackground(): string {
    if (!this.team?.strColour1) {
      return 'var(--ion-color-light)';
    }

    const strong = this.team.strColour1;
    const medium = this.hexToRgba(this.team.strColour1, 0.72);
    const soft = this.hexToRgba(this.team.strColour1, 0.28);

    return `linear-gradient(180deg, ${strong} 0%, ${medium} 28%, ${soft} 60%, var(--ion-color-light) 85%)`;
  }
}