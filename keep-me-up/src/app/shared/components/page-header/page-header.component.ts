import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon
  ]
})
export class PageHeaderComponent {
  @Input() showBackButton = true;
  @Input() showSettingsButton = true;
  @Input() headerBackground = '';

  constructor(
    private router: Router,
    private location: Location
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'settings-outline': settingsOutline
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goBack(): void {
    this.location.back();
  }

  getHeaderStyle(): Record<string, string> {
  return {
    background: this.headerBackground || 'var(--app-favourite-primary, var(--ion-color-primary))'
  };
}
}