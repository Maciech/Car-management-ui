import {Component, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import {ImageService} from './image-service';
import {ImageModel} from './image-model';

interface UploadImage {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-car-gallery',
  imports: [],
  templateUrl: './car-gallery.html',
  styleUrl: './car-gallery.css',
})
export class CarGallery implements OnInit {
  @Input() carId!: number;
  @Output() changed = new EventEmitter<void>();
  private imageService = inject(ImageService);

  selected = signal<string | null>(null);

  images = signal<ImageModel[] | null>(null);
  uploading = signal(false);

  uploadImages = signal<UploadImage[]>([]);

  ngOnInit() {
    this.imageService.getImagesByCarId(this.carId).subscribe((images: ImageModel[]) => {
      this.images.set(images);
    })
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    this.uploadImages.update(arr => [
      ...arr,
      ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }))
    ]);

    input.value = '';
  }

  upload() {
    if (!this.uploadImages().length) return;
    console.log(this.carId);
    this.uploading.set(true);

    this.imageService
      .upload(this.carId, this.uploadImages())
      .subscribe({
        next: images => {
          this.images.set(images);
          this.uploadImages.set([]);
          this.uploading.set(false);
          this.changed.emit();
        },
        error: () => this.uploading.set(false),
      });
  }

  open(img: string) {
    this.selected.set(img);
  }

  close() {
    this.selected.set(null);
  }

  deleteImageByImageId(id: number) {
    console.log(id);
    this.imageService.deleteImagesByCarId(id).subscribe();
    this.changed.emit();
  }

}
