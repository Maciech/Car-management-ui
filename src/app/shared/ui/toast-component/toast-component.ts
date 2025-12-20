import { Component } from '@angular/core';
import {ToastService} from '../toast-service';

@Component({
  selector: 'app-toast-component',
  imports: [],
  template: `
    @if (toast.message()) {
      <div class="toast">
        {{ toast.message() }}
      </div>
    }
  `,
  styleUrl: './toast-component.css',
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
