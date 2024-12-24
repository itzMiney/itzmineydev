import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import {RouterOutlet, provideRouter, Router} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {MobileNavbarComponent} from './mobile-navbar/mobile-navbar.component';
import {FooterComponent} from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MobileNavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'itzmineydev';
  isMobile: boolean;

  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }
}
