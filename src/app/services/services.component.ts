import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {VantaBackgroundService} from '../shared/services/vanta-background.service';
import {DeviceDetectorService} from '../shared/services/device-detector.service';
import {Title} from '@angular/platform-browser';
import {isPlatformBrowser, NgIf, NgFor, NgStyle} from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [
    NgStyle,
    NgIf,
    NgFor
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})

export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly elementId = 'vanta-services-bg';
  isMobile: boolean = false;
  activeTab: string[] = [];

  services = [
    {
      name: "<b>Support & Maintenance Service</b>",
      basic: `
            <b class="centered-text">Maintenance Service</b><br>
            Depending on the software(s) in use, flexible baseline ~€35-90+/month.<br>
            Contact me for a precise estimate.<br><br>
            <b>Support Service</b><br>
            Depending on the software(s) in use, flexible baseline ~€50-75+/hour.<br>
            <b>Flat Rate:</b> €60-130 for minor issues
            (up to 2.5 hours, depends on complexity, contact me for a precise estimate)
        `,
      advanced: `
            <b class="centered-text">Maintenance Service</b><br>
            Depending on the software(s) in use, flexible baseline ~€35-90+/month.<br>
            Contact me for a precise estimate.<br><br>
            <b>Support Service</b><br>
            Depending on the software(s) in use, flexible baseline ~€50-75+/hour.<br>
            <b>Flat Rate:</b> €60-130 for minor issues
            (up to 2.5 hours, depends on complexity, contact me for a precise estimate)
        `
    },
    {
      name: "<b>Design a Custom WordPress Website</b> (Files Only)",
      basic: `
            <b class="centered-text">Base Service: €100</b><br>
            I will design a custom WordPress website and provide the installation files for your dedicated server or WordPress host.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Maintenance Service (€35/month)<br>
            • Support Service (€50/hour)<br>
            <b>Flat Rate:</b> €50 for minor issues (up to 2.5 hours)
        `,
      advanced: `
            <b class="centered-text">Base Service: €100</b><br>
            Includes basic service + detailed documentation of each feature.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Maintenance Service (€35/month)<br>
            • Support Service (€50/hour)<br>
            <b>Flat Rate:</b> €50 for minor issues (up to 2.5 hours)
        `
    },
    {
      name: "<b>Design & Setup Custom WordPress Website</b>",
      basic: `
            <b class="centered-text">Base Service: €150</b><br>
            I will design a custom WordPress website and set it up on:<br>
            • Your dedicated server<br>
            • Your existing WordPress host<br>
            • My server (shared hosting: €20/month)<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Domain registration & management (€20 setup)<br>
            • Basic DDoS Protection (€25/month)<br>
            • Maintenance Service (€35/month)<br>
            • Support Service (€50/hour)<br>
            <b>Flat Rate:</b> €60 for minor issues (up to 2.5 hours)
        `,
      advanced: `
            <b class="centered-text">Base Service: €200</b><br>
            Includes basic service + additional security configuration.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Domain registration & management (€20 setup)<br>
            • Advanced DDoS Protection (€45/month)<br>
            • Dedicated IPv4 Address (€15/month)<br>
            • Maintenance Service (€35/month)<br>
            • Support Service (€50/hour)<br>
            <b>Flat Rate:</b> €60 for minor issues (up to 2.5 hours)
        `
    },
    {
      name: "<b>Custom-Made Website in Angular</b> (Files Only)",
      basic: `
            <b class="centered-text">Base Service: €200</b><br>
            I will develop a custom frontend using Angular, Node.js, TypeScript, HTML, and CSS, and provide the files.<br>
            If you have a backend, provide its documentation, so I can integrate it.<br>
            If not, I will add placeholders for future backend integration.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Maintenance Service (€50/month)<br>
            • Support Service (€75/hour)<br>
            <b>Flat Rate:</b> €100 for minor issues (up to 2.5 hours)
        `,
      advanced: `
            <b class="centered-text">Base Service: €300</b><br>
            Includes basic service + backend development.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Maintenance Service (€50/month)<br>
            • Support Service (€75/hour)<br>
            <b>Flat Rate:</b> €100 for minor issues (up to 2.5 hours)
        `
    },
    {
      name: "<b>Custom-Made Website in Angular + Setup</b>",
      basic: `
            <b class="centered-text">Base Service: €400</b><br>
            I will develop a full-stack website using Angular, Node.js, TypeScript, HTML, and CSS, and set it up on:<br>
            • Your dedicated server<br>
            • Your existing hosting provider<br>
            • My server (shared hosting: €20/month)<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Domain registration & management (€20 setup)<br>
            • Basic DDoS Protection (€25/month)<br>
            • Maintenance Service (€50/month)<br>
            • Support Service (€75/hour)<br>
            <b>Flat Rate:</b> €100 for minor issues (up to 2.5 hours)
        `,
      advanced: `
            <b class="centered-text">Base Service: €400</b><br>
            Includes basic service + additional security configuration.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Domain registration & management (€20 setup)<br>
            • Advanced DDoS Protection (€45/month)<br>
            • Dedicated IPv4 Address (€15/month)<br>
            • Maintenance Service (€50/month)<br>
            • Support Service (€75/hour)<br>
            <b>Flat Rate:</b> €100 for minor issues (up to 2.5 hours)
        `
    },
    {
      name: "<b>Server Setup for Provided Software</b>",
      basic: `
            <b class="centered-text">Flexible Baseline ~€100-250+</b><br>
            Pricing depends on software complexity, required configurations, and security hardening.<br>
            Contact me for a precise estimate.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Maintenance Service (€60/month)<br>
            • Support Service (€90/hour)<br>
            <b>Flat Rate:</b> €60-130 for minor issues
            (up to 2.5 hours, depends on complexity, contact me for a precise estimate)
        `,
      advanced: `
            <b class="centered-text">Flexible Baseline ~€100-250+</b><br>
            Pricing depends on software complexity, resource requirements, and hosting needs.<br>
            Shared hosting available (€30/month). Contact me for a dedicated solution.<br><br>
            <b class="centered-text">Additional Services:</b><br>
            • Maintenance Service (€60/month)<br>
            • Support Service (€90/hour)<br>
            <b>Flat Rate:</b> €60-130 for minor issues
            (up to 2.5 hours, depends on complexity, contact me for a precise estimate)
        `
    }
  ];

  constructor(
    private vantaService: VantaBackgroundService,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.activeTab = this.services.map(() => 'basic');
  }

  switchTab(serviceIndex: number, tab: string): void {
    this.activeTab[serviceIndex] = tab;
  }

  ngOnInit() {
    this.titleService.setTitle('Services | itzMiney');
    this.isMobile = this.deviceService.isMobile;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngAfterViewInit() {
    this.vantaService.initVanta(this.elementId, {
      color: 0xb3b3b3,
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
    // Update the minHeight and minWidth when the window is resized
    this.vantaService.resizeVanta(this.elementId);
  }
}
