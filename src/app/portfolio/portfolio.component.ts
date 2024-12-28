import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {VantaBackgroundService} from '../services/vanta-background.service';
import {DeviceDetectorService} from '../services/device-detector.service';
import {isPlatformBrowser, NgIf} from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [
    NgIf
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-portfolio-bg';
  isMobile: boolean = false;
  constructor(
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0xac1f4e,
      backgroundColor: 0x191522
    });
  }
  ngOnDestroy() {
    this.vantaService.destroyVanta(this.elementId);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  onResize() {
    // Update the minHeight and minWidth when the window is resized
    this.vantaService.resizeVanta(this.elementId);
  }
}
