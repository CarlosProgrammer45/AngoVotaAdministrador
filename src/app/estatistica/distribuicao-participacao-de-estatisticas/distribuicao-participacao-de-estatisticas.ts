import { Component, OnInit } from '@angular/core';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexPlotOptions, 
  ApexResponsive,
  ApexNonAxisChartSeries,

} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
};


export type ChartOptionsGenero = {
  series: ApexNonAxisChartSeries,
  chart: ApexChart,
  labels: string[],
  responsive: ApexResponsive[]
  colors?: string[]
  
}


@Component({
  selector: 'app-distribuicao-participacao-de-estatisticas',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule], // <-- IMPORTAR AQUI
  templateUrl: './distribuicao-participacao-de-estatisticas.html',
  styleUrls: ['./distribuicao-participacao-de-estatisticas.css'],
})
export class DistribuicaoParticipacaoDeEstatisticas implements OnInit { 

  public chartOptionsFaixa: ChartOptions = {
    series: [
      {
        name: "Participação (%)",
        data: []
      }
    ],
    chart: {
      type: "bar",
      height: 400
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 6,
        horizontal:true, 
        
        
        
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%"
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: { text: "Percentual de Participação" },
      max: 100
    },
    title: {
      text: "Participação por Faixa Etária",
      align: "center"
    }
  };

  public ChartGenero: ChartOptionsGenero = {
    series: [],
    chart: { type: "pie", height: 400, width: 400 },
    labels: [],
    colors:["#ef44b8", "#008FFB"],
    responsive: [
      {
        breakpoint: 480,
        options:{
          chart: { width: 200 },
          legend: { position: "bottom" }
        }
      }]
  }





  constructor(private estatisticasService: ServicesBuscar) {}

  ngOnInit(): void {

    

    this.estatisticasService.getParticipacaoFaixaEtaria()
      .subscribe((data: { faixa_etaria: string; total_percentagem: number }[]) => {
        this.chartOptionsFaixa.series[0].data = data.map(d => d.total_percentagem);
        this.chartOptionsFaixa.xaxis = { categories: data.map(d => d.faixa_etaria) };
      });

      this.estatisticasService.getVotosPorGenero()
      .subscribe((dadosGenero: { genero: string, total_percentagem: number }[])=>{

        this.ChartGenero.series = dadosGenero.map(t => t.total_percentagem);
        this.ChartGenero.labels = dadosGenero.map(g=> g.genero);
      });

        this.estatisticasService.mostrarGraficoFaixaEtariaEmTempoReal()
      .subscribe((data: { faixa_etaria: string; total_percentagem: number }[]) => {
        this.chartOptionsFaixa = {
          ...this.chartOptionsFaixa, 
          series:[{name: "Participação (%)", data: data.map(d=> d.total_percentagem)}],
          xaxis: { categories: data.map(d => d.faixa_etaria)}
      }
      
      });


        this.estatisticasService.mostrarGraficoPorGeneroEmTempoReal()
      .subscribe((dadosGenero: { genero: string, total_percentagem: number }[])=>{
        this.ChartGenero = {
        ... this.ChartGenero, 
        series: dadosGenero.map(t => t.total_percentagem),
        labels: dadosGenero.map(g=> g.genero)
        }
      
      });
       
  }
}
