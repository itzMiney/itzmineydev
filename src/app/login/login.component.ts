import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {isPlatformBrowser} from '@angular/common';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    NgIf,
  ]
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  private readonly elementId = 'vanta-login-bg';
  isMobile: boolean = false;
  redirectUrl: string = '/admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Login | itzMiney')
    this.isMobile = this.deviceService.isMobile;

    this.route.queryParams.subscribe(params => {
      if (params['redirectUrl']) {
        this.redirectUrl = decodeURIComponent(params['redirectUrl']);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  onLogin() {
    const observer = {
      'next': (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate([this.redirectUrl]).then(
          (success) => {
            if (success) {
              console.log('Navigation to admin succeeded');
            } else {
              console.warn('Navigation to admin failed');
            }
          },
          (error) => {
            console.error('Navigation error:', error);
          }
        );
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
        console.error('Login error:', err);
      },
    };

    this.authService.login(this.username, this.password).subscribe(observer);
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {});
  }
  ngOnDestroy() {
    this.vantaService.destroyVanta(this.elementId);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  onResize() {
    this.vantaService.resizeVanta(this.elementId);
  }
}
