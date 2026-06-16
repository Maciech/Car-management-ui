import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Car} from '../car-model';
import {CarService} from '../car-service';
import {ImageService} from '../car-detail/car-gallery/image-service';
import {AttachmentService} from '../car-detail/car-attachments/attachment-service';
import {ToastService} from '../../../shared/ui/toast-service';
import {MailService} from '../../mailing/mail-service';
import {CarStatus} from '../../../shared/ui/enums/car-status.enum';
import {CAR_COLOR_LABELS, CarColor} from '../../../shared/ui/enums/car-color.enum';
import {CAR_GENERATIONS, CarGeneration} from '../../../shared/data/car-generations';

@Component({
  selector: 'app-add-car-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-car-modal.html',
  styleUrl: './add-car-modal.css',
})
export class AddCarModal {
  @Output() close = new EventEmitter<void>();
  @Output() added = new EventEmitter<void>();

  private fb                 = inject(FormBuilder);
  carService                 = inject(CarService);
  private imageService       = inject(ImageService);
  private attachmentService  = inject(AttachmentService);
  private toastService       = inject(ToastService);
  private mailService        = inject(MailService);
  private currentYear  = new Date().getFullYear();

  readonly CarStatus    = CarStatus;
  readonly CarColor     = CarColor;
  readonly colorOptions = Object.values(CarColor).map(v => ({value: v, label: CAR_COLOR_LABELS[v]}));

  generationOptions    = signal<CarGeneration[]>([]);
  submitting           = signal(false);
  yearRange            = signal<{minYear: number; maxYear: number} | null>(null);
  pendingFiles         = signal<File[]>([]);
  pendingAttachments   = signal<File[]>([]);

  form = this.fb.nonNullable.group({
    brand:          ['', Validators.required],
    generation:     [''],
    model:          ['', Validators.required],
    productionYear: [this.currentYear, [Validators.required, Validators.min(1900)]],
    mileage:        [null as number | null, [Validators.required, Validators.min(0)]],
    kWPower:        [null as number | null, [Validators.required, Validators.min(0)]],
    engineCapacity: [null as number | null, [Validators.required, Validators.min(0)]],
    color:          [CarColor.WHITE, Validators.required],
    vinNumber:      ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17), Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/)]],
    isImported:              [false],
    isDamaged:               [false],
    numberOfPreviousOwners:  [0, [Validators.required, Validators.min(0)]],
    description: [''],
    purchasePrice:  [null as number | null, [Validators.required, Validators.min(0)]],
    salePrice:      [null as number | null],
    status:         [CarStatus.GOTOWE, Validators.required],
    usersToInvite:  this.fb.array<string>([]),
  });

  emailControl = this.fb.nonNullable.control('', [Validators.required, Validators.email]);

  // ── Image picker ─────────────────────────────────────────────────────────────

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const newFiles = Array.from(input.files);
    this.pendingFiles.update(existing => [...existing, ...newFiles]);
    input.value = '';
  }

  removeFile(index: number) {
    this.pendingFiles.update(files => files.filter((_, i) => i !== index));
  }

  previewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // ── Attachment picker ─────────────────────────────────────────────────────────

  onAttachmentsSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.pendingAttachments.update(existing => [...existing, ...Array.from(input.files!)]);
    input.value = '';
  }

  removeAttachment(index: number) {
    this.pendingAttachments.update(files => files.filter((_, i) => i !== index));
  }

  attachmentIcon(file: File): string {
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) return '📊';
    if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) return '📝';
    return '📎';
  }

  // ── VIN input ────────────────────────────────────────────────────────────────

  onVinInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
    input.value = cleaned;
    this.form.get('vinNumber')!.setValue(cleaned);
  }

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
    if (!gen) { this.yearRange.set(null); return; }
    this.yearRange.set({minYear: gen.minYear, maxYear: gen.maxYear});
    this.form.patchValue({productionYear: Math.round((gen.minYear + gen.maxYear) / 2)});
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    const car: Car = {
      carId: null, images: [],
      brand: raw.brand, generation: raw.generation || undefined, model: raw.model,
      productionYear: raw.productionYear, mileage: raw.mileage!, kWPower: raw.kWPower!,
      engineCapacity: raw.engineCapacity!, color: raw.color, vinNumber: raw.vinNumber,
      isImported: raw.isImported, isDamaged: raw.isDamaged,
      numberOfPreviousOwners: raw.numberOfPreviousOwners,
      description: raw.description || '',
      purchasePrice: raw.purchasePrice!, salePrice: raw.salePrice ?? undefined,
      isSold: raw.status === CarStatus.SPRZEDANE, status: raw.status,
    };
    this.submitting.set(true);
    const carName = [raw.brand, raw.generation, raw.model].filter(Boolean).join(' ');

    this.carService.create(car).subscribe({
      next: (created) => {
        const emails = raw.usersToInvite.filter((e): e is string => !!e);
        if (emails.length > 0) {
          this.mailService.sendInvite(created.carId, carName, emails).subscribe();
        }

        const files = this.pendingFiles();
        const attachments = this.pendingAttachments();

        const afterImages = () => {
          if (attachments.length > 0) {
            this.attachmentService.upload(created.carId!, attachments).subscribe({
              next: () => this.finishSave(),
              error: () => { this.toastService.show('Auto dodane, błąd uploadu załączników'); this.finishSave(); },
            });
          } else {
            this.finishSave();
          }
        };

        if (files.length > 0) {
          this.imageService.upload(created.carId, files.map(f => ({file: f}))).subscribe({
            next: () => afterImages(),
            error: () => { this.toastService.show('Auto dodane, błąd uploadu zdjęć'); afterImages(); },
          });
        } else {
          afterImages();
        }
      },
      error: () => { this.toastService.show('Błąd zapisu'); this.submitting.set(false); },
    });
  }

  private finishSave() {
    this.toastService.show('Samochód dodany');
    this.submitting.set(false);
    this.added.emit();
    this.close.emit();
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
