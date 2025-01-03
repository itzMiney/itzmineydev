import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    RouterLink
  ]
})
export class NavbarComponent implements OnInit {
  activeLink: string = '';
  isMobile: boolean;

  constructor(private router: Router, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
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
