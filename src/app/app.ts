import { Component, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { Biometria } from './componentes/biometria/biometria';
import { Header } from "./Componentes-da-página-inicial/header/header/header";
import { Reconhecer } from './reconhecimento-facial/reconhecer/reconhecer';
import { Quadro } from "./Componentes-da-p\u00E1gina-inicial/quadro/quadro/quadro";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
 
})
export class App {
  protected readonly title = signal('Angular20');
}
