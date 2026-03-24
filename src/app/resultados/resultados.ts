//import { Candidato } from './../../services/candidato';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ServicesBuscar } from '../Comunicacao-com-backend/services-buscar';
import { Menu } from '../dashboard/menu/menu';

@Component({
  selector: 'app-resultados',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, Menu],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados  implements OnInit  {
[x: string]: any;

contador: boolean = false;



 NumeroDeVotos: any[] = []; 

provinciaSelecionada: string = '';

   provincias: string[] = [
    "Bengo","Benguela","Bié","Cabinda","Cuando","Cuando Cubango","Cuanza Norte",
    "Cuanza Sul","Cunene","Huambo","Huíla","Ícolo e Bengo","Luanda","Lunda Norte",
    "Lunda Sul","Malanje","Moxico","Moxico Leste","Namibe","Uíge","Zaire"
  ];
//area do select  provincial


private http = inject(HttpClient);

filtrarPorProvincia(){
        if(!this.provinciaSelecionada){
        this.candidatos = this.candidatos;  
        }else{
        this.candidatos = this.candidatos.filter(prov=>prov.Candidato === this.provinciaSelecionada)}}

filtrar() {
       const body = {
       provincia: this.provinciaSelecionada

       };


 //buscar o numero de votos de cada candidato
         this.http.post(`${environment.apiUrl}/resultadoVotos/Provincias`, body)
        .subscribe({
        next: (resposta: any) => {
        const resultados = Object.values(resposta.resultados);
          console.log('resposta NumeroDeVotos:', [...resultados]);
          this.NumeroDeVotos = resultados;
          console.log('NumeroDeVotos atualizados:', this.NumeroDeVotos);
          console.log('Quantidade:', this.NumeroDeVotos.length);
          this.cdr.detectChanges();},
        error: (erro) =>{
          console.error('erro:', erro);}});}


         

  // Variáveis que vão receber os dados do backend
  
  nome:                 any[]  = [];
  candidatos:           any[]  = [];
 
  totalCandidatos:      number =  0;
 

 

 constructor(private cdr: ChangeDetectorRef, private buscar: ServicesBuscar) {}

ngOnInit(){


  setTimeout(() => {

  this.contador = true


  
}, 1500);



          this.buscar.mostrarVotosAgrupados()
        .subscribe({
        next: (resposta: any) => {
        const resultados = Object.values(resposta.resultados);
          console.log('resposta NumeroDeVotos:', resultados);
          this.NumeroDeVotos = [...resultados];
          console.log('NumeroDeVotos atualizados:', this.NumeroDeVotos);
          console.log('Quantidade:', this.NumeroDeVotos.length);
          this.cdr.detectChanges();},
        error: (erro) =>{
          console.error('erro:', erro);}});


        this.filtrar();

        
 //area de numero de partido
        this.http.get(`${environment.apiUrl}/candidato/total`)
.subscribe({
next: (resposta: any) => {
        console.log('Resposta da API:', resposta);
        this.totalCandidatos = resposta.total;
        console.log('Total atualizado para:', this.totalCandidatos);
          
          // Força atualização da view
         this.cdr.detectChanges();},
error: (erro) => {
         console.error('Erro:', erro);}});
      



          //  BUSCAR LISTA DE CANDIDATOS 
         this.http.get(`${environment.apiUrl}/candidato`)
.subscribe({
next: (resposta: any) => {
          console.log('Resposta candidatos:', resposta);
          this.candidatos = [...resposta]; // ATRIBUI OS DADOS
          console.log('Candidatos atualizados:', this.candidatos);
          console.log('Quantidade:', this.candidatos.length);
          this.cdr.detectChanges();}, // FORÇA ATUALIZAÇÃO 
          
error: (erro) => {
          console.error('Erro nos candidatos:', erro);}});

    
}

get votosTotais(): number {
  return this.NumeroDeVotos.reduce((acc, candidato) => acc + candidato.total, 0);
}

}
