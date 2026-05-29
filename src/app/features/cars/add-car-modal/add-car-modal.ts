import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Car} from '../car-model';
import {CarService} from '../car-service';
import {ToastService} from '../../../shared/ui/toast-service';
import {MailService} from '../../mailing/mail-service';
import {CarStatus} from '../../../shared/ui/enums/car-status.enum';
import {CAR_GENERATIONS, CarGeneration} from '../../../shared/data/car-generations';

@Component({
  selector: 'app-add-car-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-car-modal.html',
  styleUrl: './add-car-modal.css',
})
export class AddCarModal {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  carService = inject(CarService);
  private toastService = inject(ToastService);
  private mailService = inject(MailService);
  private currentYear = new Date().getFullYear();

  readonly CarStatus = CarStatus;

  generationOptions = signal<CarGeneration[]>([]);
  submitting        = signal(false);
  yearRange         = signal<{minYear: number; maxYear: number} | null>(null);

  form = this.fb.nonNullable.group({
    brand:          ['', Validators.required],
    generation:     [''],
    model:          ['', Validators.required],
    productionYear: [this.currentYear, [Validators.required, Validators.min(1900)]],
    purchasePrice:  [0, [Validators.required, Validators.min(0)]],
    salePrice:      [null as number | null],
    status:         [CarStatus.GOTOWE, Validators.required],
    usersToInvite:  this.fb.array<string>([]),
  });

  emailControl = this.fb.nonNullable.control('', [Validators.required, Validators.email]);

  // ── Cascading handlers ───────────────────────────────────────────────────────

  onBrandChange(event: Event) {
    const brand = (event.target as HTMLInputElement).value.trim();
    this.form.patchValue({generation: '', model: ''});
    this.generationOptions.set(CAR_GENERATIONS[brand] ?? []);
    this.yearRange.set(null);
  }

  onGenerationChange(event: Event) {
    const code = (event.target as HTMLInputElement).value.trim();
    const brand = this.form.getRawValue().brand.trim();
    this.form.patchValue({model: ''});

    const gen = (CAR_GENERATIONS[brand] ?? []).find(g => g.code === code);
    if (!gen) {
      this.yearRange.set(null);
      return;
    }

    this.yearRange.set({minYear: gen.minYear, maxYear: gen.maxYear});
    this.form.patchValue({productionYear: Math.round((gen.minYear + gen.maxYear) / 2)});
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    const car: Car = {
      carId: null,
      images: [],
      kwPower: 0,
      mileage: 0,
      isImported: false,
      isDamaged: false,
      brand: raw.brand,
      generation: raw.generation || undefined,
      model: raw.model,
      productionYear: raw.productionYear,
      purchasePrice: raw.purchasePrice,
      salePrice: raw.salePrice ?? undefined,
      isSold: raw.status === CarStatus.SPRZEDANE,
      status: raw.status,
    };
    this.submitting.set(true);
    const carName = [raw.brand, raw.generation, raw.model].filter(Boolean).join(' ');
    this.carService.create(car).subscribe({
      next: (created) => {
        this.toastService.show('Samochód dodany');
        this.submitting.set(false);
        const emails = raw.usersToInvite.filter((e): e is string => !!e);
        if (emails.length > 0) {
          this.mailService.sendInvite(created.carId, carName, emails).subscribe();
        }
        this.close.emit();
      },
      error: () => { this.toastService.show('Błąd zapisu'); this.submitting.set(false); },
    });
  }

  closeModal() { this.close.emit(); }
  addUser() {
    if (this.emailControl.invalid) return;
    this.usersToInvite.push(this.fb.control(this.emailControl.value));
    this.emailControl.reset();
  }
  removeUser(i: number) { this.usersToInvite.removeAt(i); }
  get usersToInvite(): FormArray { return this.form.get('usersToInvite') as FormArray; }
}
