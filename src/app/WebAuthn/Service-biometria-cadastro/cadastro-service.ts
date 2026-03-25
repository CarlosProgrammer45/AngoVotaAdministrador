import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

   private apiAuthentication = environment.apiUrl;
   constructor(private http: HttpClient) { }

   async obterOptions(numero_bi_enc: string){
     try{
      
       const enviar = await firstValueFrom(this.http.post(`${this.apiAuthentication}/enviar/webauthn`, {numero_bi_enc}, { withCredentials: true }))
        return enviar;
     }
     catch(err: any){
 
       const mensagem = err.error?.mensagem || err.error.error || 'Erro desconhecido';
       const code = err.error?.code;
       console.error('Erro ao obter opções de autenticação:', err);
       if (code === "NumeroObrigatorio") {
 
         alert("Número do BI é obrigatório.");
         
       }else if (code === "BilheteJaUsado") {
 
         alert("Número do BI já foi Cadastrado.");
         
       }else if(code === "BilheteNEncontrado"){
 
         alert("Número do BI não encontrado.");
 
       }else if(code === "MenorDeIdade"){
 
         alert(`Usuário menor de idade "${err.error.idade} anos" não pode usar autenticação biométrica/PIN.`);
 
       }else if(code === "VerificacaoBiometrica"){
 
         alert("Erro na verificação do registo biométrico/PIN. Tente novamente.");
         
       }else if(code === "VerificacaoLoginBilhete"){
 
         alert("Erro na verificação no registo com o bilhete de identidade. Tente novamente.");
 
       }else if(code === "BiometriaVerificada"){
 
         alert("Biometria/PIN gravada com sucesso.");
 
       }else if(code === "ErroVerificar"){
 
         alert("Erro interno do resgisto da credencial(Biométria/PIN). Tente novamente.");
 
       
       }else{
         
         alert("Erro na comunicação com o servidor. Tente novamente.");
 
       }
 
       return null;
        
     }
 
 
     
      
   }
 
   
 
   async enviarCredencial(credencial: any){
   
     return await firstValueFrom(this.http.post(`${this.apiAuthentication}/enviar/webauthn/verificar`, {
       credencial}, { withCredentials: true }))
   }
  
}
