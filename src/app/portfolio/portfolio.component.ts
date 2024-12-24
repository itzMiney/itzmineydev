import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [
    NgIf
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }
  isMobile: boolean;
  private vantaEffect: any;

  ngOnInit() {
    window.addEventListener('resize', this.onResize.bind(this)); // Add resize listener for responsiveness

    const bgElement = document.getElementById('vanta-portfolio-bg');
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
      el: '#vanta-portfolio-bg',
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
      color: 0xac1f4e,
      backgroundColor: 0x191522
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
