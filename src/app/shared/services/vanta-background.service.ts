import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class VantaBackgroundService {
  private vantaEffect: Map<string, any> = new Map();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  initVanta(elementId: string, options?: any) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(elementId);
      if (element && !this.vantaEffect.has(elementId)) {
        (window as any).VANTA.NET({
          el: element,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          scale: 1.0,
          scaleMobile: 1.0,
          points: 12.0,
          maxDistance: 30.0,
          spacing: 25.0,
          showDots: false,
          minWidth: window.innerWidth,
          minHeight: window.innerHeight,
          ...(options || {}),
        });
        element.style.position = 'fixed';
      }
    }
  }

  resizeVanta(elementId: string): void {
    const effect = this.vantaEffect.get(elementId);
    if (effect) {
      effect.resize();
    }
  }

  destroyVanta(elementId: string): void {
    const effect = this.vantaEffect.get(elementId);
    if (effect) {
      effect.destroy();
      this.vantaEffect.delete(elementId);
    }
  }
}
