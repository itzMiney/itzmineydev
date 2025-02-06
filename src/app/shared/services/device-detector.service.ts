import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DeviceDetectorService {
  isMobile: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.updateDeviceType();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => this.updateDeviceType());
    }
  }

  private updateDeviceType() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    } else {
      this.isMobile = false;
    }
  }
}
