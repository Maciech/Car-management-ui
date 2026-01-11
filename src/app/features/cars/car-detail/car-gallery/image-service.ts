import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ImageModel} from './image-model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  private readonly API = '/api/cars';
  private readonly HOST_URL = environment.apiUrl;
  private http = inject(HttpClient);

  upload(carId: number, images: { file: File }[]): Observable<ImageModel[]> {
    const form = new FormData();

    images.forEach(img => {
      form.append('files', img.file);
    });

    return this.http.post<ImageModel[]>(
      this.HOST_URL + this.API + `/images/${carId}`,
      form
    );
  }

  getImagesByCarId(carId: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(this.HOST_URL + this.API + `/images/${carId}`);
  }

  deleteImagesByCarId(imageId: number): Observable<void> {
    return this.http.delete<void>(this.HOST_URL + this.API + `/images/${imageId}`);
  }
}
