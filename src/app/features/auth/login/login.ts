import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../auth-service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule, NgIf],
  styleUrl: './login.css'
})
export class Login {

  private auth = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  isRegisterMode: boolean = false;

  login() {
    this.auth.login(this.email, this.password).subscribe();
    this.router.navigate(['/dashboard']);
  }

  register() {
    console.log("test");
    this.auth.register(this.email, this.password).subscribe();
    this.router.navigate(['/dashboard']);
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }
}
