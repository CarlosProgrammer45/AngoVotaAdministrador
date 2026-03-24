import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class Service {
private apiWebauthn = 'http//localhost:3456/enviar'
  constructor(private http: HttpClient){}

  async enviarOpcoes(numero_bi_enc: string){
     return await firstValueFrom(this.http.post(`${this.apiWebauthn}/webauthn`, {numero_bi_enc}))
  }

  async envarCredencial(numero_bi_enc: string, crededencial:any){

    return await firstValueFrom(this.http.post(`${this.apiWebauthn}/webauthn/verificar`, {
      numero_bi_enc,
      crededencial
    }))

  }

}
