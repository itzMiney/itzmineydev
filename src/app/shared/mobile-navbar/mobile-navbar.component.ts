import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-navbar',
  imports: [
    RouterLink,
    TranslatePipe
],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.css'
})

export class MobileNavbarComponent implements OnInit{
  currentLang: string;
  menuOpen = false;
  isMobile: boolean;
  activeLink: string = '';

  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
    private translate: TranslateService
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuOpen = false;
        this.activeLink = event.urlAfterRedirects; // Capture the active route
      }
    });
  }
}
