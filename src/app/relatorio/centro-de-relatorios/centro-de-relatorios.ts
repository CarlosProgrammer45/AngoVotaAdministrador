import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-centro-de-relatorios',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './centro-de-relatorios.html',
  styleUrl: './centro-de-relatorios.css',
})
export class CentroDeRelatorios {

}
