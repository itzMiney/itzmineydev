import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private titleService: Title, private meta: Meta, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }
  isMobile: boolean;
  private vantaEffect: any;

  ngOnInit() {
    this.titleService.setTitle('itzMiney\'s Home');
    this.meta.updateTag({ name: 'description', content: 'Welcome to itzMiney\'s Homepage!\bHere you can find my portfolio and other cool stuff.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://itzminey.dev/assets/ogimg.png' });

    window.addEventListener('resize', this.onResize.bind(this)); // Add resize listener for responsiveness

    const bgElement = document.getElementById('vanta-about-bg');
    if (bgElement) {
      bgElement.style.position = 'fixed';
    }
  }
  ngAfterViewInit() {
    this.initVanta();
    this.resizeVanta();
  }
  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy(); // Clean up the effect on destroy
    }
    window.removeEventListener('resize', this.onResize); // Remove the listener when the component is destroyed
  }

  initVanta() {
    // Initialize the Vanta effect on the element with ID 'vanta-bg'
    this.vantaEffect = window.VANTA.NET({
      el: '#vanta-about-bg',
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
