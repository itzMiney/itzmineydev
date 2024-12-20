import {Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})

export class NotFoundComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private titleService: Title, private meta: Meta) {}
  private vantaEffect: any;

  ngOnInit() {
    this.titleService.setTitle('404 Not Found');
    this.meta.updateTag({ name: 'description', content: 'How the hell did you end up here?' });
    this.meta.updateTag({ property: 'og:image', content: 'https://itzminey.dev/assets/ogimg.png' });

    window.addEventListener('resize', this.onResize.bind(this)); // Add resize listener for responsiveness

    const bgElement = document.getElementById('vanta-not-found-bg');
    if (bgElement) {
      bgElement.style.position = 'fixed';
    }
  }

  ngAfterViewInit() {
    this.initVanta();
    this.resizeVanta();
  }
  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy(); // Clean up the effect on destroy
    }
    window.removeEventListener('resize', this.onResize); // Remove the listener when the component is destroyed
  }

  initVanta() {
    // Initialize the Vanta effect on the element with ID 'vanta-bg'
    this.vantaEffect = window.VANTA.NET({
      el: '#vanta-not-found-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      scale: 1.00,
      scaleMobile: 1.00,
      points: 20.00,
      maxDistance: 25.00,
      spacing: 18.00,
      showDots: false,
      minWidth: window.innerWidth,
      minHeight: window.innerHeight,
      color: 0xac1f4e,
      backgroundColor: 0x191522
    });
  }

  onResize() {
    // Update the minHeight and minWidth when the window is resized
    this.resizeVanta();
  }

  resizeVanta() {
    if (this.vantaEffect) {
      // Trigger the resize on the vanta effect
      this.vantaEffect.resize();
    }
  }
}
