import { Component } from '@angular/core';
import { Service } from '../../servicos/service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-biometria',
  imports: [FormsModule, CommonModule],
  templateUrl: './biometria.html',
  styleUrl: './biometria.css'
})
export class Biometria {

  numero_bi_enc: string = "";
  mensagem: string = '';
  carregando:boolean = false;

  constructor(private biometriaService: Service){}

  async Entrar(){

    try{
     this.carregando = true
    this.mensagem = 'A iniciar a Biometria'
   const opts: any = await this.biometriaService.enviarOpcoes(this.numero_bi_enc)

   const credencial:any = await navigator.credentials.create({
    publicKey: opts
   });

   await this.biometriaService.envarCredencial(this.numero_bi_enc, credencial)

   this.mensagem = "Biometria realizada com sucesso!"
    }catch(error){
      console.error(error)
      this.mensagem = "Falha na biometria"
      
    }finally{
      this.carregando = false
    }
   

  }

}
