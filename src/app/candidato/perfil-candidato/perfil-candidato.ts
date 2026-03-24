import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-candidato',
  imports: [CommonModule, ],
  templateUrl: './perfil-candidato.html',
  styleUrl: './perfil-candidato.css',
})
export class PerfilCandidato  implements OnInit{
 totalCandidatos: number = 0;
  candidatos: any[] = []; // Array para guardar os candidatos


  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 1. BUSCAR TOTAL (igual ao seu)
    this.http.get('http://localhost:3003/candidato/total')
      .subscribe({
        next: (resposta: any) => {
          console.log('Resposta total:', resposta);
          this.totalCandidatos = resposta.total;
          console.log('Total atualizado:', this.totalCandidatos);
          this.cdr.detectChanges();
        },
        error: (erro) => {
          console.error('Erro no total:', erro);
        }
      });

    // 2. BUSCAR LISTA DE CANDIDATOS (MESMO PADRÃO)
    this.http.get('http://localhost:3003/candidato')
      .subscribe({
        next: (resposta: any) => {
          console.log('Resposta candidatos:', resposta);
          this.candidatos = resposta; // ATRIBUI OS DADOS
          console.log('Candidatos atualizados:', this.candidatos);
          console.log('Quantidade:', this.candidatos.length);
          this.cdr.detectChanges(); // FORÇA ATUALIZAÇÃO
        },
        error: (erro) => {
          console.error('Erro nos candidatos:', erro);
        }
      });
  }
}