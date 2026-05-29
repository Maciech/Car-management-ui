import { FormBuilder, Validators } from '@angular/forms';
import {passwordMatchValidator} from './password-match.validator';

export function createRegisterForm(fb: FormBuilder) {
  return fb.group({
    credentials: fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator }),

    role: ['', Validators.required],

    optionalInfo: fb.group({
      phone: [''],
      address: ['']
    })
  });
}
