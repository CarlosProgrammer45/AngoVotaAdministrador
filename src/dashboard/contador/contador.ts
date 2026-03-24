import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contador',
  imports: [CommonModule, FormsModule],
  templateUrl: './contador.html',
  styleUrl: './contador.css',
})
export class Contador {
  //zona icons

 voters = '14.5M';
  votersGrowth = '+2.4%';

  urns = '25,400';
  urnsOnline = '98% Online';

  complaints = '12';
  complaintsStatus = 'Pendentes';

  timeRemaining = '04:15:00';
}
