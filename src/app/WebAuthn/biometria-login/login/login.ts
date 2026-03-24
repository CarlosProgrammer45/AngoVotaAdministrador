import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../Service-biometria-login/login-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  mensagem: string = "";
  carregando: boolean = false;

  constructor(private webauthnService: LoginService, private rota: Router) {}

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

  private arrayBufferToBase64URL(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  cancelarAutenticacao() {
    this.carregando = false;
    this.mensagem = "";
  }

  async iniciarLoginBiometria() {
    try {
      this.mensagem = "A iniciar autenticação biométrica...";
      this.carregando = true;

      // 1️⃣ Obter opções do backend
      const options: any = await this.webauthnService.iniciarLogin();
      console.log('DEBUG opções recebidas:', options);

      // 2️⃣ Converter challenge e credenciais de Base64 para ArrayBuffer
      options.challenge = this.bufferFromBase64URL(options.challenge);

      if (options.allowCredentials && options.allowCredentials.length > 0) {
        options.allowCredentials = options.allowCredentials.map((cred: any) => ({
          ...cred,
          id: this.bufferFromBase64URL(cred.id)
        }));
      }

      this.mensagem = "🔐 Aguardando autenticação no dispositivo...";

      // 3️⃣ Solicitar autenticação biométrica ao navegador
      const assertion = (await navigator.credentials.get({
        publicKey: options
      })) as PublicKeyCredential;

      if (!assertion) {
        this.mensagem = "❌ Autenticação cancelada pelo usuário";
        console.error("⚠️ Nenhuma credencial retornada");
        return;
      }

      console.log("🟢 Credencial retornada:", assertion);

      // 4️⃣ Montar objeto de resposta para enviar ao backend
      const credentialResponse = {
        id: this.arrayBufferToBase64URL(assertion.rawId),
        rawId: this.arrayBufferToBase64URL(assertion.rawId),
        response: {
          authenticatorData: this.arrayBufferToBase64URL(
            (assertion.response as AuthenticatorAssertionResponse).authenticatorData
          ),
          clientDataJSON: this.arrayBufferToBase64URL(
            (assertion.response as AuthenticatorAssertionResponse).clientDataJSON
          ),
          signature: this.arrayBufferToBase64URL(
            (assertion.response as AuthenticatorAssertionResponse).signature
          ),
          userHandle: (assertion.response as AuthenticatorAssertionResponse).userHandle
            ? this.arrayBufferToBase64URL(
                (assertion.response as AuthenticatorAssertionResponse).userHandle as ArrayBuffer
              )
            : null
        },
        type: assertion.type
      };

      this.mensagem = "⏳ A verificar credenciais...";

      // 5️⃣ Enviar ao backend para verificação
      const result = await firstValueFrom(
        this.webauthnService.verificarLogin(credentialResponse)
      ) as { success: boolean; message?: string };

      // 6️⃣ Verificar resposta
      if (result && result.success) {
        this.mensagem = "✅ Login biométrico bem-sucedido!";
        
        // Pequeno delay para mostrar a mensagem de sucesso
        setTimeout(() => {
          this.rota.navigate(['/dashboard']);
        }, 1500);
      } else {
        this.mensagem = result.message || "❌ Falha na autenticação biométrica";
      }
    } catch (error: any) {
      console.error('Erro ao tentar login biométrico:', error);
      
      // Tratamento de erros específicos
      if (error.name === 'NotAllowedError' || error.message?.includes('cancelled')) {
        this.mensagem = "❌ Autenticação cancelada pelo usuário";
      } else if (error.name === 'NotFoundError') {
        this.mensagem = "❌ Nenhuma credencial biométrica encontrada";
      } else if (error.name === 'SecurityError') {
        this.mensagem = "❌ Erro de segurança na autenticação";
      } else {
        this.mensagem = `❌ Erro na autenticação biométrica`;
      }
    } finally {
      this.carregando = false;
    }
  }

  paraCadastro() {
    this.rota.navigate(['/HeaderBi']);
  }
}