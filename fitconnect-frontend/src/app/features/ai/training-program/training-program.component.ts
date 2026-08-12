import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-training-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Générer mon programme sportif (IA)</h1>
      <p class="subtitle">Renseignez vos informations pour obtenir un programme personnalisé</p>

      <div class="grid grid-2">
        <form class="card" [formGroup]="form" (ngSubmit)="generate()">
          <label>Âge</label>
          <input type="number" formControlName="age">

          <label>Poids (kg)</label>
          <input type="number" formControlName="poidsKg">

          <label>Taille (cm)</label>
          <input type="number" formControlName="tailleCm">

          <label>Niveau</label>
          <select formControlName="niveau">
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>

          <label>Objectif</label>
          <select formControlName="objectif">
            <option value="perte de poids">Perte de poids</option>
            <option value="prise de masse">Prise de masse</option>
            <option value="remise en forme">Remise en forme</option>
            <option value="endurance">Endurance</option>
          </select>

          <button class="btn btn-primary full" type="submit" [disabled]="loading">
            {{ loading ? 'Génération...' : 'Générer mon programme' }}
          </button>
        </form>

        <div class="card result">
          <h2>Votre programme</h2>
          @if (loading) {
            <p>L'IA génère votre programme personnalisé...</p>
          } @else if (result) {
            <pre>{{ result }}</pre>
          } @else {
            <p class="hint">Remplissez le formulaire pour générer votre programme d'entraînement.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 4px; }
    .subtitle { color: #777; margin-bottom: 20px; }
    .full { width: 100%; margin-top: 8px; }
    .result { max-height: 560px; overflow-y: auto; }
    .hint { color: #999; }
    pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; line-height: 1.6; }
    @media (max-width: 800px) { .grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class TrainingProgramComponent {
  private fb = inject(FormBuilder);

  loading = false;
  result = '';

  form = this.fb.group({
    age: [25],
    poidsKg: [70],
    tailleCm: [175],
    niveau: ['debutant'],
    objectif: ['remise en forme']
  });

  constructor(private aiService: AiService) {}

  generate(): void {
    this.loading = true;
    this.result = '';
    this.aiService.generateTrainingProgram(this.form.getRawValue() as any).subscribe({
      next: (res) => { this.result = res.content; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
