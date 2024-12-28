import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {NgIf} from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import {RouterOutlet, ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {MobileNavbarComponent} from './mobile-navbar/mobile-navbar.component';
import {FooterComponent} from './footer/footer.component';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import {subscribe} from 'node:diagnostics_channel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MobileNavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isMobile: boolean;

  showNavbar: boolean = true;
  showFooter: boolean = true;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Use client-side logic to determine if it's mobile
      this.isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
    } else {
      // Default fallback for SSR
      this.isMobile = false; // Or any other logic to handle SSR
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
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
          // fallback meta
          meta.title = meta.title || 'itzMiney\'s Home';
          meta.description = meta.description || 'Welcome to itzMiney\'s Homepage! Here you can find my portfolio and other cool stuff.';
          meta.image = meta.image || 'https://itzminey.dev/assets/ogimg.png';
          meta.url = meta.url || 'https://itzminey.dev';
          meta.color = meta.color || '#eb284c';
        }
        this.updateMetaTags(meta);
        this.checkRoute();
      });
    this.checkRoute();
  }

  updateMetaTags(meta: { title?: string; description?: string; image?: string; url?: string; color?: string }) {
    if (meta.title) {
      this.titleService.setTitle(meta.title);
      this.metaService.updateTag({ name: 'og:title', content: meta.title });
    }
    if (meta.description) {
      this.metaService.updateTag({ name: 'description', content: meta.description });
      this.metaService.updateTag({ name: 'og:description', content: meta.description });
    }
    if (meta.image) {
      this.metaService.updateTag({ name: 'og:image', content: meta.image });
    }
    if (meta.url) {
      this.metaService.updateTag({ name: 'og:url', content: meta.url });
    }
    if (meta.color) {
      this.titleService.setTitle(meta.color);
      this.metaService.updateTag({ name: 'theme-color', content: meta.color});
    }
  }

  checkRoute() {
    const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;

    // Hide navbar and footer on admin route
    if (currentRoute === 'admin'||'login') {
      this.showNavbar = false;
      this.showFooter = false;
    } else {
      this.showNavbar = true;
      this.showFooter = true;
    }
  }
}
