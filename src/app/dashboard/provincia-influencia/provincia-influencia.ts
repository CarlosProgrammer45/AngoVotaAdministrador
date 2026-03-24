import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexPlotOptions } from 'ng-apexcharts';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';

export type ChartOptions = {

  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;


}


@Component({
  selector: 'app-provincia-influencia',
  imports: [NgApexchartsModule],
  templateUrl: './provincia-influencia.html',
  styleUrl: './provincia-influencia.css',
})
export class ProvinciaInfluencia implements OnInit {

  constructor(private buscar: ServicesBuscar) {}


  public chartOptionsProvincia: ChartOptions = {
    series:[],
    chart: {
      type: "bar",
      height: 300,
     },

     plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 6,
       horizontal: true
      }
    },
      xaxis: {
        categories: []
      },
      title: {
        text: "Províncias de Influência"
      }

  }

  ngOnInit(): void {
    /*
  this.buscar.getParticipacaoPorProvincia().subscribe((data: any) => {
    const resultados = Object.values(data.resultados);

    // lista de todas as províncias que apareceram
    const todasProvincias = [...new Set(
      resultados.flatMap((cand: any) => cand.provincias.map((p: any) => p.nome))
    )];

    this.chartOptionsProvincia.xaxis = { categories: todasProvincias };

    // cada candidato vira uma série
    this.chartOptionsProvincia.series = resultados.map((cand: any) => ({
      name: cand.nome,
      data: todasProvincias.map(prov => {
        const encontrado = cand.provincias.find((p: any) => p.nome === prov);
        return encontrado ? encontrado.votos : 0;
      })
    }));
  });

  */

  this.buscar.getParticipacaoPorProvincia().subscribe((data:any)=>{

    this.chartOptionsProvincia.xaxis = { categories: data.resultados.map((b:any)=> b.nome)};

    this.chartOptionsProvincia.series = [{
      name: "Participação",
      data: data.resultados.map((b:any) => b.votos)
    }]

  });


   this.buscar.mostrarGraficoDeProvincias().subscribe((data:any)=>{

    this.chartOptionsProvincia.xaxis = { categories: data.resultados.map((b:any)=> b.nome)};

    this.chartOptionsProvincia.series = [{
      name: "Participação",
      data: data.resultados.map((b:any) => b.votos)
    }]

  });
}


  

}



