import { ChangeDetectorRef, Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ServicesBuscar } from '../Comunicacao-com-backend/services-buscar';
import { Menu } from '../dashboard/menu/menu';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-resultados',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, Menu],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit, AfterViewInit {

  @ViewChild('chartCandidatos') chartCandidatosElement!: ElementRef;

  contador: boolean = false;
  NumeroDeVotos: any[] = [];
  provinciaSelecionada: string = '';
  candidatos: any[] = [];
  totalCandidatos: number = 0;

  private chartCandidatos: ApexCharts | null = null;
  private coresCache: { [key: string]: string } = {};

  provincias: string[] = [
    "Bengo", "Benguela", "Bié", "Cabinda", "Cuando", "Cuando Cubango", 
    "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla", 
    "Ícolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", 
    "Moxico", "Moxico Leste", "Namibe", "Uíge", "Zaire"
  ];

  private http = inject(HttpClient);

  constructor(private cdr: ChangeDetectorRef, private buscar: ServicesBuscar) {}

  ngOnInit() {
    setTimeout(() => {
      this.contador = true;
    }, 1500);

    this.carregarDados();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.criarGraficoCandidatos();
    }, 1000);
  }

  carregarDados() {
    this.buscar.mostrarVotosAgrupados().subscribe({
      next: (resposta: any) => {
        const resultados = Object.values(resposta.resultados);
        this.NumeroDeVotos = [...resultados];
        this.cdr.detectChanges();
        this.criarGraficoCandidatos();
      },
      error: (erro) => {
        console.error('Erro ao carregar votos:', erro);
      }
    });

    this.http.get(`${environment.apiUrl}/candidato/total`).subscribe({
      next: (resposta: any) => {
        this.totalCandidatos = resposta.total;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar total:', erro);
      }
    });

    this.http.get(`${environment.apiUrl}/candidato`).subscribe({
      next: (resposta: any) => {
        this.candidatos = [...resposta];
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar candidatos:', erro);
      }
    });

    this.filtrar();
  }

  filtrar() {
    const body = { provincia: this.provinciaSelecionada };

    this.http.post(`${environment.apiUrl}/resultadoVotos/Provincias`, body).subscribe({
      next: (resposta: any) => {
        const resultados = Object.values(resposta.resultados);
        this.NumeroDeVotos = resultados;
        this.cdr.detectChanges();
        this.criarGraficoCandidatos();
      },
      error: (erro) => {
        console.error('Erro ao filtrar:', erro);
      }
    });
  }

  get votosTotais(): number {
    if (!this.NumeroDeVotos || this.NumeroDeVotos.length === 0) return 0;
    return this.NumeroDeVotos.reduce((acc, candidato) => acc + (candidato.total || 0), 0);
  }

  get topCandidatos(): any[] {
    if (!this.NumeroDeVotos || this.NumeroDeVotos.length === 0) return [];
    return [...this.NumeroDeVotos]
      .sort((a, b) => (b.total || 0) - (a.total || 0));
  }

  getCorPartido(partido: string): string {
    if (!partido) return '#3b82f6';
    
    if (this.coresCache[partido]) {
      return this.coresCache[partido];
    }
    
    let hash = 0;
    for (let i = 0; i < partido.length; i++) {
      hash = ((hash << 5) - hash) + partido.charCodeAt(i);
      hash |= 0;
    }
    
    const palheta = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
      '#14b8a6', '#d946ef', '#f43f5e', '#0ea5e9', '#eab308'
    ];
    
    const cor = palheta[Math.abs(hash) % palheta.length];
    this.coresCache[partido] = cor;
    
    return cor;
  }

  criarGraficoCandidatos() {
    if (!this.NumeroDeVotos || this.NumeroDeVotos.length === 0) return;
    if (!this.chartCandidatosElement) return;

    const dadosOrdenados = [...this.NumeroDeVotos].sort((a, b) => (b.total || 0) - (a.total || 0));
    
    const nomes = dadosOrdenados.map(c => c.nome);
    const votos = dadosOrdenados.map(c => c.total || 0);
    const cores = dadosOrdenados.map(c => this.getCorPartido(c.partido));

    const options = {
      series: [{
        name: 'Votos',
        data: votos
      }],
      chart: {
        type: 'bar',
        height: Math.max(400, dadosOrdenados.length * 35),
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        background: 'transparent',
        foreColor: '#e5e7eb',
        fontFamily: 'Segoe UI, system-ui, sans-serif'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top'
          },
          barHeight: '65%',
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toLocaleString();
        },
        style: {
          colors: ['#f1f5f9'],
          fontSize: '11px',
          fontWeight: 500
        },
        offsetX: 10,
        background: {
          enabled: false
        }
      },
      xaxis: {
        categories: nomes,
        title: {
          text: 'Número de Votos',
          style: {
            color: '#94a3b8',
            fontSize: '12px'
          }
        },
        labels: {
          formatter: (val: number) => val.toLocaleString(),
          style: {
            colors: '#94a3b8',
            fontSize: '11px'
          }
        },
        axisBorder: {
          color: '#1e293b'
        },
        axisTicks: {
          color: '#1e293b'
        }
      },
      yaxis: {
        title: {
          text: 'Candidatos',
          style: {
            color: '#94a3b8',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: '#cbd5e1',
            fontSize: '12px',
            fontWeight: 500
          }
        }
      },
      grid: {
        borderColor: '#1e293b',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number) => `${val.toLocaleString()} votos`,
          title: {
            formatter: (seriesName: string) => 'Total de Votos: '
          }
        },
        style: {
          fontSize: '12px'
        }
      },
      legend: {
        show: false
      },
      colors: cores,
      title: {
        text: 'Distribuição de Votos por Candidato',
        align: 'left',
        style: {
          color: '#f1f5f9',
          fontSize: '14px',
          fontWeight: 600
        }
      }
    };

    if (this.chartCandidatos) {
      this.chartCandidatos.destroy();
    }
    
    this.chartCandidatos = new ApexCharts(this.chartCandidatosElement.nativeElement, options);
    this.chartCandidatos.render();
  }
}