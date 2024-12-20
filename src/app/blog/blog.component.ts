import {Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private titleService: Title, private meta: Meta) {}
  private vantaEffect: any;

  ngOnInit() {
    this.titleService.setTitle('Blog | itzMiney');
    this.meta.updateTag({ name: 'description', content: 'Welcome to my blog!\bI\'ll post occasional updates here on the stuff I\'m currently up to.'});
    this.meta.updateTag({ property: 'og:image', content: 'https://itzminey.dev/assets/ogimg.png' });

    window.addEventListener('resize', this.onResize.bind(this)); // Add resize listener for responsiveness

    const bgElement = document.getElementById('vanta-blog-bg');
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
      el: '#vanta-blog-bg',
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
