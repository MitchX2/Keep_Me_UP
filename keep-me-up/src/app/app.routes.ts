import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'league-table/:id',
    loadComponent: () =>
      import('./pages/league-table/league-table.page').then((m) => m.LeagueTablePage),
  },
  {
    path: 'teams/:id',
    loadComponent: () =>
      import('./pages/teams/teams.page').then((m) => m.TeamsPage),
      
  },
  
  {
    path: 'team/:id',
    loadComponent: () =>
      import('./pages/team-detail/team-detail.page').then((m) => m.TeamDetailPage),
  },
  {
    path: 'matchday',
    loadComponent: () => import('./pages/matchday/matchday.page').then( m => m.MatchdayPage)
  }
];
