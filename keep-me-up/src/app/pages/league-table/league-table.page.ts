import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { FootballService } from '../../services/football.service';
import { StorageService } from '../../services/storage.service';
import { Standing } from '../../models/standing.model';
import { LEAGUES } from '../../data/leagues';
import { League } from '../../models/league.model';
import { STORAGE_KEYS } from '../../shared/constants/storage-keys';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-table.page.html',
  styleUrls: ['./league-table.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class LeagueTablePage implements OnInit {
  standings: Standing[] = [];
  league: League | undefined;
  favouriteTeamId: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private footballService: FootballService,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    const leagueId = this.route.snapshot.paramMap.get('id');
    this.league = LEAGUES.find(league => league.id === leagueId);
    this.favouriteTeamId = await this.storageService.get<string>(STORAGE_KEYS.favouriteTeam);

    if (!leagueId) {
      this.loading = false;
      return;
    }

    this.footballService.getStandings(leagueId).subscribe({
      next: (standings: Standing[]) => {
        this.standings = standings;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading standings', error);
        this.loading = false;
      }
    });
  }

  async ionViewWillEnter(): Promise<void> {
    this.favouriteTeamId = await this.storageService.get<string>(STORAGE_KEYS.favouriteTeam);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goBack(): void {
    this.location.back();
  }

  openTeam(teamId: string): void {
    this.router.navigate(['/team', teamId]);
  }

  isFavouriteTeam(teamId: string): boolean {
    return this.favouriteTeamId === teamId;
  }

  getRowClass(team: Standing): string {
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

  getFormCharacters(form?: string): string[] {
    if (!form) {
      return [];
    }

    return form.split('');
  }

  getFormClass(letter: string): string {
    switch (letter) {
      case 'W':
        return 'form-win';
      case 'D':
        return 'form-draw';
      case 'L':
        return 'form-loss';
      default:
        return '';
    }
  }
}