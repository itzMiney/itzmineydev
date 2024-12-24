import {Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NgIf} from '@angular/common';
import {Router, NavigationEnd, RouterLink} from '@angular/router';

@Component({
  selector: 'app-mobile-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.css'
})

export class MobileNavbarComponent implements OnInit{
  menuOpen = false;
  isMobile: boolean;
  activeLink: string = '';

  constructor(private router: Router, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
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
