import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //private baseUrl = 'http://localhost:3000/enviar'

  constructor(private https: HttpClient) { }
  // Iniciar login biométrico
async iniciarLogin() {
 
  try{
       const iniciar = await firstValueFrom(this.https.post(`${environment.apiUrl}/enviar/webauthn/iniciar-login`, { withCredentials: true }));
       return iniciar;
  }
  catch(err: any){
    
    const message = err.error?.mensagem || err.error.error || 'Erro desconhecido';
    const code = err.error?.code; 

     if(code === "NumeroBiObrigatorioLogin"){

        alert("Número do BI é obrigatório para login.");

      }else if(code === "NenhumaCredencialLogin"){

        alert("Nenhuma credencial encontrada para este número de BI. Registe uma credencial primeiro.");

      }else if(code === "FalhaVerificacao"){

        alert("Falha na verificação da credencial. Tente novamente.");

      }else{
        alert("Erro na comunicação com o servidor. Tente novamente.");
      }

      return null;
     
     
    
  }
}


// Verificar login biométrico
verificarLogin(assertion: any) {
  return this.https.post(`${environment.apiUrl}/enviar/webauthn/verificar-login`, assertion, { withCredentials: true });
}
  
}
