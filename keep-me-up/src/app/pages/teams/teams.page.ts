import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
    private footballService: FootballService
  ) {}

  ngOnInit(): void {
    const leagueId = this.route.snapshot.paramMap.get('id');

    this.league = LEAGUES.find(l => l.id === leagueId);

    if (!this.league) {
      this.loading = false;
      return;
    }

    // this.footballService.getTeams(this.league.name).subscribe({
    //   next: (teams) => {
    //     this.teams = teams;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error loading teams', err);
    //     this.loading = false;
    //   }
    // });

    this.footballService.getTeams(this.league.name).subscribe({
      // next: (teams) => {
      //   console.log('TEAMS RESPONSE:', teams);
      //   this.teams = teams;
      //   this.loading = false;
      // },

      next: (teams) => {
        console.log('Teams loaded:', teams);
        this.teams = teams;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading teams', err);
        this.loading = false;
      }
      
    });


  }
}