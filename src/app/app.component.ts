import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {MobileNavbarComponent} from './shared/mobile-navbar/mobile-navbar.component';
import {FooterComponent} from './shared/footer/footer.component';
import {DeviceDetectorService} from './shared/services/device-detector.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MobileNavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isMobile: boolean = false;
  showNavbar: boolean = true;
  showFooter: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit() {
    this.router.events.subscribe(() => this.checkRoute())
    this.isMobile = this.deviceService.isMobile;
  }

  checkRoute() {
    const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    switch (currentRoute) {
      case 'admin': {
        this.showNavbar = false;
        this.showFooter = false;
        break;
      }
      case "login": {
        this.showNavbar = false;
        this.showFooter = false;
        break;
      }
      case 'shortener': {
        this.showNavbar = false;
        this.showFooter = false;
        break;
      }
      default: {
        this.showNavbar = true;
        this.showFooter = true;
        break;
      }
    }
  }
}
