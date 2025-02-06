import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {Title} from '@angular/platform-browser';
import {isPlatformBrowser, NgIf} from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [
    NgIf
  ],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.css'
})

export class ImprintComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-imprint-bg';
  copiedSection: string | null = null;

  constructor(
    private vantaService: VantaBackgroundService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Imprint | itzMiney');
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0x5b417a,
      backgroundColor: 0x41e3c
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

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      if (text.includes('@')) {
        this.copiedSection = 'email';
      } else if (text.includes('+')) {
        this.copiedSection = 'phone';
      }

      // Reset the copied section after 2 seconds
      setTimeout(() => {
        this.copiedSection = null;
      }, 2000);
    });
  }
}
