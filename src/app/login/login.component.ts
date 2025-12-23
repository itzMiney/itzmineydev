import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {isPlatformBrowser} from '@angular/common';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule
]
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  username = '';
  password = '';
  errorMessage = '';
  private readonly isBrowser: boolean;
  private readonly boundResize = this.onResize.bind(this);
  private readonly elementId = 'vanta-login-bg';
  private readonly allowedAdminRoutes = new Set([
    '/admin',
    '/shortener'
  ]);
  isMobile = false;
  redirectUrl = '/admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.titleService.setTitle('Login | itzMiney')
    this.isMobile = this.deviceService.isMobile;

    this.route.queryParams.pipe(take(1)).subscribe(params => {
      const raw = params['redirectUrl'];

      if (typeof raw === 'string' && this.allowedAdminRoutes.has(raw)) {
        this.redirectUrl = raw;
      } else {
        this.redirectUrl = '/admin';
      }
    });

    if (this.isBrowser) {
      window.addEventListener('resize', this.boundResize);
    }
  }

  onLogin() {
    this.errorMessage = '';

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: () => {
        void this.router.navigateByUrl(this.redirectUrl);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ?? 'An error occurred. Please try again later.';
        console.error('Login error:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {});
  }
  ngOnDestroy() {
    this.vantaService.destroyVanta(this.elementId);
    if (this.isBrowser) {
      window.removeEventListener('resize', this.boundResize);
    }
  }

  onResize() {
    this.vantaService.resizeVanta(this.elementId);
  }
}
