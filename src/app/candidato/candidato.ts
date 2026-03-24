import { Component } from '@angular/core';
import { PainelCandidato } from "./painel-candidato/painel-candidato";
import { PerfilCandidato } from "./perfil-candidato/perfil-candidato";
import { Menu } from "../dashboard/menu/menu";
import { Header } from "../dashboard/header/header";

@Component({
  selector: 'app-candidato',
  standalone:true,
  imports: [PainelCandidato, PerfilCandidato, Menu, Header],
  templateUrl: './candidato.html',
  styleUrl: './candidato.css',
})
export class Candidato {

}
