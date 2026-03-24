import { Component } from '@angular/core';
import { CentroDeRelatorios } from "./centro-de-relatorios/centro-de-relatorios";
import { Header } from "../dashboard/header/header";
import { Menu } from "../dashboard/menu/menu";
import { Texto } from "./texto/texto";
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-relatorio',
  standalone:true,
  imports: [CentroDeRelatorios, Header, Menu, Texto, RouterLink],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css',
})
export class Relatorio {

}
