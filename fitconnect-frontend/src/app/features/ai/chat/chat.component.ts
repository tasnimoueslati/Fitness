import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/services/ai.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Assistant virtuel FitConnect</h1>
      <p class="subtitle">Posez vos questions sur le sport, la nutrition ou la plateforme</p>

      <div class="card chat-box">
        <div class="messages">
          @if (messages.length === 0) {
            <p class="hint">Bonjour ! Comment puis-je vous aider aujourd'hui ?</p>
          }
          @for (m of messages; track $index) {
            <div class="bubble" [class.user]="m.role === 'user'">{{ m.content }}</div>
          }
          @if (loading) {
            <div class="bubble">L'assistant réfléchit...</div>
          }
        </div>

        <div class="input-row">
          <input [(ngModel)]="draft" (keyup.enter)="send()" placeholder="Écrivez votre message...">
          <button class="btn btn-primary" (click)="send()" [disabled]="loading || !draft.trim()">Envoyer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 4px; }
    .subtitle { color: #777; margin-bottom: 20px; }
    .chat-box { display: flex; flex-direction: column; height: 480px; }
    .messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-bottom: 12px; }
    .hint { color: #999; text-align: center; margin-top: 40px; }
    .bubble {
      max-width: 70%; padding: 10px 14px; border-radius: 14px; background: #f0f0f0;
      align-self: flex-start; font-size: 14px; line-height: 1.5; white-space: pre-wrap;
    }
    .bubble.user { align-self: flex-end; background: var(--primary); color: #fff; }
    .input-row { display: flex; gap: 10px; margin-top: 12px; }
    .input-row input { margin: 0; }
  `]
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  draft = '';
  loading = false;

  constructor(private aiService: AiService) {}

  send(): void {
    const text = this.draft.trim();
    if (!text) return;

    this.messages.push({ role: 'user', content: text });
    this.draft = '';
    this.loading = true;

    this.aiService.chat({ message: text }).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res.content });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: "Désolé, une erreur est survenue." });
        this.loading = false;
      }
    });
  }
}
