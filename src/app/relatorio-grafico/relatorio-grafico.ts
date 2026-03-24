import { Component } from '@angular/core';
import { ContacaoGrafico } from "./contacao-grafico/contacao-grafico";
import { HeaderGrafico } from "./header-grafico/header-grafico";
import { FooterGrafico } from "./footer-grafico/footer-grafico";
import { ParticipacaoGrafico } from "./participacao-grafico/participacao-grafico";

@Component({
  selector: 'app-relatorio-grafico',
  imports: [ContacaoGrafico, HeaderGrafico, FooterGrafico, ParticipacaoGrafico],
  templateUrl: './relatorio-grafico.html',
  styleUrl: './relatorio-grafico.css',
})
export class RelatorioGrafico {

}
