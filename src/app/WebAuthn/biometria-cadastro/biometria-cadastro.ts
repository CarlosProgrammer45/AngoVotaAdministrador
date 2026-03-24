import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadastroService } from '../Service-biometria-cadastro/cadastro-service';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biometria-cadastro',
  imports: [CommonModule, FormsModule],
  templateUrl: './biometria-cadastro.html',
  styleUrl: './biometria-cadastro.css'
})
export class BiometriaCadastro {
  numero_bi_enc: string = "";
  mensagem: string = "";
  carregando: boolean = false;

  constructor(
    private biometriaService: CadastroService, 
    private buscar: ServicesBuscar, 
    private rota: Router
  ) {}

  private bufferFromBase64URL(base64urlString: string): Uint8Array {
    const padding = '='.repeat((4 - (base64urlString.length % 4)) % 4);
    const base64 = (base64urlString + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const buffer = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      buffer[i] = rawData.charCodeAt(i);
    }
    return buffer;
  }

  async enviar() {
    try {
      this.mensagem = "A iniciar a biometria...";
      this.carregando = true;
      
      const optins: any = await this.biometriaService.obterOptions(this.numero_bi_enc);

      optins.challenge = this.bufferFromBase64URL(optins.challenge);
      optins.user.id = this.bufferFromBase64URL(optins.user.id);

      const credencial: any = await navigator.credentials.create({
        publicKey: optins
      });

      await this.biometriaService.enviarCredencial(credencial);

      this.mensagem = "✅ Biometria realizada com sucesso!";
      
      // Pequeno delay para mostrar a mensagem de sucesso antes do navigate
      setTimeout(() => {
        this.rota.navigate(['/dashboard']);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      this.mensagem = err.error.error || 'Erro no cadastro Biométrico';

      // Tratamento de erros específicos
      if (err.message?.includes('cancelled') || err.name === 'NotAllowedError') {
        this.mensagem = "❌ Operação cancelada pelo usuário";
      } else if (err.error?.code === "NumeroObrigatorio") {
        this.mensagem = "❌ Número do BI é obrigatório";
      } else {
        this.mensagem = `❌ Falha na Biometria: ${err.error.error || 'Erro desconhecido'}`;
      }
    } finally {
      this.carregando = false;
    }
  }
}