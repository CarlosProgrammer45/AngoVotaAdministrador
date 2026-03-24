import { Component } from '@angular/core';
import { MenuEstatistica } from "./menu-estatistica/menu-estatistica";
import { DistribuicaoParticipacaoDeEstatisticas } from "./distribuicao-participacao-de-estatisticas/distribuicao-participacao-de-estatisticas";
import { FluxoDeEstatisticas } from "./fluxo-de-estatisticas/fluxo-de-estatisticas";
import { ContadorEstatistica } from "./contador-estatistica/contador-estatistica";
import { HeaderEstatisticas } from "./header-estatisticas/header-estatisticas";
import { Menu } from '../dashboard/menu/menu';

@Component({
  selector: 'app-estatistica',
  imports: [MenuEstatistica, DistribuicaoParticipacaoDeEstatisticas, FluxoDeEstatisticas, ContadorEstatistica, HeaderEstatisticas, Menu],
  templateUrl: './estatistica.html',
  styleUrl: './estatistica.css',
})
export class Estatistica {

}
