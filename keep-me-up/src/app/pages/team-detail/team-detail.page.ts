import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { FootballService } from '../../services/football.service';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TeamDetailPage {
  team: Team | null = null;
  matches: Match[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private footballService: FootballService
  ) {}

  ionViewWillEnter(): void {
    const teamId = this.route.snapshot.paramMap.get('id');

    if (!teamId) {
      this.loading = false;
      this.team = null;
      this.matches = [];
      return;
    }

    this.loadTeamData(teamId);
  }

  private loadTeamData(teamId: string): void {
    this.loading = true;
    this.team = null;
    this.matches = [];

    console.log('Loading team:', teamId);

    this.footballService.getTeamById(teamId).subscribe({
      next: (team) => {
        console.log('Team response:', team);
        this.team = team;
      },
      error: (err) => {
        console.error('Error loading team', err);
        this.team = null;
      }
    });

    this.footballService.getLastTeamMatches(teamId).subscribe({
      next: (matches) => {
        console.log('Matches response:', matches);
        this.matches = matches;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading matches', err);
        this.matches = [];
        this.loading = false;
      }
    });
  }
}