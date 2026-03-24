import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-menu-estatistica',
  imports: [RouterLink],
  templateUrl: './menu-estatistica.html',
  styleUrl: './menu-estatistica.css',
  template:`
  <a RouterLink="/eleitores">Eleitores</a>
  <a RouterLink="/candidato">Candidato</a>
  <a RouterLink="/relatorio">Relatorio</a>`
})
export class MenuEstatistica {

  //zona icons

//zona menu
menuFixo = false; // quando for clicado
hover = false; // quando ter o cursor por cima

//botao do menu
toggleMenu() {
  this.menuFixo = !this.menuFixo;
}

}
