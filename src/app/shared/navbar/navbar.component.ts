import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {DeviceDetectorService} from '../services/device-detector.service';
import {filter} from 'rxjs/operators';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    RouterLink,
    TranslatePipe
  ]
})
export class NavbarComponent implements OnInit {
  currentLang: string;
  activeLink: string = '';
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
    private translate: TranslateService
  ) {
    this.isMobile = this.deviceService.isMobile;
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update activeLink based on current route
      const currentRoute = this.router.url;
      if (currentRoute.startsWith('/blog')) {
        this.activeLink = '/blog';
      } else {
        this.activeLink = currentRoute;
      }
    });
  }
}
