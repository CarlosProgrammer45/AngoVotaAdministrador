import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Header } from "../../dashboard/header/header";
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';
import { environment } from '../../../environment/environment';






@Component({
  selector: 'app-painel-eleitor',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Header],
  templateUrl: './painel-eleitor.html',
  styleUrl: './painel-eleitor.css'
})
export class PainelEleitor implements OnInit  {


  private http = inject(HttpClient); // injeta HttpClient;

  // Variáveis que vão receber os dados do backend
  textoInput: string = '';
  provinciaSelecionada: string = '';
  eleitoresPorProvincia: any[] = [];

  totalRegistrados: number = 0;
  totalVotou: number = 0;
  participacao: number = 0;
  eleitores: any[] = [];
 

  constructor(private buscar: ServicesBuscar) {
    // Chama API logo ao iniciar o componente
    
  }


  ngOnInit(): void{

     this.buscar.mostrarEleitoresEmTemporeal().subscribe((data)=>{
        console.log('dados recebidos em tempo real:', data)
        this.eleitores = [...data]
        this.eleitoresPorProvincia = [...data]
      })
    //this.carregarDados();
    //this.carregarDados();

    this.filtrar();
  }

  pegarIniciais(nome:string): string{

    if (!nome) return '';

    return nome.split(' ').map(p=> p[0]).join('').substring(0, 2).toUpperCase();
  }

  carregarDados() {
    // Exemplo de endpoint REST que retorna estatísticas
    /*
    this.http.get<any>('http://localhost:3000/api/estatisticas')
      .subscribe(data => {
        //this.totalRegistrados = data.totalRegistrados;
        //this.totalVotou = data.totalVotou;
       // this.participacao = data.participacao;
      });

    // Endpoint que retorna lista de eleitores
    */

    /*
    this.http.get<any[]>('http://localhost:3003/cne/eleitores')
      .subscribe(lista => {
        this.eleitores = lista;
        this.eleitoresPorProvincia = lista
      });

      */
      
  }


  filtrarNoInput() {
    const buscar = this.textoInput.toLowerCase();

 

    this.eleitoresPorProvincia = this.eleitores.filter(result=>
      result.bilhete.nome_completo.toLowerCase().includes(buscar) || 
      result.bilhete.bi.toLowerCase().includes(buscar) ||
      result.provincia.toLowerCase().includes(buscar)
    );

    }

    



  filtrarPorProvincia(){

    if (!this.provinciaSelecionada) {

      this.eleitoresPorProvincia = this.eleitores;
      
    }else{

      this.eleitoresPorProvincia = this.eleitores.filter(prov=>

        prov.provincia === this.provinciaSelecionada
      )
      

    }

    
  }

  filtrar(){

    const body = {

      provincia: this.provinciaSelecionada,
      busca: this.textoInput
    }

    
    this.http.post<any[]>(`${environment.apiUrl}/cne/eleitores`, body)
      .subscribe(lista => {
        this.eleitores = lista;
        this.eleitoresPorProvincia = lista
      });

    

  }
}
