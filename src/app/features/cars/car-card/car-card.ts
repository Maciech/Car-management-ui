import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {Car} from '../car-model';
import {Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {CAR_STATUS_CSS, CAR_STATUS_LABELS, CarStatus} from '../../../shared/ui/enums/car-status.enum';
import {ImageService} from '../car-detail/car-gallery/image-service';
import {ImageModel} from '../car-detail/car-gallery/image-model';

@Component({
  selector: 'app-car-card',
  imports: [DecimalPipe],
  templateUrl: './car-card.html',
  styleUrl: './car-card.css',
})
export class CarCard implements OnInit {
  private router = inject(Router);
  private imageService = inject(ImageService);

  @Input({required: true}) car!: Car;

  images = signal<ImageModel[]>([]);
  currentIndex = signal(0);

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

  get hasMultiple(): boolean {
    return this.images().length > 1;
  }

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
    const status = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_LABELS[status];
  }

  get statusCss(): string {
    const status = this.car.status ?? (this.car.isSold ? CarStatus.SPRZEDANE : CarStatus.GOTOWE);
    return CAR_STATUS_CSS[status];
  }

  open() {
    this.router.navigate(['/cars', this.car.carId]);
  }
}
