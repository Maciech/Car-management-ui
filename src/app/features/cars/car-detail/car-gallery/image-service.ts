import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ImageModel} from './image-model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  private readonly API = '/api/cars';
  private readonly HOST_URL = 'http://localhost:8080';
  private http = inject(HttpClient);

  upload(carId: number, images: { file: File }[]) {
    const form = new FormData();

    images.forEach(img => {
      form.append('files', img.file);
    });

    return this.http.post<ImageModel[]>(
      this.HOST_URL + this.API + `/images/${carId}`,
      form
    );
  }

  getImagesByCarId(carId: number) {
    return this.http.get<ImageModel[]>(this.HOST_URL + this.API + `/images/${carId}`);
  }

  deleteImagesByCarId(imageId: number) {
    return this.http.delete(this.HOST_URL + this.API + `/images/${imageId}`);
  }
}
