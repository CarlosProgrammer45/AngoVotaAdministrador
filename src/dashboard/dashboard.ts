
import { Component } from '@angular/core';
import { Menu } from "./menu/menu";
import { Contador } from "./contador/contador";
import { Header } from "./header/header";
import { ParticipacaoGlobal } from "./participacao-global/participacao-global";
import { ProvinciaInfluencia } from "./provincia-influencia/provincia-influencia";
import { ResumoPorProvincia } from "./resumo-por-provincia/resumo-por-provincia";
import { RouterLink } from '@angular/router';
import { Localizacao } from './localizacao/localizacao';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [Menu, Localizacao, Contador, Header, ParticipacaoGlobal, ProvinciaInfluencia, ResumoPorProvincia],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',

})
export class Dashboard {

}
