import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TrackingService } from '../../core/services/tracking.service';
import { TrackingRecord } from '../../core/models/tracking.model';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Mon suivi sportif</h1>

      <div class="card">
        <h2>Nouvelle mesure</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid grid-3">
            <div>
              <label>Poids (kg)</label>
              <input type="number" formControlName="poidsKg">
            </div>
            <div>
              <label>Taille (cm)</label>
              <input type="number" formControlName="tailleCm">
            </div>
            <div>
              <label>% de graisse</label>
              <input type="number" formControlName="pourcentageGraisse">
            </div>
            <div>
              <label>Tour de taille (cm)</label>
              <input type="number" formControlName="tourTailleCm">
            </div>
            <div>
              <label>Tour de hanches (cm)</label>
              <input type="number" formControlName="tourHanchesCm">
            </div>
            <div>
              <label>Objectif</label>
              <input formControlName="objectif" placeholder="Perte de poids, prise de masse...">
            </div>
          </div>
          <label>Notes</label>
          <textarea formControlName="notes" rows="2"></textarea>
          <button class="btn btn-primary" type="submit" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </form>
      </div>

      <div class="card">
        <h2>Historique</h2>
        @if (history.length === 0) {
          <p>Aucune mesure enregistrée pour le moment.</p>
        } @else {
          <table>
            <thead>
              <tr><th>Date</th><th>Poids</th><th>IMC</th><th>Tour taille</th><th>Objectif</th></tr>
            </thead>
            <tbody>
              @for (r of history; track r.id) {
                <tr>
                  <td>{{ r.date }}</td>
                  <td>{{ r.poidsKg || '-' }} kg</td>
                  <td>{{ r.imc || '-' }}</td>
                  <td>{{ r.tourTailleCm || '-' }}</td>
                  <td>{{ r.objectif || '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    h2 { margin-top: 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
    th { color: #777; font-weight: 600; }
  `]
})
export class TrackingComponent implements OnInit {
  private fb = inject(FormBuilder);

  history: TrackingRecord[] = [];
  saving = false;

  form = this.fb.group({
    poidsKg: [null],
    tailleCm: [null],
    pourcentageGraisse: [null],
    tourTailleCm: [null],
    tourHanchesCm: [null],
    objectif: [''],
    notes: ['']
  });

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.trackingService.myHistory().subscribe((data) => (this.history = data));
  }

  submit(): void {
    this.saving = true;
    this.trackingService.addRecord(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.saving = false;
        this.form.reset();
        this.load();
      },
      error: () => { this.saving = false; }
    });
  }
}
