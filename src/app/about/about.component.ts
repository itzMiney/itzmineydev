import {AfterViewInit, Component, OnDestroy, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser, NgStyle} from '@angular/common';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [
    NgStyle
  ],
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-about-bg';
  isMobile: boolean = false;
  constructor(
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle('itzMiney\'s Home');
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }
  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0xa24d68,
      backgroundColor: 0x291c3c
    });
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
