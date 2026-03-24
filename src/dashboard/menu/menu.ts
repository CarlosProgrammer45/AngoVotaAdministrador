import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
    template:`
  <a RouterLink="/eleitores">Eleitores</a>
  <a RouterLink="/candidato">Candidato</a>
  <a RouterLink="/relatorio">Relatorio</a>`
})
export class Menu {
//zona icons

//zona menu
menuFixo = false; // quando for clicado
hover = false; // quando ter o cursor por cima

//botao do menu
toggleMenu() {
  this.menuFixo = !this.menuFixo;
}
}
