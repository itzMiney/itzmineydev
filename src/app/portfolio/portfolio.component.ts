import {AfterViewInit, Component, OnDestroy, OnInit, Inject} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NgIf} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  imports: [
    NgIf
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private deviceService: DeviceDetectorService,
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }
  isMobile: boolean = false;
  private vantaEffect: any;

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    const metaData = this.route.snapshot.data['meta'];
    if (metaData?.title) {
      this.title.setTitle(metaData.title);
    }
    if (metaData?.description) {
      this.meta.updateTag({ name: 'description', content: metaData.description });
    }
    if (metaData?.image) {
      this.meta.updateTag({ property: 'og:image', content: metaData.image });
    }
    if (metaData?.url) {
      this.meta.updateTag({ property: 'og:url', content: metaData.url });
    }
    window.addEventListener('resize', this.onResize.bind(this)); // Add resize listener for responsiveness

    const bgElement = document.getElementById('vanta-portfolio-bg');
    if (bgElement) {
      bgElement.style.position = 'fixed';
    }
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
