import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  roles = [
    { tag: 'CLIENT', title: 'Espace adhérent', text: 'Réservations, suivi physique, commandes, recommandations IA et historique complet.', link: '/espace' },
    { tag: 'COACH', title: 'Espace coach', text: 'Disponibilités, séances, programmes sportifs, clients suivis et notes de progression.', link: '/espace' },
    { tag: 'NUTRITION', title: 'Espace nutritionniste', text: 'Patients, plans alimentaires, consultations, recommandations produit et assistance IA.', link: '/espace' },
    { tag: 'ADMIN', title: 'Espace admin', text: 'Utilisateurs, stock, commandes, chiffre d’affaires, réservations et pilotage global.', link: '/admin/dashboard' }
  ];

  products = [
    {
      name: 'Whey Performance',
      badge: 'Nutrition',
      price: '89 TND',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Gants Training',
      badge: 'Accessoire',
      price: '42 TND',
      image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Tenue Pro Fit',
      badge: 'Vêtement',
      price: '119 TND',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
    }
  ];
}