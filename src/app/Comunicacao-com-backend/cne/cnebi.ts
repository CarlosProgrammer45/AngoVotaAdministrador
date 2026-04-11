import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ServiceEnviar } from '../service-enviar';
import { Router } from '@angular/router';
import { ServicesBuscar } from '../services-buscar';

type Step = 'front' | 'back';
type Status = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-cnebi',
  imports: [CommonModule],
  templateUrl: './cnebi.html',
  styleUrl: './cnebi.css',
})
export class Cnebi implements AfterViewInit, OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  stream!: MediaStream;
  step: Step = 'front';
  frontImage: string | null = null;
  backImage: string | null = null;

  // Estado de cada fase
  frontStatus: Status = 'idle';
  backStatus: Status = 'idle';
  frontMensagem: string = '';
  backMensagem: string = '';

  // Controlo — só avança se frente aprovada
  frenteAprovada: boolean = false;

  constructor(
    private serviceEnviar: ServiceEnviar,
    private rota: Router,
    private serviceBuscar: ServicesBuscar
  ) {}

  async ngAfterViewInit() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }
    });
    this.video.nativeElement.srcObject = this.stream;
  }

  capture() {
    // Não deixa capturar verso se frente não foi aprovada
    if (this.step === 'back' && !this.frenteAprovada) {
      this.backMensagem = 'Tens de completar a frente com sucesso antes de continuar.';
      this.backStatus = 'error';
      return;
    }

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    if (this.step === 'front') {
      this.frontImage = canvas.toDataURL('image/jpeg');
      this.frontStatus = 'loading';
      this.frontMensagem = 'A verificar documento...';

      canvas.toBlob(blob => {
        const ficheiro = new File([blob!], 'bi-frente.jpg', { type: 'image/jpeg' });

        this.serviceBuscar.EnviarFile(ficheiro, 'frente').subscribe({
          next: (res: any) => {
            if (!res.e_bi_Angolano || !res.e_original) {
              this.frontStatus = 'error';
              this.frontMensagem = res.motivo || 'Documento inválido. Tente novamente.';
              this.frontImage = null;
              this.frenteAprovada = false;
              return;
            }
            // Frente aprovada — avança
            this.frontStatus = 'success';
            this.frontMensagem = 'Frente verificada com sucesso!';
            this.frenteAprovada = true;
            this.step = 'back';
          },
          error: (err: any) => {
            this.frontStatus = 'error';
            this.frontMensagem = err?.error?.erro || 'Erro ao verificar. Tente novamente.';
            this.frontImage = null;
            this.frenteAprovada = false;
          }
        });
      }, 'image/jpeg');

    } else {
      this.backImage = canvas.toDataURL('image/jpeg');
      this.backStatus = 'loading';
      this.backMensagem = 'A verificar verso...';

      canvas.toBlob(blob => {
        const ficheiro = new File([blob!], 'bi-verso.jpg', { type: 'image/jpeg' });

        this.serviceBuscar.EnviarFile(ficheiro, 'verso').subscribe({
          next: (res: any) => {
            if (!res.e_bi_Angolano || !res.e_original) {
              this.backStatus = 'error';
              this.backMensagem = res.motivo || 'Verso inválido. Tente novamente.';
              this.backImage = null;
              return;
            }
            // Tudo aprovado
            this.backStatus = 'success';
            this.backMensagem = 'Verso verificado com sucesso!';

            if (this.frontImage) {
              this.serviceEnviar.DadosEnviados(this.frontImage);
            }

            setTimeout(() => {
              this.stopCamera();
              this.rota.navigate(['/reconhecimento']);
            }, 1500);
          },
          error: (err: any) => {
            this.backStatus = 'error';
            this.backMensagem = err?.error?.erro || 'Erro ao verificar verso. Tente novamente.';
            this.backImage = null;
          }
        });
      }, 'image/jpeg');
    }
  }

  recapturar(fase: 'front' | 'back') {
    if (fase === 'front') {
      this.frontImage = null;
      this.frontStatus = 'idle';
      this.frontMensagem = '';
      this.frenteAprovada = false;
      this.step = 'front';
      // Limpa o verso também
      this.backImage = null;
      this.backStatus = 'idle';
      this.backMensagem = '';
    } else {
      this.backImage = null;
      this.backStatus = 'idle';
      this.backMensagem = '';
      this.step = 'back';
    }
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
