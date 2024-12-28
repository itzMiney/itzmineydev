import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DeviceDetectorService} from '../services/device-detector.service'
import {isPlatformBrowser, NgIf} from '@angular/common';
import {VantaBackgroundService} from '../services/vanta-background.service';

@Component({
  selector: 'app-blog',
  imports: [
    NgIf
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-blog-bg';
  isMobile: boolean = false;
  constructor(
    private deviceService: DeviceDetectorService,
    private vantaService: VantaBackgroundService,
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
    this.vantaService.resizeVanta(this.elementId);
  }
}
