import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {MobileNavbarComponent} from './mobile-navbar/mobile-navbar.component';
import {FooterComponent} from './footer/footer.component';
import {filter, map, mergeMap} from 'rxjs/operators';
import {DeviceDetectorService} from './services/device-detector.service';
import { UpdateMetaService } from './services/update-meta.service';

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
    private updateMetaService: UpdateMetaService,
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const meta = data['meta'] || {};
        if (this.router.url === '/about') {
          // fallback meta data
          meta.title = meta.title || 'itzMiney\'s Home';
          meta.description = meta.description || 'Welcome to itzMiney\'s Homepage! Here you can find my portfolio and other cool stuff.';
          meta.image = meta.image || 'https://itzminey.dev/assets/ogimg.png';
          meta.url = meta.url || 'https://itzminey.dev';
          meta.color = meta.color || '#eb284c';
        }
        this.updateMetaService.updateMetaTags(meta);
        this.checkRoute();
      });
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
      default: {
        this.showNavbar = true;
        this.showFooter = true;
        break;
      }
    }
  }
}
