import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceEnviar {
  private documentoSource = new BehaviorSubject<string | null>(null);
  documento$ = this.documentoSource.asObservable();

  DadosEnviados(img: string){
    this.documentoSource.next(img);
  }
  
}
