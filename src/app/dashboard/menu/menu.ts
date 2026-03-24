import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {

  menuFixo  = false;
  hover     = false;
  isMobile  = false;

  constructor() {
    this.checkMobile();
  }

  @HostListener('window:resize')
  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    // Em desktop, sidebar fica sempre visível
    if (!this.isMobile) {
      this.menuFixo = false;
    }
  }

  toggleMenu() {
    this.menuFixo = !this.menuFixo;
  }

  closeMenu() {
    if (this.isMobile) {
      this.menuFixo = false;
    }
  }

  get sidebarOpen(): boolean {
    if (this.isMobile) return this.menuFixo;
    return true; // desktop: sempre aberta
  }
}