import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Mon profil</h1>

      <form class="card profile-card" [formGroup]="form" (ngSubmit)="submit()">
        <div class="avatar">{{ initials }}</div>

        <label>Prénom</label>
        <input formControlName="firstName">

        <label>Nom</label>
        <input formControlName="lastName">

        <label>Téléphone</label>
        <input formControlName="phone">

        <p class="email">Email : {{ auth.currentUser()?.email }}</p>
        <p class="role">Rôle : {{ auth.currentUser()?.role }}</p>

        @if (success) { <p class="success">Profil mis à jour avec succès.</p> }

        <button class="btn btn-primary" type="submit" [disabled]="saving">
          {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .profile-card { max-width: 480px; }
    .avatar {
      width: 64px; height: 64px; border-radius: 50%;
      background: var(--primary); color: #fff; display: flex;
      align-items: center; justify-content: center; font-weight: 700; font-size: 20px; margin-bottom: 16px;
    }
    .email, .role { font-size: 13px; color: #777; margin: 2px 0; }
    .success { color: var(--success); font-size: 13px; }
    button { margin-top: 12px; }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);

  saving = false;
  success = false;
  initials = '';

  form = this.fb.group({
    firstName: [''],
    lastName: [''],
    phone: ['']
  });

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.form.patchValue({ firstName: user.firstName, lastName: user.lastName });
      this.initials = user.firstName.charAt(0) + user.lastName.charAt(0);
    }
  }

  submit(): void {
    this.saving = true;
    this.success = false;
    this.http.put(`${environment.apiUrl}/users/me`, this.form.getRawValue()).subscribe({
      next: () => { this.saving = false; this.success = true; },
      error: () => { this.saving = false; }
    });
  }
}
