import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Standing } from '../models/standing.model';
import { Team } from '../models/team.model';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class FootballService {
  private apiKey = '698352';
  private baseUrl = `https://www.thesportsdb.com/api/v1/json/${this.apiKey}`;

  constructor(private http: HttpClient) {}

  // getStandings(leagueId: string): Observable<Standing[]> {
  //   return this.http
  //     .get<{ table: Standing[] }>(`${this.baseUrl}/lookuptable.php?l=${leagueId}`)
  //     .pipe(map(response => response.table ?? []));
  // }

  getStandings(leagueId: string): Observable<Standing[]> {
    return this.http
      .get<{ table: Standing[] }>(`${this.baseUrl}/lookuptable.php?l=${leagueId}`)
      .pipe(map(response => response.table ?? []));
  }

  getTeams(leagueName: string): Observable<Team[]> {
    return this.http
      .get<{ teams: Team[] }>(
        `${this.baseUrl}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`
      )
      .pipe(map(response => response.teams ?? []));
  }

  getPastLeagueMatches(leagueId: string): Observable<Match[]> {
    return this.http
      .get<{ events: Match[] }>(`${this.baseUrl}/eventspastleague.php?id=${leagueId}`)
      .pipe(map(response => response.events ?? []));
  }

  getTeamById(teamId: string): Observable<Team | null> {
    return this.http
      .get<{ teams: Team[] }>(`${this.baseUrl}/lookupteam.php?id=${teamId}`)
      .pipe(map(response => response.teams?.[0] ?? null));
  }

  getLastTeamMatches(teamId: string): Observable<Match[]> {
    return this.http
      .get<{ results: Match[] }>(`${this.baseUrl}/eventslast.php?id=${teamId}`)
      .pipe(map(response => response.results ?? []));
  }

  getNextLeagueMatches(leagueId: string): Observable<Match[]> {
  return this.http
    .get<{ events: Match[] }>(`${this.baseUrl}/eventsnextleague.php?id=${leagueId}`)
    .pipe(map(response => response.events ?? []));
}



}