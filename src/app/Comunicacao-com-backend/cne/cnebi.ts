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
  dadosQR: any = {};
  statusMsg: string = "";

  private loopAtivo = false;

  constructor(private serviceEnviar: ServiceEnviar, private rota: Router) {}

  async ngAfterViewInit() {
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    if (this.step === 'front') {
      this.frontImage = canvas.toDataURL('image/png');
      this.serviceEnviar.DadosEnviados(this.frontImage);
      this.step = 'back';
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      this.backImage = canvas.toDataURL('image/png');

      const linhas = code.data.split(/\r?\n/);
      this.dadosQR = {
        nome: linhas[0] || "",
        sobrenome: linhas[1] || "",
        numeroBI: linhas.find(l => /^[A-Z0-9]{14}$/.test(l)) || "",
        localNascimento: linhas[3] || "",
        dataNascimento: linhas[4] || "",
        sexo: linhas[5] || "",
        estadoCivil: linhas[6] || "",
        dataEmissao: linhas[7] || "",
        dataValidade: linhas[8] || "",
        localEmissao: linhas[9] || "",
        versao: linhas[10] || ""
      };

      // 🔹 Validações
      if (!this.dadosQR.numeroBI) {
        this.statusMsg = "❌ Número BI inválido";
      } else if (!this.dadosQR.nome || !this.dadosQR.dataNascimento || !this.dadosQR.dataValidade) {
        this.statusMsg = "⚠️ Dados incompletos no QR";
      } else if (!this.verificarDocumento(imageData, canvas.width, canvas.height)) {
        this.statusMsg = "⚠️ Documento suspeito (fotocópia ou formato errado)";
      } else {
        this.statusMsg = "✅ BI válido e reconhecido";
      }

      this.serviceEnviar.DadosEnviados(this.dadosQR);
      this.loopAtivo = false;
      this.stopCamera();
    } else {
      this.statusMsg = "A tentar ler QR...";
      setTimeout(() => this.tentarLerQR(), 1000);
    }
  }

  // 🔹 Função completa de verificação
  private verificarDocumento(imageData: ImageData, width: number, height: number): boolean {
    // 1. Contraste
    let min = 255, max = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const brilho = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
      if (brilho < min) min = brilho;
      if (brilho > max) max = brilho;
    }
    const contraste = max - min;
    const contrasteOk = contraste > 40;

    // 2. Proporção
    const proporcao = width / height;
    const proporcaoOk = proporcao > 1.5 && proporcao < 1.7;

    // 3. Bordas simples
    let bordas = 0;
    for (let i = 0; i < imageData.data.length - 4; i += 4) {
      const brilho1 = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
      const brilho2 = (imageData.data[i+4] + imageData.data[i+5] + imageData.data[i+6]) / 3;
      if (Math.abs(brilho1 - brilho2) > 50) bordas++;
    }
    const bordasOk = bordas > (width * height * 0.01);

    return contrasteOk && proporcaoOk && bordasOk;
  }

  stopCamera() {
    this.stream?.getTracks().forEach(track => track.stop());
  }

  ngOnDestroy() {
    this.loopAtivo = false;
    this.stopCamera();
  }

  confirmarEnvio() {
    this.serviceEnviar.DadosEnviados(this.dadosQR);
    this.rota.navigate(['/reconhecimento']);
  }
}
