import { Component, OnInit } from '@angular/core';
import {NgIf} from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import {RouterOutlet, ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {MobileNavbarComponent} from './mobile-navbar/mobile-navbar.component';
import {FooterComponent} from './footer/footer.component';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MobileNavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isMobile: boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
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
        if (this.router.url === '/') {
          // Add specific fallback meta for root route
          meta.title = meta.title || 'itzMiney\'s Home';
          meta.description = meta.description || 'Welcome to itzMiney\'s Homepage! Here you can find my portfolio and other cool stuff.';
          meta.image = meta.image || 'https://itzminey.dev/assets/ogimg.png';
          meta.url = meta.url || 'https://itzminey.dev';
        }
        this.updateMetaTags(meta);
      });
  }

  updateMetaTags(meta: { title?: string; description?: string; image?: string; url?: string }) {
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
  }
}
