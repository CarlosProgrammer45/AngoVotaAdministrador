import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { 
  ApexAxisChartSeries, 
  ApexChart, 
  ApexXAxis, 
  ApexTitleSubtitle,
  ApexStroke,
  ApexMarkers
} from 'ng-apexcharts';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';
import { CommonModule } from '@angular/common';

export type ChartOptions = {

  series: ApexAxisChartSeries,
  chart: ApexChart,
  xaxis: ApexXAxis,
  title: ApexTitleSubtitle,
  stroke: ApexStroke,
  markers: ApexMarkers

}; 

@Component({
  standalone: true,
  selector: 'app-fluxo-de-estatisticas',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './fluxo-de-estatisticas.html',
  styleUrl: './fluxo-de-estatisticas.css',
})
export class FluxoDeEstatisticas implements OnInit {

  public ChartOptionsHora: ChartOptions = {
    series: [{ name: "Fluxo de votos por hora", data: [] }],
    chart: { type: "line", height: 350 },
    xaxis: { categories:[] },

    stroke: {
      curve: 'smooth', // Isso cria o efeito zig zag
      width: 3,
      colors: ['#0e48b5'] // Cor da linha
    },
    markers: {
        size: 6,
      colors: ['#1035ef'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 9 }
    },


   
    title: { text: "Votos por hora", align:"center" }
  }

  constructor(private pegarVotosPorHora: ServicesBuscar){}

  /*
  [series]="ChartOptionsHora.series"
  [chart]="ChartOptionsHora.chart"
  [xaxis]="ChartOptionsHora.xaxis"
  [title]="ChartOptionsHora.title"
  */

  ngOnInit(): void {
    this.pegarVotosPorHora.getVotosPorHora().subscribe((data: { hora: string, votos: number }[])=>{

      this.ChartOptionsHora.series[0].data = data.map(p=> p.votos),
      this.ChartOptionsHora.xaxis = { categories: data.map(p=> p.hora + "h") }

    });

     this.pegarVotosPorHora.mostrarGraficoPorHoraDeVoto().subscribe((data: { hora: string, votos: number }[])=>{

      this.ChartOptionsHora.series[0].data = data.map(p=> p.votos),
      this.ChartOptionsHora.xaxis = { categories: data.map(p=> p.hora + "h") }

    })
  }



}
