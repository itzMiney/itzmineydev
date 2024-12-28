import {Component, OnInit, OnDestroy, AfterViewInit, Inject} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    NgIf,
    HttpClientModule
  ]
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  private vantaEffect: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    window.addEventListener('resize', this.onResize.bind(this));

    const bgElement = document.getElementById('vanta-login-bg');
    if (bgElement) {
      bgElement.style.position = 'fixed';
    }
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/admin']); // Redirect to admin page
      },
      () => {
        this.errorMessage = 'Invalid credentials';
      }
    );
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize VANTA effect only in the browser
      this.initVanta();
      this.resizeVanta();
    }
  }
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.vantaEffect) {
        this.vantaEffect.destroy(); // Clean up the effect on destroy
      }
      window.removeEventListener('resize', this.onResize); // Remove the listener when the component is destroyed
    }
  }

  initVanta() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize the Vanta effect on the element with ID 'vanta-bg'
      this.vantaEffect = window.VANTA.NET({
        el: '#vanta-login-bg',
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.00,
        scaleMobile: 1.00,
        points: 20.00,
        maxDistance: 25.00,
        spacing: 18.00,
        showDots: false,
        minWidth: window.innerWidth,
        minHeight: window.innerHeight,
      });
    }
  }

  onResize() {
    // Update the minHeight and minWidth when the window is resized
    this.resizeVanta();
  }

  resizeVanta() {
    if (this.vantaEffect) {
      // Trigger the resize on the vanta effect
      this.vantaEffect.resize();
    }
  }
}
