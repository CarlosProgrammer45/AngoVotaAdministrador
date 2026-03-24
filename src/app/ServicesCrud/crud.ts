import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Crud {


  private api = 'http://localhost:3003/usuarios';

  constructor(private http: HttpClient){}

  ListarUsuarios(): Observable<any>{
    return this.http.get(this.api)
  }

  Criar(dados: any): Observable<any>{
    return this.http.post(`${this.api}/criar`, dados)
  }


   editar(id: number, dados: any): Observable<any>{
    return this.http.put(`${this.api}/editar/${id}`, dados)
  }

   eliminar(id: number): Observable<any>{
    return this.http.delete(`${this.api}/eliminar/${id}`)
  }

  pegarID(id: number): Observable<any>{
    return this.http.get(this.api)
  }

}
