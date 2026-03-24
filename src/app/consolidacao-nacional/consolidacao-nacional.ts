import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import { AngolaGlobo } from './angola-globo/angola-globo';


@Component({
  selector: 'app-consolidacao-nacional',
  standalone: true, // Componente autônomo (Angular 14+)
  imports: [CommonModule, AngolaGlobo], // Módulos importados
  templateUrl: './consolidacao-nacional.html',
  styleUrls: ['./consolidacao-nacional.css']
})
export class ConsolidacaoNacional implements AfterViewInit, OnDestroy {
  // Referência ao elemento DOM que conterá o globo
  @ViewChild('globeContainer') private globeContainer!: ElementRef;

  // Propriedades do D3 para renderização
  private svg: any;              // Elemento SVG principal
  private globeGroup: any;        // Grupo que contém todos os elementos do globo
  private projection: any;        // Projeção geográfica (ortográfica)
  private pathGenerator: any;     // Gerador de caminhos para desenhar mapas
  private width = 0;              // Largura do contêiner
  private height = 0;             // Altura do contêiner
  private rotationSpeed = 0.9;     // Velocidade de rotação automática
  private animationFrame: number | null = null; // ID do frame de animação
  private isAutoRotating = true;   // Controla se o globo está rotacionando automaticamente
  private isBrowser: boolean;      // Verifica se está no navegador (SSR)

 
  public angolaData = {
    center: [13.2345, -8.8392] as [number, number], // Coordenadas centrais de Angola
    
    // Informações básicas
    area: 1246700,               // Área em km²
    population: 36604681,         // População total
    density: 29.4,                // Densidade demográfica
    
    // Informações de fronteiras
    borders: {
      total: 5198,                // Total de fronteiras em km
      countries: [
        { name: 'Congo-Quinxassa', length: 2511 },
        { name: 'Namíbia', length: 1376 },
        { name: 'Zâmbia', length: 1110 },
        { name: 'Congo-Brazavile', length: 2099 }
      ],
      coastline: 2000             // Extensão da costa em km
    },
    
    // Características físicas
    physicalFeatures: {
      highestPoint: {
        name: 'Morro do Moco',
        coordinates: [15.1833, -12.4667],
        elevation: 2620            // Altitude em metros
      },
      // Principais rios
      mainRivers: [
        { name: 'Rio Cuanza',  length: 1000, source: [18.5, -13.5], mouth: [13.4, -9.3] },
        { name: 'Rio Congo',   length: 4374, source: [26.0, -11.8], mouth: [12.3, -6.0] },
        { name: 'Rio Cunene',  length: 1050, source: [15.5, -12.8], mouth: [12.5, -17.3]},
        { name: 'Rio Cubango', length: 1050, source: [16.5, -12.9], mouth: [22.0, -18.5]},
        { name: 'Rio Zambeze', length: 2574, source: [19.0, -11.5], mouth: [36.0, -18.5]}
      ],
      // Quedas d'água
      waterfalls: [
        { name: 'Quedas do Calandula', river: 'Lucala', height: 105, coordinates: [16.0, -9.1] }
      ]
    },
    
    // Dados das 18 províncias de Angola
    provinces: [
      { 
        id: 'luanda', 
        name: 'Luanda', 
        capital: 'Luanda', 
        coordinates: [13.2345, -8.8392], 
        population: 10421000,
        area: 2418,
        density: 5349.3,
        resources: ['Petróleo', 'Gás Natural'], // Recursos naturais
        cities: ['Luanda', 'Cacuaco', 'Viana', 'Belas', 'Kilamba'] // Principais cidades
      },
      { 
        id: 'huila', 
        name: 'Huíla', 
        capital: 'Lubango', 
        coordinates: [13.4925, -14.9175], 
        population: 3302866,
        area: 79023,
        density: 31.6,
        resources: ['Mármore', 'Gás Natural', 'Granito'],
        cities: ['Lubango', 'Matala']
      },
      { 
        id: 'cabinda', 
        name: 'Cabinda', 
        capital: 'Cabinda', 
        coordinates: [12.1975, -5.5675], 
        population: 903370,
        area: 7270,
        density: 98.5,
        resources: ['Madeira', 'Manganês', 'Petróleo', 'Ouro'],
        cities: ['Cabinda', 'Cacongo', 'Buco-Zau']
      },
      { 
        id: 'benguela', 
        name: 'Benguela', 
        capital: 'Benguela', 
        coordinates: [13.4025, -12.5783], 
        population: 2597638,
        area: 39827,
        density: 56.0,
        resources: ['Ferro', 'Cobre', 'Manganês', 'Mármore'],
        cities: ['Benguela', 'Lobito', 'Cubal', 'Baía Farta']
      },
      { 
        id: 'huambo', 
        name: 'Huambo', 
        capital: 'Huambo', 
        coordinates: [15.7392, -12.7761], 
        population: 2691902,
        area: 35117,
        density: 57.0,
        resources: ['Calcário', 'Florestas', 'Cobre'],
        cities: ['Huambo', 'Caála', 'ATCHIM']
      },
      { 
        id: 'lunda-sul', 
        name: 'Lunda Sul', 
        capital: 'Saurimo', 
        coordinates: [20.3936, -9.6608], 
        population: 1000000,
        area: 77536,
        density: 6.9,
        resources: ['Diamantes', 'Manganês', 'Urânio'],
        cities: ['Saurimo', 'Muconda', 'Dala']
      },
      { 
        id: 'lunda-norte', 
        name: 'Lunda Norte', 
        capital: 'Dundo', 
        coordinates: [20.8264, -7.3803], 
        population: 1700000,
        area: 102783,
        density: 8.4,
        resources: ['Diamantes', 'Urânio', 'Ouro', 'Manganês'],
        cities: ['Dundo', 'Lucapa', 'Cuango']
      },
      { 
        id: 'malanje', 
        name: 'Malanje', 
        capital: 'Malanje', 
        coordinates: [16.3408, -9.5447], 
        population: 1700000,
        area: 97602,
        density: 10.1,
        resources: ['Ouro', 'Ferro', 'Diamantes', 'Cobre', 'Manganês'],
        cities: ['Malanje', 'Massango', 'Kalandula']
      },
      { 
        id: 'bi', 
        name: 'Bié', 
        capital: 'Cuíto', 
        coordinates: [16.9275, -12.3833], 
        population: 2264874,
        area: 70314,
        density: 20.7,
        resources: ['Ferro', 'Manganês', 'Cobre', 'Calcário', 'Florestas'],
        cities: ['Cuíto', 'Camacupa', 'Catabola', 'Chinguar']
      },
      { 
        id: 'moxico', 
        name: 'Moxico', 
        capital: 'Luena', 
        coordinates: [19.9167, -11.7833], 
        population: 600000,
        area: 223023,
        density: 3.3,
        resources: ['Ouro', 'Manganês', 'Ferro', 'Urânio'],
        cities: ['Luena', 'Lumeje', 'Luau']
      },
      { 
        id: 'kuando-kubango', 
        name: 'Cuando Cubango', 
        capital: 'Menongue', 
        coordinates: [17.6908, -14.6583], 
        population: 138770,
        area: 199049,
        density: 2.6,
        resources: ['Urânio', 'Ferro', 'Ouro', 'Cobre'],
        cities: ['Menongue', 'Cuito Cuanavale', 'Mavinga']
      },
      { 
        id: 'namibe', 
        name: 'Namibe', 
        capital: 'Moçâmedes', 
        coordinates: [13.1975, -15.1958], 
        population: 600000,
        area: 58137,
        density: 8.5,
        resources: ['Mármore', 'Gás Natural', 'Ferro', 'Sal'],
        cities: ['Moçâmedes', 'Tômbua', 'Bibala']
      },
      { 
        id: 'cunene', 
        name: 'Cunene', 
        capital: 'Ondjiva', 
        coordinates: [15.7333, -17.0667], 
        population: 1806417,
        area: 78342,
        density: 12.6,
        resources: ['Gás Natural', 'Sal', 'Cobre'],
        cities: ['Ondjiva', 'Curoca', 'Ombadja', 'Cuanhama']
      },
      { 
        id: 'zaire', 
        name: 'Zaire', 
        capital: 'Mbanza Kongo', 
        coordinates: [14.2403, -6.2686], 
        population: 600000,
        area: 40130,
        density: 14.8,
        resources: ['Petróleo', 'Gás Natural', 'Fosfatos'],
        cities: ['Mbanza Kongo', 'Soyo', 'N\'zeto']
      },
      { 
        id: 'uige', 
        name: 'Uíge', 
        capital: 'Uíge', 
        coordinates: [15.0511, -7.6158], 
        population: 2000000,
        area: 58698,
        density: 25.3,
        resources: ['Cobre', 'Manganês', 'Café', 'Madeira'],
        cities: ['Uíge', 'Negage', 'Damba']
      },
      { 
        id: 'kwanza-norte', 
        name: 'Cuanza Norte', 
        capital: 'Ndalatando', 
        coordinates: [14.9114, -9.2981], 
        population: 659097,
        area: 24110,
        density: 18.4,
        resources: ['Café', 'Diamantes', 'Madeira', 'Ouro', 'Cobre'],
        cities: ['Ndalatando', 'Cambambe', 'Cazengo']
      },
      { 
        id: 'kwanza-sul', 
        name: 'Cuanza Sul', 
        capital: 'Sumbe', 
        coordinates: [13.8436, -11.2058], 
        population: 2327981,
        area: 55660,
        density: 33.8,
        resources: ['Café', 'Granito', 'Diamantes', 'Ferro'],
        cities: ['Sumbe', 'Porto Amboim', 'Gabela']
      },
      { 
        id: 'bengo', 
        name: 'Bengo', 
        capital: 'Caxito', 
        coordinates: [13.6642, -8.5797], 
        population: 716335,
        area: 31371,
        density: 11.3,
        resources: ['Petróleo', 'Cobre', 'Manganês'],
        cities: ['Caxito', 'Ambriz', 'Dande']
      }
    ],
    
    // Municípios de Angola (subdivisões das províncias)
    municipalities: [
      { id: 'luanda-m',   name: 'Luanda',   provinceId: 'luanda', coordinates: [13.2345, -8.8392], population: 2500000, type: 'city' },
      { id: 'cacuaco',    name: 'Cacuaco',  provinceId: 'luanda', coordinates: [13.3833, -8.7833], population: 1200000, type: 'municipality' },
      { id: 'viana',      name: 'Viana',    provinceId: 'luanda', coordinates: [13.3667, -8.9000], population: 1800000, type: 'municipality' },
      { id: 'belas',      name: 'Belas',    provinceId: 'luanda', coordinates: [13.2833, -8.9333], population: 1100000, type: 'municipality' },
      { id: 'kilamba',    name: 'Kilamba',  provinceId: 'luanda', coordinates: [13.3167, -8.9167], population: 800000, type: 'city' },
      { id: 'benguela-m', name: 'Benguela', provinceId: 'benguela', coordinates: [13.4025, -12.5783], population: 555000, type: 'city' },
      { id: 'lobito',     name: 'Lobito',   provinceId: 'benguela', coordinates: [13.5456, -12.3642], population: 393000, type: 'city' },
      { id: 'cubal',      name: 'Cubal',    provinceId: 'benguela', coordinates: [14.2333, -13.0333], population: 287000, type: 'municipality' },
      { id: 'huambo-m',   name: 'Huambo',   provinceId: 'huambo', coordinates: [15.7392, -12.7761], population: 665000, type: 'city' },
      { id: 'caala',      name: 'Caála',    provinceId: 'huambo', coordinates: [15.5500, -12.8500], population: 278000, type: 'municipality' },
      { id: 'lubango',    name: 'Lubango',  provinceId: 'huila', coordinates: [13.4925, -14.9175], population: 876000, type: 'city' },
      { id: 'moçamedes',  name: 'Moçâmedes',provinceId: 'namibe', coordinates: [13.1975, -15.1958], population: 292000, type: 'city' },
      { id: 'cabinda-m',  name: 'Cabinda',  provinceId: 'cabinda', coordinates: [12.1975, -5.5675], population: 598000, type: 'city' },
      { id: 'saurimo',    name: 'Saurimo',  provinceId: 'lunda-sul', coordinates: [20.3936, -9.6608], population: 393000, type: 'city' },
      { id: 'dundo',      name: 'Dundo',    provinceId: 'lunda-norte', coordinates: [20.8264, -7.3803], population: 177000, type: 'city' },
      { id: 'malanje-m',  name: 'Malanje',  provinceId: 'malanje', coordinates: [16.3408, -9.5447], population: 455000, type: 'city' },
      { id: 'cuíto',      name: 'Cuíto',    provinceId: 'bi', coordinates: [16.9275, -12.3833], population: 355000, type: 'city' },
      { id: 'luena',      name: 'Luena',    provinceId: 'moxico', coordinates: [19.9167, -11.7833], population: 357000, type: 'city' },
      { id: 'menongue',   name: 'Menongue', provinceId: 'kuando-kubango', coordinates: [17.6908, -14.6583], population: 319000, type: 'city' },
      { id: 'ondjiva',    name: 'Ondjiva',  provinceId: 'cunene', coordinates: [15.7333, -17.0667], population: 187000, type: 'city' },
      { id: 'mbaza-kongo',name: 'Mbanza Kongo', provinceId: 'zaire', coordinates: [14.2403, -6.2686], population: 148000, type: 'city' },
      { id: 'uige-m',     name: 'Uíge',     provinceId: 'uige', coordinates: [15.0511, -7.6158], population: 322000, type: 'city' },
      { id: 'ndalatando', name: 'Ndalatando',provinceId: 'kwanza-norte', coordinates: [14.9114, -9.2981], population: 161000, type: 'city' },
      { id: 'sumbe',      name: 'Sumbe',    provinceId: 'kwanza-sul', coordinates: [13.8436, -11.2058], population: 279000, type: 'city' },
      { id: 'caxito',     name: 'Caxito',   provinceId: 'bengo', coordinates: [13.6642, -8.5797], population: 128000, type: 'city' }
    ]
  };

