import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ServiceEnviar } from '../service-enviar';
import { Router } from '@angular/router';
import { ServicesBuscar } from '../services-buscar';

type Step = 'front' | 'back';

interface FileUploadResponse {
  motivo: string;
}

@Component({
  selector: 'app-cnebi',
  imports: [CommonModule],
  templateUrl: './cnebi.html',
  styleUrl: './cnebi.css',
})
export class Cnebi implements AfterViewInit, OnDestroy{
   @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  stream!: MediaStream;

  step: Step = 'front';
  frontImage: string | null = null;
  backImage: string | null = null;

  constructor(private serviceEnviar: ServiceEnviar, private rota: Router, private serviceBuscar: ServicesBuscar){}

  async ngAfterViewInit() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }
    });
    this.video.nativeElement.srcObject = this.stream;
  }

  capture() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const image = canvas.toDataURL('image/png');

    if (this.step === 'front') {
      this.frontImage = image;
      

    canvas.toBlob(blob => {
      const ficheiro = new File([blob!], 'bi-frente.jpg', { type: 'image/jpeg' });
      this.serviceBuscar.EnviarFile(ficheiro, 'frente').subscribe({
        next: (res: any) => {     
          alert('Imagem enviada com sucesso!', res.motivo); 

           console.log('Resposta do backend:', res);

           if (!res.e_bi_Angolano || !res.e_original) {

            alert('O documento não é um BI angolano ou não é original. Por favor, tente novamente com um documento válido. Motivo: ' 
              + res.motivo);
              console.log('Motivo da rejeição:', res.motivo);
              return;
            
           }
        },
        error: (err: any) => {
          console.error('Erro ao enviar imagem:', err);
          alert('Ocorreu um erro ao enviar a imagem. Por favor, tente novamente.');
        }
      });
    }, 'image/jpeg');

      console.log(this.frontImage);
      //this.serviceEnviar.DadosEnviados(this.frontImage);
      this.step = 'back';
    } else {
      this.backImage = image;
      canvas.toBlob(blob =>{
        const ficheiro = new File([blob!], 'bi-verso.jpg', { type: 'image/jpeg' });
        this.serviceBuscar.EnviarFile(ficheiro, 'verso').subscribe({
          next: (res: any) => {
            alert('Imagem enviada com sucesso!', res.motivo);
            console.log('Resposta do backend:', res);

            if (!res.e_bi_Angolano || !res.e_original) {
              alert('O documento não é um BI angolano ou não é original. Por favor, tente novamente com um documento válido. Motivo: ' 
                + res.motivo);
              console.log('Motivo da rejeição:', res.motivo);
              return;
            }

          },
          error: (err: any) => {
            console.error('Erro ao enviar imagem:', err);
            alert('Ocorreu um erro ao enviar a imagem. Por favor, tente novamente.');
          }
        });
      }, 'image/jpeg');

      if (this.frontImage) {
        this.serviceEnviar.DadosEnviados(this.frontImage);
      }

      this.rota.navigate(['/reconhecimento']);
      this.stopCamera();
    }
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
