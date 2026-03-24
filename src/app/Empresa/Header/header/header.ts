import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Scroll } from '@angular/router';



@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  sticknav = false;
  menuOpen = false;

  ngOnInit(): void {

    

 window.addEventListener('scroll', this.scroll)
  
  }

  scroll = () =>{
    this.sticknav = window.scrollY > 50;
 } 

 


toggleMenu() {
  const el = document.querySelector<HTMLElement>('.menu-mobile1');
  el?.classList.toggle('ativo1');
  if (el) el.style.display = 'none';
  document.querySelector('.menu-mobile2')?.classList.toggle('ativo2');
  document.querySelector('.menu-mobile-aparecer')?.classList.toggle('abrir-menu');
  //this.menuOpen = !this.menuOpen;
}



 



}
