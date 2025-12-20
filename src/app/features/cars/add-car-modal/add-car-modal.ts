import {Component, EventEmitter, HostListener, inject, Output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Car} from '../car-model';
import {CarService} from '../car-service';
import {ToastService} from '../../../shared/ui/toast-service';

@Component({
  selector: 'app-add-car-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-car-modal.html',
  styleUrl: './add-car-modal.css',
})
export class AddCarModal {
  private formBuilder = inject(FormBuilder);
  private carService = inject(CarService);
  private toastService = inject(ToastService);

  @Output() close = new EventEmitter<void>();
  submitting = signal(false);

  form = this.formBuilder.nonNullable.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    productionYear: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(1950)],
    ],
    purchasePrice: [0, [Validators.required, Validators.min(0)]],
    salePrice: [null],
    isSold: [false, Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const raw = this.form.getRawValue();

    const car: Car = {
      ...raw,
      salePrice: raw.salePrice ?? undefined,
    };

    this.carService.create(car).subscribe({
      next: () => {
        this.toastService.show('Samochód dodany');
        this.submitting.set(false);
        this.close.emit();
      },
      error: () => {
        this.toastService.show('Błąd zapisu');
        this.submitting.set(false);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeModal();
  }

}
