import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, NgModel } from '@angular/forms';
import { ServicesBuscar } from '../services-buscar';



@Component({
  selector: 'app-bi',
  imports: [CommonModule, FormsModule],
  templateUrl: './bi.html',
  styleUrl: './bi.css'
})
export class BI {
  constructor(private servico: ServicesBuscar) {}
 //area dos inputs

 numeroBI: string = '';
 mensagem: string = '';

// area dos icons



// area idioma 
menuAberto =false;
idiomaSelecionado = 'pt';
idiomas = [
   { codigo: 'ch', nome: 'Chokwe' },
   { codigo: 'en', nome: 'English' },
   { codigo: 'fr', nome: 'Frances' },
   { codigo: 'ki', nome: 'Kikongo' },
   { codigo: 'kim', nome: 'Kimbundo' },
   { codigo: 'kw', nome: 'Kwanyama' },
   { codigo: 'ld', nome: 'Lunda' },
   { codigo: 'ng', nome: 'Nganguela' },
   { codigo: 'pt', nome: 'Português' },
   { codigo: 'um', nome: 'Umbundo'}

 ];
nome: any;
mudarIdioma($event: Event) {
throw new Error('Method not implemented.');
}

// area do botao-input


 verificarBI() {
   this.servico.enviarBI(this.numeroBI).subscribe((dados) => {
     this.mensagem = dados.message;
   })

  }
   


}
