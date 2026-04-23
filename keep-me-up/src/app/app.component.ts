import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './services/storage.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    storageService: StorageService,
    private themeService: ThemeService
  ) {
    void storageService;
    void this.initAppTheme();
  }

  private async initAppTheme(): Promise<void> {
    await this.themeService.initTheme();
  }
}