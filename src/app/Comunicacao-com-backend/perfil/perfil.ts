import { Component } from '@angular/core';
import { ServicesBuscar } from '../services-buscar';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  constructor(private kycService: ServicesBuscar){}

  kyc: boolean = false;

KYC() {

  this.kyc = true;
  this.kycService.enviarKYC(this.kyc).subscribe(
    (dados) => {
      console.log('Resposta do servidor', dados.message);
    }
  )


}

}
