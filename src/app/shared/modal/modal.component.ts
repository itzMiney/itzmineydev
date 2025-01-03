import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [
    NgIf
  ]
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Output() onClose = new EventEmitter<void>();

  closeModal() {
    this.isOpen = false;
    this.onClose.emit();
  }
}
