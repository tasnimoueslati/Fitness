import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <form class="card auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Connexion</h2>
        <p class="subtitle">Ravi de vous revoir sur FitConnect AI</p>

        <label>Email</label>
        <input type="email" formControlName="email" placeholder="vous@exemple.com">

        <label>Mot de passe</label>
        <input type="password" formControlName="password" placeholder="••••••••">

        @if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>
        }

        <button class="btn btn-primary full" type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <p class="switch">Pas encore de compte ? <a routerLink="/auth/register">Inscrivez-vous</a></p>
      </form>
    </div>
  `,
  styles: [`
    .auth-wrapper { display: flex; justify-content: center; padding: 60px 16px; }
    .auth-card { width: 100%; max-width: 400px; }
    h2 { margin: 0 0 4px; }
    .subtitle { color: #777; font-size: 14px; margin-bottom: 20px; }
    .full { width: 100%; margin-top: 8px; }
    .error { color: var(--danger); font-size: 13px; margin: -8px 0 12px; }
    .switch { text-align: center; font-size: 13px; margin-top: 16px; color: #555; }
    .switch a { color: var(--primary); font-weight: 600; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/coaches']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}
