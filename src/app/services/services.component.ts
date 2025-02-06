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
      name: '<b>Design a custom WordPress Website</b> (Files Only)',
      basic: '<b class="centered-text">Base Service: (€100)</b>I will make your basic custom designed WordPress Website,<br>and give you the files for installing it on your own dedicated server or WordPress host.<br><b class="centered-text">Additional Services:</b>&bull; Maintenance Service (€35/month),<br><br>&bull; Support Service (€50/month)<br>(Flat Rate €100 for minor issues up to 2.5 hours)',
      advanced: '<b class="centered-text">Base Service: (€100)</b>Basic + Detailed documentation of each feature.<br><b class="centered-text">Additional Services:</b>&bull; Maintenance Service (€35/month),<br><br>&bull; Support Service (€50/month)<br>(Flat Rate €100 for minor issues up to 2.5 hours)'
    },
    {
      name: '<b>Design custom WordPress Website + Setup</b>',
      basic: '<b class="centered-text">Base Service: (€150)</b>I will make your basic custom designed WordPress Website and also set it up for you on either:<br><br>&bull; A dedicated Server you provide<br>&bull; A WordPress host you already pay for<br>&bull; My own Server (shared host - €20/month)</span><br><b class="centered-text">Additional Services:</b>&bull; Domain registration and management (€20 setup)<br>+ Basic DDoS Protection Setup (€25/month),<br><br>&bull; Maintenance Service (€35/month),<br><br>&bull; Support Service (€50/hour)<br>(Flat Rate €100 for minor issues up to 2.5 hours)',
      advanced: '<b class="centered-text">Base Service: (€200)</b>Same as Basic Service + Additional security configuration<br><b class="centered-text">Additional Services:</b>&bull; Domain registration and management (€20 setup)<br>+ Advanced DDoS Protection Setup (€45/month),<br><br>&bull; Dedicated IPv4 Address (€15/month),<br><br>&bull; Maintenance Service (€35/month),<br><br>&bull; Support Service (€50/hour)<br>(Flat Rate €100 for minor issues up to 2.5 hours)'
    },
    {
      name: '<b>Custom-made Website in Angular</b> (Files Only)',
      basic: '<b class="centered-text">Base Service: (€200)</b>I will make a custom Website <b>frontend</b> for you using Node.js, TypeScript, HTML & CSS in Angular CLI and give you the files.<br><br>If you already have a backend please provide it to me or a documentation of it, so I can implement it in the frontend.<br><br>If not, provide me with the details of what the backend will be able to do later and I will make placeholders in the frontend code for the backend calls that can be added later.<br><b class="centered-text">Additional Services:</b>&bull; Maintenance Service (€50/month),<br><br>&bull; Support Service (€75/hour)<br>(Flat Rate €130 for minor issues up to 2.5 hours)',
      advanced: '<b class="centered-text">Base Service: (€300)</b>Same as basic, but I will also make a Backend for you too.<br><b class="centered-text">Additional Services:</b>Maintenance Service (€50/month),<br><br>Support Service (€75/hour - Flat Rate €130 for minor issues up to 2.5 hours)'
    },
    {
      name: '<b>Custom-made Website in Angular + Setup</b>',
      basic: '<b class="centered-text">Base Service: (€400)</b>I will make a custom Website front- and backend for you using Node.js, TypeScript, HTML & CSS in Angular CLI and set it up for you on either:<br><br>&bull; A dedicated Server you provide<br>&bull; A WordPress host you already pay for<br>&bull; My own Server (shared host - €20/month)<br><b class="centered-text">Additional Services:</b>&bull; Domain registration and management (€20 setup)<br>+ Basic DDoS Protection Setup (€25/month),<br><br>&bull; Maintenance Service (€50/month),<br><br>&bull; Support Service (€75/hour)<br>(Flat Rate €130 for minor issues up to 2.5 hours)',
      advanced: '<b class="centered-text">Base Service: (€400)</b>Same as Basic Service<br><b class="centered-text">Additional Services:</b>&bull; Domain registration and management (€20 setup)<br>+ Advanced DDoS Protection Setup (€45/month),<br><br>&bull; Dedicated IPv4 Address (€15/month),<br><br>&bull; Maintenance Service (€50/month),<br><br>&bull; Support Service (€75/hour)<br>(Flat Rate €130 for minor issues up to 2.5 hours)'
    },
    {
      name: '<b>Web Server Setup for Customer provided Software</b>',
      basic: '<b class="centered-text">Base Service: (€350)</b>I will set up custom server software that you already obtained for you on a dedicated server you provide and configure it to run securely.<br><b class="centered-text">Additional Services:</b>&bull; Maintenance Service (€60/month),<br><br>&bull; Support Service (€90/hour - Flat Rate €160 for minor issues up to 2.5 hours)',
      advanced: '<b class="centered-text">Base Service: (€350):</b>I will set up custom server software that you already obtained for you and host it for you on my own dedicated server (shared host - €30/month).<br><b class="centered-text">Additional Services:</b>&bull; Maintenance Service (€60/month),<br><br>&bull; Support Service (€90/hour - Flat Rate €160 for minor issues up to 2.5 hours)'
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
