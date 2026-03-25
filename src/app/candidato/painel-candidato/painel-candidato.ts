import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-painel-candidato',
  templateUrl: './painel-candidato.html',
  styleUrls: ['./painel-candidato.css']
})

export class PainelCandidato implements OnInit {

 partido: any[] =[];
 totalCandidatos: number = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

        ngOnInit() {
        this.http.get(`${environment.apiUrl}/candidato/total`)
       .subscribe({
        next: (resposta: any) => {
        console.log('Resposta da API:', resposta);
        this.partido = resposta.total;
        console.log('Total atualizado para:', this.partido);
          
          // Força atualização da view
          this.cdr.detectChanges();
         },
         error: (erro) => {
        console.error('Erro:', erro);
        }
       });

        //area do partido
        this.http.get(`${environment.apiUrl}/candidato/total`)
       .subscribe({
        next: (resposta: any) => {
        console.log('Resposta da API:', resposta);
        this.totalCandidatos = resposta.total;
        console.log('Total atualizado para:', this.totalCandidatos);
          
          // Força atualização da view
          this.cdr.detectChanges();
         },
         error: (erro) => {
        console.error('Erro:', erro);
        }
       });
        }
        }

