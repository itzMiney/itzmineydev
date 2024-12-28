import {AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {VantaBackgroundService} from '../services/vanta-background.service';
import {DeviceDetectorService} from '../services/device-detector.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-about-bg';
  isMobile: boolean = false;
  constructor(
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
