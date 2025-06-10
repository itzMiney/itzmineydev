import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {Title} from '@angular/platform-browser';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  imports: [
    NgIf,
    TranslatePipe
  ],
  templateUrl: './tos.component.html',
  styleUrl: './tos.component.css'
})

export class TosComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-tos-bg';
  isMobile: boolean = false;
  activeSection: string = '';
  copiedSection: string | null = null;

  constructor(
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  scrollToSection(event: Event, targetId: string): void {
    event.preventDefault();

    const target = document.getElementById(targetId);

    if (target) {
      window.scrollTo({
        top: target.offsetTop + 80,
        behavior: 'smooth'
      });
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Terms of Service | itzMiney');
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0x5b417a,
      backgroundColor: 0x41e3c
    });
    this.initScrollTracking();
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

  initScrollTracking(): void {
    const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[];

    const updateActiveSection = () => {
      let closestSection: string | null = null;
      let minDistance = Number.MAX_VALUE;

      const viewportCenter = window.scrollY + window.innerHeight / 10;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const distance = Math.abs(viewportCenter - sectionTop);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section.id;
        }
      });

      if (closestSection && closestSection !== this.activeSection) {
        this.activeSection = closestSection;

        document.querySelectorAll('.floating-nav a').forEach(link => {
          link.classList.remove('active');
        });

        const activeLink = document.querySelector(`a[href="#${closestSection}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }

      requestAnimationFrame(updateActiveSection);
    };

    requestAnimationFrame(updateActiveSection);
  }

  copySectionLink(sectionId: string): void {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedSection = sectionId;

      setTimeout(() => {
        this.copiedSection = null;
      }, 2000);
    });
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
