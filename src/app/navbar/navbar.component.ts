import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {NgIf} from '@angular/common';

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

  ngOnInit() {
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects; // Capture the active route
      }
    });
  }
}
