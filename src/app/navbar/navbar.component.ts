import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterLink} from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects; // Capture the active route
      }
    });
  }
}
