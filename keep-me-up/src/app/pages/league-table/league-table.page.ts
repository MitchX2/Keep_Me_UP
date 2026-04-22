import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { FootballService } from '../../services/football.service';
import { Standing } from '../../models/standing.model';
import { LEAGUES } from '../../data/leagues';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-table.page.html',
  styleUrls: ['./league-table.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LeagueTablePage implements OnInit {
  standings: Standing[] = [];
  league: League | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private footballService: FootballService
  ) {}

  ngOnInit(): void {
    const leagueId = this.route.snapshot.paramMap.get('id');

    this.league = LEAGUES.find(l => l.id === leagueId);

    if (!leagueId) {
      this.loading = false;
      return;
    }



    this.footballService.getStandings(leagueId).subscribe({
      next: (standings: Standing[]) => {
        this.standings = standings;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading standings', err);
        this.loading = false;
      }
    });

  }
}