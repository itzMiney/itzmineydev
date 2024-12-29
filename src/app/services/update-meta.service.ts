import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UpdateMetaService {

  constructor(private titleService: Title, private metaService: Meta) {}

  updateMetaTags(meta: { title?: string; description?: string; image?: string; url?: string; color?: string }) {
    if (meta.title) {
      this.titleService.setTitle(meta.title);
      this.metaService.updateTag({ name: 'og:title', content: meta.title });
    }
    if (meta.description) {
      this.metaService.updateTag({ name: 'description', content: meta.description });
      this.metaService.updateTag({ name: 'og:description', content: meta.description });
    }
    if (meta.image) {
      this.metaService.updateTag({ name: 'og:image', content: meta.image });
    }
    if (meta.url) {
      this.metaService.updateTag({ name: 'og:url', content: meta.url });
    }
    if (meta.color) {
      this.metaService.updateTag({ name: 'theme-color', content: meta.color });
    }
  }
}
