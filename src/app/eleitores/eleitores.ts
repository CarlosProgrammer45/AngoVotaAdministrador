import { Component } from '@angular/core';
import { PainelEleitor } from "./painel-eleitor/painel-eleitor";
import { Menu } from "../dashboard/menu/menu";
import { Header } from '../dashboard/header/header';



@Component({
  selector: 'app-eleitores',
  standalone:true,
  imports: [PainelEleitor, Menu, Header],
  templateUrl: './eleitores.html',
  styleUrl: './eleitores.css',
  
})
export class Eleitores {

}
