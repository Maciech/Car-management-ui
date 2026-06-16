import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AttachmentModel} from './attachment-model';
import {environment} from '../../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AttachmentService {

  private readonly BASE = environment.apiUrl + '/api/cars';
  private http = inject(HttpClient);

  upload(carId: number, files: File[]): Observable<void> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return this.http.post<void>(`${this.BASE}/attachments/${carId}`, form);
  }

  getByCarId(carId: number): Observable<AttachmentModel[]> {
    return this.http.get<AttachmentModel[]>(`${this.BASE}/attachments/${carId}`);
  }

  delete(attachmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/attachments/${attachmentId}`);
  }
}
