import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { FootballService } from './football.service';
import { STORAGE_KEYS } from '../shared/constants/storage-keys';

export type ThemeMode = 'team' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeClasses = ['theme-light', 'theme-dark', 'theme-team'];

  constructor(
    private storageService: StorageService,
    private footballService: FootballService
  ) {}

  async initTheme(): Promise<void> {
    const savedTheme = await this.storageService.get<ThemeMode>(STORAGE_KEYS.themeMode);
    await this.applyTheme(savedTheme ?? 'team');
  }

  async applyTheme(mode: ThemeMode): Promise<void> {
    document.body.classList.remove(...this.themeClasses);
    document.body.classList.add(`theme-${mode}`);

    if (mode === 'team') {
      await this.applyFavouriteTeamColours();
      return;
    }

    this.clearFavouriteTeamColours();
  }

  async saveTheme(mode: ThemeMode): Promise<void> {
    await this.storageService.set(STORAGE_KEYS.themeMode, mode);
    await this.applyTheme(mode);
  }

  async refreshTeamTheme(): Promise<void> {
    const savedTheme = await this.storageService.get<ThemeMode>(STORAGE_KEYS.themeMode);

    if ((savedTheme ?? 'team') === 'team') {
      await this.applyFavouriteTeamColours();
    }
  }

  private async applyFavouriteTeamColours(): Promise<void> {
    const favouriteTeamId = await this.storageService.get<string>(STORAGE_KEYS.favouriteTeam);

    if (!favouriteTeamId) {
      this.setDefaultTeamColours();
      return;
    }

    try {
      const team = await firstValueFrom(this.footballService.getTeamById(favouriteTeamId));

      if (!team?.strColour1) {
        this.setDefaultTeamColours();
        return;
      }

      const solid = team.strColour1;
      const medium = this.hexToRgba(solid, 0.68);
      const soft = this.hexToRgba(solid, 0.18);

      document.body.style.setProperty('--app-favourite-primary', solid);
      document.body.style.setProperty('--app-favourite-medium', medium);
      document.body.style.setProperty('--app-favourite-soft', soft);
      document.body.style.setProperty(
        '--app-favourite-background',
        `linear-gradient(180deg, ${solid} 0%, ${medium} 24%, ${soft} 58%, var(--ion-color-light) 86%)`
      );
    } catch (error) {
      console.error('Error applying favourite team theme', error);
      this.setDefaultTeamColours();
    }
  }

  private clearFavouriteTeamColours(): void {
    document.body.style.removeProperty('--app-favourite-primary');
    document.body.style.removeProperty('--app-favourite-medium');
    document.body.style.removeProperty('--app-favourite-soft');
    document.body.style.removeProperty('--app-favourite-background');
  }

  private setDefaultTeamColours(): void {
    this.clearFavouriteTeamColours();
    document.body.style.setProperty('--app-favourite-primary', 'var(--ion-color-primary)');
    document.body.style.setProperty('--app-favourite-medium', 'rgba(56, 128, 255, 0.45)');
    document.body.style.setProperty('--app-favourite-soft', 'rgba(56, 128, 255, 0.12)');
    document.body.style.setProperty(
      '--app-favourite-background',
      'linear-gradient(180deg, rgba(56, 128, 255, 0.32) 0%, rgba(56, 128, 255, 0.12) 55%, var(--ion-color-light) 85%)'
    );
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace('#', '');

    if (cleaned.length !== 6) {
      return `rgba(56, 128, 255, ${alpha})`;
    }

    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}