import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FootballService } from '../../services/football.service';
import { Team } from '../../models/team.model';
import { LEAGUES } from '../../data/leagues';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class TeamsPage implements OnInit {
  teams: Team[] = [];
  league: League | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private footballService: FootballService
  ) {}

  ngOnInit(): void {
    const leagueId = this.route.snapshot.paramMap.get('id');
    this.league = LEAGUES.find(league => league.id === leagueId);

    if (!this.league) {
      this.loading = false;
      return;
    }

    this.footballService.getTeamsByLeague(this.league.name).subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teams', error);
        this.loading = false;
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goBack(): void {
    this.location.back();
  }
}