  // Estado atual da interface
  public selectedRegion: any = null;           // Região atualmente selecionada
  public currentZoomLevel: 'world' | 'country' | 'province' | 'municipality' = 'world'; // Nível de zoom atual

 
   // Construtor do componente
   // @param platformId - Identificador da plataforma (para SSR)
   
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Verifica se está executando no navegador
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  
   // Lifecycle hook - após inicialização da view
   // Inicia a renderização do globo após um pequeno delay
  
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.initializeGlobe(), 100);
    }
  }


  ngOnDestroy(): void { 
    if (this.isBrowser) {
      this.stopAutoRotation();
    }
  }

 
  private initializeGlobe(): void {
    if (!this.isBrowser) return;

    // Obtém dimensões do contêiner
    const element = this.globeContainer.nativeElement;
    const rect = element.getBoundingClientRect();

    // Em alguns casos (especialmente em mobile), o contêiner pode não ter altura
    // definida no momento da renderização, então usamos um fallback.
    this.width = rect.width || element.clientWidth || window.innerWidth;
    this.height = rect.height || element.clientHeight || window.innerHeight * 0.7;

    // Garantir que não seja zero (fallback extra)
    if (this.height === 0) {
      this.height = window.innerHeight * 0.7;
    }

    // Cria o elemento SVG com a cor do fundo
    this.svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('background', 'radial-gradient(circle at 30% 50%, #0a1a3a, #030514)');

    // Grupo principal do globo (centralizado)
    this.globeGroup = this.svg.append('g')
      .attr('class', 'globe-group')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    // Configura projeção ortográfica
    this.projection = d3Geo.geoOrthographic()
      .scale(Math.min(this.width, this.height) * 0.4)
      .translate([0, 0])
      .rotate([-this.angolaData.center[0], -this.angolaData.center[1]])
      .precision(0.1);

    // Gerador de caminhos geoespaciais
    this.pathGenerator = d3Geo.geoPath().projection(this.projection);

    // Desenha os elementos
    this.drawGlobe();
    this.startAutoRotation();

    // Listener para redimensionamento
    window.addEventListener('resize', () => this.onResize());

    // Em alguns dispositivos o elemento pode iniciar com tamanho zero; força redraw após renderização
    setTimeout(() => this.onResize(), 200);
  }

  
  private onResize(): void {
    if (!this.isBrowser) return;
    
    const element = this.globeContainer.nativeElement;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    
    // Atualiza dimensões do SVG
    d3.select(element).select('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    
    // Reposiciona o grupo do globo
    this.globeGroup.attr('transform', `translate(${this.width / 2},${this.height / 2})`);
    
    // Ajusta escala da projeção
    this.projection.scale(Math.min(this.width, this.height) * 0.3);
    this.updateMap();
  }


  private drawGlobe(): void {
    if (!this.isBrowser) return;

    // Desenha a esfera do globo
    this.globeGroup.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'globe-sphere')
      .attr('d', this.pathGenerator)
      .attr('fill', 'url(#globe-gradient)')
      .attr('stroke', '#2f51be')
      .attr('stroke-width', 1.5);

    // Cria gradiente radial para a esfera
    const defs = this.svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', 'globe-gradient')
      .attr('cx', '50%')
      .attr('cy', '60%')
      .attr('r', '80%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1a387ac4');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0a1a3a');

    // Desenha a grade de coordenadas (graticule)
    const graticule = d3Geo.geoGraticule()
      .step([15, 15])();

    this.globeGroup.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', this.pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#654aff')
      .attr('stroke-width', 0.3)
      .attr('opacity', 0.3);

    // Desenha os continentes
    const continents = [
      { name: 'Africa', coordinates: [[-20, -35], [50, -35], [50, 35], [-20, 35], [-20, -35]] },
      { name: 'Europe', coordinates: [[-10, 35], [40, 35], [40, 70], [-10, 70], [-10, 35]] },
      { name: 'Asia', coordinates: [[40, -10], [150, -10], [150, 70], [40, 70], [40, -10]] },
      { name: 'NorthAmerica', coordinates: [[-170, 15], [-60, 15], [-60, 70], [-170, 70], [-170, 15]] },
      { name: 'SouthAmerica', coordinates: [[-80, -55], [-35, -55], [-35, 15], [-80, 15], [-80, -55]] },
      { name: 'Australia', coordinates: [[110, -45], [155, -45], [155, -10], [110, -10], [110, -45]] }
    ];

    // Renderiza cada continente
    continents.forEach(continent => {
      this.globeGroup.append('path')
        .datum({ type: 'Polygon', coordinates: [continent.coordinates] })
        .attr('class', `continent continent-${continent.name}`)
        .attr('d', this.pathGenerator)
        .attr('fill', '#1a4a6a')
        .attr('stroke', '#8ac4ff')
        .attr('stroke-width', 0.8)
        .attr('opacity', 0.7);
    });

    // Elementos específicos de Angola
    this.drawAngola();
    this.drawNetworkConnections();
    this.drawCities();
  }

 
  private drawAngola(): void {
    if (!this.isBrowser) return;

    // Polígono aproximado de Angola (para destaque visual)
    const angolaPolygon = [
      [11.5, -5.0], // Cabinda norte
      [13.5, -4.5], 
      [16.0, -6.0], 
      [17.5, -7.5], 
      [20.0, -10.0], // Leste
      [24.0, -12.0], // Fronteira com Congo
      [24.0, -14.0],
      [23.0, -16.0],
      [21.0, -18.0], // Sul (Namíbia)
      [18.0, -17.5],
      [15.0, -17.5],
      [12.0, -16.5],
      [11.0, -13.5],
      [11.5, -10.0],
      [11.5, -5.0]
    ];

    // Destacar Angola com cor verde
    this.globeGroup.append('path')
      .datum({ type: 'Polygon', coordinates: [angolaPolygon] })
      .attr('class', 'angola-highlight')
      .attr('d', this.pathGenerator)
      .attr('fill', '#11bd42')
      .attr('stroke', '#61fd61')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.6);

    // Desenha os principais rios
    this.angolaData.physicalFeatures.mainRivers.forEach(river => {
      const start = this.projection(river.mouth);
      const end = this.projection(river.source);
      

    });

    // Marca o ponto mais alto (Morro do Moco)
    const moco = this.projection(this.angolaData.physicalFeatures.highestPoint.coordinates);
    if (moco && this.isPointVisible(moco)) {
      this.globeGroup.append('polygon')
        .attr('points', `${moco[0]},${moco[1]-8} ${moco[0]-5},${moco[1]+3} ${moco[0]+5},${moco[1]+3}`)
        .attr('fill', '#8B4513')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8);
    }

    // Marcadores das províncias
    this.angolaData.provinces.forEach((province: any) => {
      const projected = this.projection(province.coordinates);
      if (projected && this.isPointVisible(projected)) {
        const provinceGroup = this.globeGroup.append('g')
          .attr('class', `province-group province-${province.id}`)
          .attr('transform', `translate(${projected[0]},${projected[1]})`);

        // Círculo principal da província (maior para Luanda)
        provinceGroup.append('circle')
          .attr('r', province.id === 'luanda' ? 6 : 4)
          .attr('fill', province.id === 'luanda' ? '#ffd700' : '#ffaa00')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .attr('class', `province-marker province-${province.id}`)
          .attr('data-province', province.id)
          // Eventos de interação
          .on('mouseenter', (event: any) => this.onProvinceHover(province.id, true))
          .on('mouseleave', (event: any) => this.onProvinceHover(province.id, false))
          .on('click', (event: any) => this.onProvinceClick(province));
      }
    });
  }

 //Cria linhas entre pontos importantes e marcadores
  
  private drawNetworkConnections(): void {
    // Pontos de conexão global
    const networkPoints = [
      { name: 'Luanda',   coords: [13.2345, -8.8392] },
      { name: 'NY',       coords: [-74.0060, 40.7128] },
      { name: 'London',   coords: [-0.1278, 51.5074] },
      { name: 'Tokyo',    coords: [139.6503, 35.6762] },
      { name: 'Sydney',   coords: [151.2093, -33.8688] },
      { name: 'SaoPaulo', coords: [-46.6333, -23.5505] },
      { name: 'Moscow',   coords: [37.6173, 55.7558] },
      { name: 'Shanghai', coords: [121.4737, 31.2304] },
      { name: 'Dubai', coords: [55.2708, 25.2048] },
      { name: 'Johannesburg', coords: [28.0473, -26.2041] }
    ];

    // Desenha linhas entre todos os pares de pontos
    for (let i = 0; i < networkPoints.length; i++) {
      for (let j = i + 1; j < networkPoints.length; j++) {
        const p1 = this.projection([networkPoints[i].coords[0], networkPoints[i].coords[1]]);
        const p2 = this.projection([networkPoints[j].coords[0], networkPoints[j].coords[1]]);

        if (p1 && p2 && this.isPointVisible(p1) && this.isPointVisible(p2)) {
          this.globeGroup.append('line')
            .attr('x1', p1[0])
            .attr('y1', p1[1])
            .attr('x2', p2[0])
            .attr('y2', p2[1])
            .attr('stroke', '#4afcff')
            .attr('stroke-width', 0.3)
            .attr('opacity', 0.2)
            .attr('class', 'network-line');
        }
      }
    }

    // Desenha os pontos de rede
    networkPoints.forEach((point, idx) => {
      const projected = this.projection([point.coords[0], point.coords[1]]);
      if (projected && this.isPointVisible(projected)) {
        this.globeGroup.append('circle')
          .attr('cx', projected[0])
          .attr('cy', projected[1])
          .attr('r', 2)
          .attr('fill', '#4afcff')
          .attr('class', `network-point point-${idx}`)
          .attr('opacity', 0.8);
      }
    });
  }


  private drawCities(): void {
    this.angolaData.provinces.forEach((province: any) => {
      const projected = this.projection(province.coordinates);
      if (projected && this.isPointVisible(projected)) {
        const cityGroup = this.globeGroup.append('g')
          .attr('class', `city-group city-${province.id}`)
          .attr('transform', `translate(${projected[0]},${projected[1]})`);

        cityGroup.append('circle')
          .attr('r', province.id === 'luanda' ? 5 : 3)
          .attr('fill', province.id === 'luanda' ? '#ffd700' : '#ff6b4a')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5);

        // Adiciona rótulo da cidade apenas em níveis de zoom mais altos
        if (this.currentZoomLevel !== 'world') {
          cityGroup.append('text')
            .attr('x', 8)
            .attr('y', -5)
            .attr('fill', '#ffffff')
            .attr('font-size', '20px')// tamanho das letras
            .attr('font-weight', 'bold')
            .attr('stroke', '#000000')
            .attr('stroke-width', 0.5)
            .text(province.name);
        }
      }
    });
  }


  private isPointVisible(point: [number, number]): boolean {
    const distanceFromCenter = Math.sqrt(point[0] * point[0] + point[1] * point[1]);
    const radius = this.projection.scale();
    return distanceFromCenter <= radius;
  }


  private onProvinceHover(provinceId: string, isHover: boolean): void {
    if (!this.isBrowser) return;
    d3.selectAll(`.province-${provinceId}`)
      .attr('r', isHover ? 8 : 4)
      .attr('stroke-width', isHover ? 3 : 2);
  }

 
  private onProvinceClick(province: any): void {
    this.selectedRegion = province;
    this.currentZoomLevel = 'province';
    this.zoomToLocation(province.coordinates, 3);
  }

 
  public zoomToLocation(coordinates: [number, number], zoomFactor: number = 2): void {
    if (!this.isBrowser) return;
    
    // Para rotação automática durante zoom
    this.stopAutoRotation();
    
    const [lng, lat] = coordinates;
    const currentRotate = this.projection.rotate();
    const targetRotate = [-lng, -lat];
    
    // Animação de rotação suave
    let step = 0;
    const steps = 50;
    
    const animate = () => {
      if (step <= steps) {
        const progress = step / steps;
        const newRotate = [
          currentRotate[0] + (targetRotate[0] - currentRotate[0]) * progress,
          currentRotate[1] + (targetRotate[1] - currentRotate[1]) * progress
        ];
        this.projection.rotate(newRotate);
        this.updateMap();
        step++;
        
        if (this.isBrowser) {
          requestAnimationFrame(animate);
        }
      } else {
        // Após rotação, aplica zoom
        this.projection.scale(this.projection.scale() * zoomFactor);
        this.updateMap();
      }
    };
    
    if (this.isBrowser) {
      animate();
    }
  }


  public zoomOut(): void {
    if (!this.isBrowser) return;
    
    this.resumeAutoRotation();
    this.projection.scale(Math.min(this.width, this.height) * 0.4);
    this.projection.rotate([-this.angolaData.center[0], -this.angolaData.center[1]]);
    this.currentZoomLevel = 'world';
    this.selectedRegion = null;
    this.updateMap();
  }


  public showMunicipalities(provinceId: string): void {
    if (!this.isBrowser) return;
    
    this.currentZoomLevel = 'municipality';
    const municipalities = this.angolaData.municipalities.filter((m: any) => m.provinceId === provinceId);
    
    // Adiciona marcadores para cada município
    municipalities.forEach((m: any) => {
      const projected = this.projection(m.coordinates);
      if (projected && this.isPointVisible(projected)) {
        this.globeGroup.append('circle')
          .attr('cx', projected[0])
          .attr('cy', projected[1])
          .attr('r', 4)
          .attr('fill', '#00ffaa')
          .attr('stroke', '#ffffff')
          .attr('class', `municipality-marker municipality-${m.id}`)
          .attr('opacity', 0.8);
      }
    });
  }


  private updateMap(): void {
    if (!this.isBrowser) return;
    
    // Atualiza elementos estáticos
    this.globeGroup.selectAll('.globe-sphere').attr('d', this.pathGenerator);
    this.globeGroup.selectAll('.graticule').attr('d', this.pathGenerator);
    this.globeGroup.selectAll('.continent').attr('d', this.pathGenerator);
    this.globeGroup.selectAll('.angola-highlight').attr('d', this.pathGenerator);
    
    // Remove e redesenha elementos dinâmicos
    this.globeGroup.selectAll('.network-line').remove();
    this.globeGroup.selectAll('.network-point').remove();
    this.globeGroup.selectAll('.city-group').remove();
    this.globeGroup.selectAll('.province-marker').remove();
    this.globeGroup.selectAll('.municipality-marker').remove();
    
    this.drawNetworkConnections();
    this.drawCities();
    
  }


  private startAutoRotation(): void {
    if (!this.isBrowser) return;
    
    const rotate = () => {
      if (this.isAutoRotating && this.projection) {
        const currentRotate = this.projection.rotate();
        this.projection.rotate([currentRotate[0] + this.rotationSpeed, currentRotate[1]]);
        this.updateMap();
        this.animationFrame = requestAnimationFrame(rotate);
      }
    };
    
    this.animationFrame = requestAnimationFrame(rotate);
  }

  
  private stopAutoRotation(): void {
    if (!this.isBrowser) return;
    
    this.isAutoRotating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

 
  private resumeAutoRotation(): void {
    if (!this.isBrowser) return;
    
    if (!this.isAutoRotating) {
      this.isAutoRotating = true;
      this.startAutoRotation();
    }
  }


  public onRegionSelected(region: any): void {
    this.selectedRegion = region;
    if (region.type === 'province') {
      this.zoomToLocation(region.coordinates, 3);
      this.showMunicipalities(region.id);
    }
  }

 
  public onZoomOutRequested(): void {
    this.zoomOut();
  }
}

