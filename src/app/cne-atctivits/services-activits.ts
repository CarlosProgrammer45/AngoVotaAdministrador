import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesActivits {

  private api = environment.apiUrl;

  constructor(private http: HttpClient  ){}


  criarNovoBilhete(NovoBilhete: any):Observable<any>{
    return this.http.post(`${this.api}/cne/criarBilhete`, NovoBilhete)
  }
  
}
