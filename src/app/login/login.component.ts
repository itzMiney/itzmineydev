import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {VantaBackgroundService} from '../services/vanta-background.service';
import {DeviceDetectorService} from '../services/device-detector.service';
import {isPlatformBrowser} from '@angular/common';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  onLogin() {
    const observer = {
      'next': (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/admin']).then(
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
      error: () => {
        this.errorMessage = 'Invalid credentials';
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
