import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../dashboard/menu/menu';
import { Header } from "../dashboard/header/header";
import { ServicesBuscar } from '../Comunicacao-com-backend/services-buscar';

@Component({
  selector: 'app-especificacao-provincial',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, Header],
  templateUrl: './especificacao-provincial.html',
  styleUrl: './especificacao-provincial.css'
})
export class EspecificacaoProvincial implements OnInit {
  isMobile = window.innerWidth <= 768;

  // Lista fixa das 21 províncias de Angola
  provincias: string[] = [
    "Bengo","Benguela","Bié","Cabinda","Cuando","Cuando Cubango","Cuanza Norte",
    "Cuanza Sul","Cunene","Huambo","Huíla","Ícolo e Bengo","Luanda","Lunda Norte",
    "Lunda Sul","Malanje","Moxico","Moxico Leste","Namibe","Uíge","Zaire"
  ];

  provinciaSelecionada = '';
  campos: any[] = [];

  constructor(private buscar: ServicesBuscar) {}

  ngOnInit(): void {

      this.buscar.mostrarEleitoresEmTemporeal().subscribe((data)=>{
        this.campos = data
      });

      this.onProvinciaChange();
    
  }


  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  // Dispara chamada ao backend com iLike
  onProvinciaChange() {
    
      this.buscar.totaisEleitoresProvincias(this.provinciaSelecionada).subscribe((dados) => {
        console.log('dados recebidos em tempo real:', dados)
        this.campos = dados;

        //console.log('Dados recebidos para a província selecionada:', this.campos);

      })
    
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('pt-AO').format(num);
  }
}
