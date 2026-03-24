import { ProvinciaInfluencia } from './../../dashboard/provincia-influencia/provincia-influencia';
// angola-data.component.ts
import { Component, ChangeDetectorRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-angola-globo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './angola-globo.html',
  styleUrls: ['./angola-globo.css']
}) 
export class AngolaGlobo {

  @Input() selectedRegion: any = null;
  @Input() provinces: any[] = [];
  @Input() municipalities: any[] = [];
  @Input() currentZoomLevel: 'world' | 'country' | 'province' | 'municipality' = 'world';
  
  @Output() regionSelected = new EventEmitter<any>();
  @Output() zoomOutRequested = new EventEmitter<void>();
   
  
  //area do globo
  showProvinceList = false;
  showMunicipalityList = false;

  selectProvince(province: any): void {
    this.regionSelected.emit({ ...province, type: 'province' });
    this.showProvinceList = false;
    this.showMunicipalityList = true;
  }

  selectMunicipality(municipality: any): void {
    this.regionSelected.emit({ ...municipality, type: 'municipality' });
  }

  zoomOut(): void {
    this.zoomOutRequested.emit();
    this.showMunicipalityList = false;
  }

  getFilteredMunicipalities(): any[] {
    if (this.selectedRegion?.type === 'province') {
      return this.municipalities.filter(m => m.provinceId === this.selectedRegion.id);
    }
    return [];
  }
}