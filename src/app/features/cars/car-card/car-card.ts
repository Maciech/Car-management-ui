import {Component, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import {Car} from '../car-model';
import {Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {CAR_STATUS_CSS, CAR_STATUS_LABELS, CarStatus} from '../../../shared/ui/enums/car-status.enum';
import {ImageService} from '../car-detail/car-gallery/image-service';
import {ImageModel} from '../car-detail/car-gallery/image-model';
import {CarService} from '../car-service';
import {ToastService} from '../../../shared/ui/toast-service';

type ConfirmType = 'delete' | 'status';

@Component({
  selector: 'app-car-card',
  imports: [DecimalPipe],
  templateUrl: './car-card.html',
  styleUrl: './car-card.css',
})
export class CarCard implements OnInit {
  private router       = inject(Router);
  private imageService = inject(ImageService);
  private carService   = inject(CarService);
  private toast        = inject(ToastService);

  @Input({required: true}) car!: Car;
  @Input() showActions = false;
  @Output() changed    = new EventEmitter<void>();

  images       = signal<ImageModel[]>([]);
  currentIndex = signal(0);

  actionsOpen   = signal(false);
  confirmType   = signal<ConfirmType | null>(null);
  pendingStatus = signal<CarStatus | null>(null);
  busy          = signal(false);

  readonly CarStatus = CarStatus;
  readonly statusOptions = [
    {value: CarStatus.W_NAPRAWIE, label: '🔧 W naprawie'},
    {value: CarStatus.GOTOWE,     label: '✅ Gotowe'},
    {value: CarStatus.WYSTAWIONE, label: '📢 Wystawione'},
    {value: CarStatus.SPRZEDANE,  label: '💰 Sprzedane'},
  ];

  ngOnInit() {
    if (this.car.carId) {
      this.imageService.getImagesByCarId(this.car.carId).subscribe({
        next: imgs => this.images.set(imgs),
      });
    }
  }

  get currentImage(): ImageModel | null {
    const imgs = this.images();
    return imgs.length > 0 ? imgs[this.currentIndex()] : null;
  }

  get hasMultiple(): boolean { return this.images().length > 1; }

  prev(event: MouseEvent) {
    event.stopPropagation();
    const len = this.images().length;
    this.currentIndex.set((this.currentIndex() - 1 + len) % len);
  }

  next(event: MouseEvent) {
    event.stopPropagation();
    const len = this.images().length;
    this.currentIndex.set((this.currentIndex() + 1) % len);
  }

  get statusLabel(): string {
    const s = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_LABELS[s];
  }

  get statusCss(): string {
    const s = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_CSS[s];
  }

  open() {
    if (this.actionsOpen() || this.confirmType()) return;
    this.router.navigate(['/cars', this.car.carId]);
  }

  // ── Actions menu ─────────────────────────────────────────────────────────────

  toggleActions(event: MouseEvent) {
    event.stopPropagation();
    this.actionsOpen.update(v => !v);
    this.confirmType.set(null);
  }

  closeActions() {
    this.actionsOpen.set(false);
    this.confirmType.set(null);
    this.pendingStatus.set(null);
  }

  requestStatus(status: CarStatus, event: MouseEvent) {
    event.stopPropagation();
    this.pendingStatus.set(status);
    this.confirmType.set('status');
    this.actionsOpen.set(false);
  }

  requestDelete(event: MouseEvent) {
    event.stopPropagation();
    this.confirmType.set('delete');
    this.actionsOpen.set(false);
  }

  cancelConfirm(event: MouseEvent) {
    event.stopPropagation();
    this.closeActions();
  }

  confirm(event: MouseEvent) {
    event.stopPropagation();
    if (this.busy()) return;

    if (this.confirmType() === 'delete') {
      this.busy.set(true);
      this.carService.delete(this.car.carId!).subscribe({
        next: () => { this.toast.show('Samochód usunięty'); this.busy.set(false); this.changed.emit(); },
        error: () => { this.toast.show('Błąd usuwania'); this.busy.set(false); this.closeActions(); },
      });

    } else if (this.confirmType() === 'status' && this.pendingStatus()) {
      const status = this.pendingStatus()!;
      const payload = {
        carId: this.car.carId,
        brand: this.car.brand, generation: this.car.generation ?? null, model: this.car.model,
        productionYear: this.car.productionYear, mileage: this.car.mileage,
        kWPower: this.car.kWPower, engineCapacity: this.car.engineCapacity,
        color: this.car.color, vinNumber: this.car.vinNumber ?? null,
        numberOfPreviousOwners: this.car.numberOfPreviousOwners ?? 0,
        description: this.car.description ?? null,
        purchasePrice: this.car.purchasePrice, salePrice: this.car.salePrice ?? null,
        status, isSold: status === CarStatus.SPRZEDANE,
        isImported: this.car.isImported ?? false, isDamaged: this.car.isDamaged,
      };
      this.busy.set(true);
      this.carService.update(this.car.carId!, payload).subscribe({
        next: () => { this.toast.show('Status zaktualizowany'); this.busy.set(false); this.closeActions(); this.changed.emit(); },
        error: () => { this.toast.show('Błąd zapisu'); this.busy.set(false); this.closeActions(); },
      });
    }
  }

  get confirmLabel(): string {
    if (this.confirmType() === 'delete') return 'Usunąć samochód?';
    const s = this.pendingStatus();
    return s ? `Zmienić status na "${CAR_STATUS_LABELS[s]}"?` : '';
  }
}
