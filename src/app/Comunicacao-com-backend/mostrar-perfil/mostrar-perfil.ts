import { Component } from '@angular/core';
import { ServicesBuscar } from '../services-buscar';

@Component({
  selector: 'app-mostrar-perfil',
  imports: [],
  templateUrl: './mostrar-perfil.html',
  styleUrl: './mostrar-perfil.css'
})
export class MostrarPerfil {
  constructor(private mostrarService: ServicesBuscar){}
Mostrar() {

  this.mostrarService.mostrarPerfil().subscribe(date=>{
    console.log('Resposta:', date.redirecionar);
  })

}

}
