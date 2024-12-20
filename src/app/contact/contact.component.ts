import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private titleService: Title, private fb: FormBuilder, private meta: Meta) {}
  private vantaEffect: any;
  contactForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.titleService.setTitle('Contact | itzMiney');
    this.meta.updateTag({ name: 'description', content: 'Wanna get in touch? Fill out this short Contact form and I\'ll get back to you as soon as I can!' });
    this.meta.updateTag({ property: 'og:image', content: 'https://itzminey.dev/assets/ogimg.png' });

    window.addEventListener('resize', this.onResize.bind(this)); // Add resize listener for responsiveness

    const bgElement = document.getElementById('vanta-contact-bg')
    if (bgElement) {
      bgElement.style.position = 'fixed';
    }

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Name is required and at least 3 chars
      email: ['', [Validators.required, Validators.email]], // Email is required and must be valid
      message: ['', [Validators.required, Validators.minLength(10)]], // Message is required and at least 10 chars
    });
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
      el: '#vanta-contact-bg',
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
      color: 0xbb3fff,
      backgroundColor: 0x15193c
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

  onSubmit() {

  }
}
