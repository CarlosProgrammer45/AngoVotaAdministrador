import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicesBuscar } from '../services-buscar';

@Component({
  selector: 'app-header-bi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-bi.html',
  styleUrl: './header-bi.css'
})
export class HeaderBi {
  
  // PROPRIEDADES
  numeroBI: string = '';
  carregando: boolean = false;
  erroFormato: boolean = false;
  formatoValido: boolean = false;
  
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  mensagemInfo: string = '';

  constructor(
    private servico: ServicesBuscar,
    private rota: Router
  ) {}

  // VALIDA O FORMATO DO BI
  validarFormato(): void {
    if (!this.numeroBI) {
      this.erroFormato = false;
      this.formatoValido = false;
      return;
    }

    // Converte para maiúsculas
    this.numeroBI = this.numeroBI.toUpperCase();
    
    // Verifica se contém apenas letras e números
    const regex = /^[A-Z0-9]*$/;
    const apenasAlfaNumerico = regex.test(this.numeroBI);
    
    this.erroFormato = !apenasAlfaNumerico;
    this.formatoValido = apenasAlfaNumerico && this.numeroBI.length === 14;
  }

  // VERIFICA SE PODE VERIFICAR O BI
  podeVerificar(): boolean {
    return !this.carregando && 
           this.numeroBI?.length === 14 && 
           !this.erroFormato;
  }

  // MOSTRA MENSAGEM DE AJUDA
  mostrarAjuda(): void {
    this.mensagemInfo = 'Digite os 14 caracteres do seu BI (apenas letras e números)';
    setTimeout(() => this.mensagemInfo = '', 3000);
  }

  // VERIFICA O BI
  verificarBI(): void {
    if (!this.podeVerificar()) return;

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.servico.enviarBI(this.numeroBI).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = 'BI verificado com sucesso!';
        this.carregando = false;
        
        setTimeout(() => {
          this.rota.navigate(['/Cnebi']);
        }, 1500);
      },
      
      error: (erro) => {
        this.mensagemErro = erro.error?.error || 'Erro ao verificar BI';
        this.carregando = false;
        
        setTimeout(() => {
          this.rota.navigate(['/HeaderBi']);
        }, 2000);
      }
    });
  }
}