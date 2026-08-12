import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <form class="card auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Créer un compte</h2>
        <p class="subtitle">Rejoignez FitConnect AI en quelques secondes</p>

        <div class="row">
          <div>
            <label>Prénom</label>
            <input formControlName="firstName" placeholder="Yassine">
          </div>
          <div>
            <label>Nom</label>
            <input formControlName="lastName" placeholder="Trabelsi">
          </div>
        </div>

        <label>Email</label>
        <input type="email" formControlName="email" placeholder="vous@exemple.com">

        <label>Téléphone</label>
        <input formControlName="phone" placeholder="+216 ...">

        <label>Mot de passe</label>
        <input type="password" formControlName="password" placeholder="6 caractères minimum">

        <label>Je suis...</label>
        <select formControlName="role">
          <option value="CLIENT">Client</option>
          <option value="COACH">Coach sportif</option>
          <option value="NUTRITIONNISTE">Nutritionniste</option>
        </select>

        @if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>
        }

        <button class="btn btn-primary full" type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Création...' : "S'inscrire" }}
        </button>

        <p class="switch">Déjà inscrit ? <a routerLink="/auth/login">Connectez-vous</a></p>
      </form>
    </div>
  `,
  styles: [`
    .auth-wrapper { display: flex; justify-content: center; padding: 60px 16px; }
    .auth-card { width: 100%; max-width: 440px; }
    h2 { margin: 0 0 4px; }
    .subtitle { color: #777; font-size: 14px; margin-bottom: 20px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .full { width: 100%; margin-top: 8px; }
    .error { color: var(--danger); font-size: 13px; margin: -8px 0 12px; }
    .switch { text-align: center; font-size: 13px; margin-top: 16px; color: #555; }
    .switch a { color: var(--primary); font-weight: 600; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['CLIENT', Validators.required]
  });

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/coaches']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || "Une erreur est survenue lors de l'inscription";
      }
    });
  }
}
