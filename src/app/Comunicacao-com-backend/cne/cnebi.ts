import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ServiceEnviar } from '../service-enviar';
import { Router } from '@angular/router';
import jsQR from 'jsqr';

type Step = 'front' | 'back';

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
  numeroBI: string = "";
  dadosQR: any = {};

  private loopAtivo = false;

  constructor(private serviceEnviar: ServiceEnviar, private rota: Router) {}

  async ngAfterViewInit() {
    // Abrir câmera uma vez
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }
    });
    this.video.nativeElement.srcObject = this.stream;
  }

  async capture() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (this.step === 'front') {
      // Captura frente como imagem
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      this.frontImage = canvas.toDataURL('image/png');
      this.serviceEnviar.DadosEnviados(this.frontImage);

      this.step = 'back';

      // Inicia loop automático para ler QR no verso
      this.loopAtivo = true;
      this.tentarLerQR();
    }
  }

  private async tentarLerQR() {
    if (!this.loopAtivo) return;

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // desenhar frame atual no canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      console.log("Código lido:", code.data);

      this.backImage = canvas.toDataURL('image/png');

      const linhas = code.data.split(/\r?\n/);
      this.dadosQR = {
        nome: linhas[0] || "",
        sobrenome: linhas[1] || "",
        numeroBI: linhas.find(l => /[A-Z0-9]{14}/.test(l)) || "",
        localNascimento: linhas[3] || "",
        dataNascimento: linhas[4] || "",
        sexo: linhas[5] || "",
        estadoCivil: linhas[6] || "",
        dataEmissao: linhas[7] || "",
        dataValidade: linhas[8] || "",
        localEmissao: linhas[9] || "",
        versao: linhas[10] || ""
      };

      this.numeroBI = this.dadosQR.numeroBI;
      console.log("Número BI extraído:", this.numeroBI);
      console.log("Dados completos extraídos:", this.dadosQR);

      this.serviceEnviar.DadosEnviados(this.dadosQR);
      //this.rota.navigate(['/reconhecimento']);

      this.loopAtivo = false;
      this.stopCamera();
    } else {
      console.log("Nenhum código encontrado ainda...");
      setTimeout(() => this.tentarLerQR(), 1000);
    }
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  ngOnDestroy() {
    this.loopAtivo = false;
    this.stopCamera();
  }
}
