import {Component, EventEmitter, inject, Input, OnChanges, Output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {Car} from '../../car-model';
import {CarService} from '../../car-service';
import {ToastService} from '../../../../shared/ui/toast-service';
import {CAR_STATUS_CSS, CAR_STATUS_LABELS, CarStatus} from '../../../../shared/ui/enums/car-status.enum';
import {CAR_COLOR_LABELS, CarColor} from '../../../../shared/ui/enums/car-color.enum';

@Component({
  selector: 'app-car-summary',
  imports: [DecimalPipe, ReactiveFormsModule],
  templateUrl: './car-summary.html',
  styleUrl: './car-summary.css',
})
export class CarSummary implements OnChanges {
  @Input() car!: Car;
  @Output() updated = new EventEmitter<void>();

  private fb       = inject(FormBuilder);
  protected carSvc = inject(CarService);
  private toast    = inject(ToastService);

  editing = signal(false);
  saving  = signal(false);

  readonly CarStatus    = CarStatus;
  readonly CarColor     = CarColor;
  readonly statusOptions = [
    {value: CarStatus.W_NAPRAWIE, label: '🔧 W naprawie'},
    {value: CarStatus.GOTOWE,     label: '✅ Gotowe'},
    {value: CarStatus.WYSTAWIONE, label: '📢 Wystawione'},
    {value: CarStatus.SPRZEDANE,  label: '💰 Sprzedane'},
  ];
  readonly colorOptions = Object.values(CarColor).map(v => ({value: v, label: CAR_COLOR_LABELS[v]}));

  form = this.fb.nonNullable.group({
    brand:                  ['', Validators.required],
    generation:             [''],
    model:                  ['', Validators.required],
    productionYear:         [2020, [Validators.required, Validators.min(1900)]],
    mileage:                [0,   [Validators.required, Validators.min(0)]],
    kwPower:                [0,   [Validators.min(0)]],
    engineCapacity:         [0,   [Validators.min(0)]],
    carColor:               [CarColor.WHITE, Validators.required],
    vinNumber:              [''],
    numberOfPreviousOwners: [0,   [Validators.required, Validators.min(0)]],
    description:            [''],
    purchasePrice:          [0,   [Validators.required, Validators.min(0)]],
    salePrice:              [null as number | null],
    status:                 [CarStatus.GOTOWE, Validators.required],
    isImported:             [false],
    isDamaged:              [false],
  });

  // ── Status & color display (view mode) ────────────────────────────────────
  get statusLabel() {
    const s = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_LABELS[s];
  }
  get statusCss() {
    const s = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_CSS[s];
  }
  get colorLabel() {
    return this.car.carColor ? CAR_COLOR_LABELS[this.car.carColor] : '—';
  }

  // ── Sync form when car input changes ──────────────────────────────────────
  ngOnChanges() {
    this.populateForm();
  }

  private populateForm() {
    this.form.patchValue({
      brand:                  this.car.brand,
      generation:             this.car.generation ?? '',
      model:                  this.car.model,
      productionYear:         this.car.productionYear,
      mileage:                this.car.mileage,
      kwPower:                this.car.kwPower,
      engineCapacity:         this.car.engineCapacity ?? 0,
      carColor:               this.car.carColor ?? CarColor.WHITE,
      vinNumber:              this.car.vinNumber ?? '',
      numberOfPreviousOwners: this.car.numberOfPreviousOwners ?? 0,
      description:            this.car.description ?? '',
      purchasePrice:          this.car.purchasePrice,
      salePrice:              this.car.salePrice ?? null,
      status:                 this.car.status ?? CarStatus.GOTOWE,
      isImported:             this.car.isImported,
      isDamaged:              this.car.isDamaged,
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  startEdit() {
    this.populateForm();
    this.editing.set(true);
  }

  cancel() { this.editing.set(false); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();

    // Wysyłamy TYLKO pola których oczekuje CarDto — bez spreadu całego CarEntity
    const payload = {
      carId:                  this.car.carId,
      brand:                  v.brand,
      generation:             v.generation || null,
      model:                  v.model,
      productionYear:         v.productionYear,
      mileage:                v.mileage,
      kwPower:                v.kwPower,
      engineCapacity:         v.engineCapacity,
      carColor:               v.carColor,
      vinNumber:              v.vinNumber || null,
      numberOfPreviousOwners: v.numberOfPreviousOwners,
      description:            v.description || null,
      purchasePrice:          v.purchasePrice,
      salePrice:              v.salePrice ?? null,
      status:                 v.status,
      isSold:                 v.status === CarStatus.SPRZEDANE,
      isImported:             v.isImported,
      isDamaged:              v.isDamaged,
    };

    this.saving.set(true);
    this.carSvc.update(this.car.carId!, payload).subscribe({
      next: () => {
        this.toast.show('Dane samochodu zaktualizowane');
        this.editing.set(false);
        this.saving.set(false);
        this.updated.emit();
      },
      error: () => {
        this.toast.show('Błąd zapisu');
        this.saving.set(false);
      },
    });
  }
}
