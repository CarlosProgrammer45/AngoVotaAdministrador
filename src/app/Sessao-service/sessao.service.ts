import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';



@Injectable({
  providedIn: 'root'
})
export class SessaoService {

 private sessao = environment.apiUrl;

 
  constructor(private httSession: HttpClient) { }
   /* 
   verificarSessao(){
      return this.httSession.get<{autenticado: boolean}>(`${environment.apiUrl}/sessao/validar`, {withCredentials: true})
    }

    */
    SessaoVerificar(){
      return this.httSession.get<{autenticado: boolean}>(`${this.sessao}/sessao/validar`, {withCredentials: true})
    }
}


