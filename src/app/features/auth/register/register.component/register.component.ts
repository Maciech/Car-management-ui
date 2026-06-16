import {Component, inject, signal} from '@angular/core';
import {ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {createRegisterForm} from '../register-form.factory';
import {RegisterStep} from '../register-step.enum';
import {FormGroup} from '@angular/forms';
import {AuthService} from '../../auth-service';
import {RegisterDto} from './register.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private fb           = inject(FormBuilder);
  private authService  = inject(AuthService);
  private router       = inject(Router);
  private route        = inject(ActivatedRoute);

  RegisterStep = RegisterStep;
  currentStep  = signal<RegisterStep>(RegisterStep.Credentials);
  registerForm = createRegisterForm(this.fb);
  error        = '';

  get credentialsGroup(): FormGroup {
    return this.registerForm.get('credentials') as FormGroup;
  }
  get optionalGroup(): FormGroup {
    return this.registerForm.get('optionalInfo') as FormGroup;
  }
  get emailControl()           { return this.credentialsGroup.get('email'); }
  get passwordControl()        { return this.credentialsGroup.get('password'); }
  get confirmPasswordControl() { return this.credentialsGroup.get('confirmPassword'); }

  // ── Navigation ────────────────────────────────────────────────────────────

  next() {
    if (!this.isStepValid()) {
      this.markCurrentStepTouched();
      return;
    }
    switch (this.currentStep()) {
      case RegisterStep.Credentials: this.currentStep.set(RegisterStep.Purpose);     break;
      case RegisterStep.Purpose:     this.currentStep.set(RegisterStep.OptionalInfo); break;
      case RegisterStep.OptionalInfo: this.submit(); break;
    }
  }

  back() {
    switch (this.currentStep()) {
      case RegisterStep.Purpose:     this.currentStep.set(RegisterStep.Credentials); break;
      case RegisterStep.OptionalInfo: this.currentStep.set(RegisterStep.Purpose);    break;
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep()) {
      case RegisterStep.Credentials: return this.registerForm.get('credentials')?.valid ?? false;
      case RegisterStep.Purpose:     return this.registerForm.get('role')?.valid ?? false;
      case RegisterStep.OptionalInfo: return true;
    }
  }

  markCurrentStepTouched() {
    switch (this.currentStep()) {
      case RegisterStep.Credentials: this.credentialsGroup.markAllAsTouched();       break;
      case RegisterStep.Purpose:     this.registerForm.get('role')?.markAsTouched(); break;
    }
  }

  stepLabel(): string {
    switch (this.currentStep()) {
      case RegisterStep.Credentials:  return 'Krok 1 z 3 — Dane logowania';
      case RegisterStep.Purpose:      return 'Krok 2 z 3 — Typ konta';
      case RegisterStep.OptionalInfo: return 'Krok 3 z 3 — Dane opcjonalne';
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  submit() {
    if (this.registerForm.invalid) return;
    this.error = '';

    const formValue = this.registerForm.getRawValue();
    const payload: RegisterDto = {
      email:    formValue.credentials.email!,
      password: formValue.credentials.password!,
      role:     formValue.role!,
      phone:    formValue.optionalInfo.phone   || null,
      address:  formValue.optionalInfo.address || null,
    };

    const inviteToken = this.route.snapshot.queryParamMap.get('token');

    this.authService.register(payload).subscribe({
      next: () => {
        const queryParams = inviteToken ? {token: inviteToken} : {};
        this.router.navigate(['/login'], {queryParams});
      },
      error: err => {
        this.error = err?.error?.detail ?? 'Błąd rejestracji. Spróbuj ponownie.';
      },
    });
  }
}
