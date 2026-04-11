import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject } from 'rxjs';
import * as faceapi from 'face-api.js';
import { ServiceEnviar } from '../../Comunicacao-com-backend/service-enviar';
import { Router } from '@angular/router';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';

@Component({
  selector: 'app-reconhecer',
  imports: [CommonModule, WebcamModule],
  templateUrl: './reconhecer.html',
  styleUrl: './reconhecer.css'
})
export class Reconhecer implements OnInit {

  liberarVoto() {}

  aparecer: boolean = false;
  intervalLiveness: any = null;
  timeoutLiveness: any = null;
  previousNoseX: number | null = null;
  iconeAtual: string = 'touch_app';
  livenessPassed: boolean = false;
  instrucoesAtual: string = 'Clica no botão para iniciar a prova de vida!';
  livenessStatus: string = 'Registo do que já foi feito';
  triggerLiveness = new Subject<void>();
  cheksrealizados: Set<string> = new Set();
  triggerLivenessObservable = this.triggerLiveness.asObservable();
  aprovado: boolean = false;
  resultado: string = '';
  selfieImage: WebcamImage | null = null;
  fotoBI: string | null = null;
  fotoAcomparar: Float32Array<ArrayBufferLike> | null = null;

  trigger = new Subject<void>();
  triggerObservable = this.trigger.asObservable();

  resultadoOCR: string = '';
  kyc: boolean = false;

  videoOptions: MediaTrackConstraints = {
    facingMode: 'user'
  };

  // Opções do detector leve para mobile
  private detectorOpts = new faceapi.TinyFaceDetectorOptions({ inputSize: 160 });

  constructor(
    private dadosService: ServiceEnviar,
    private rota: Router,
    private buscar: ServicesBuscar
  ) {
    this.dadosService.documento$.subscribe(img => {
      console.log(img);
      this.fotoBI = img as string | null;
    });
  }

  async ngOnInit() {
    // Deixa o TensorFlow escolher o melhor backend automaticamente
    await faceapi.tf.ready();

    const MODEL_URL = 'https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights';

    // Carrega só os 3 modelos necessários em paralelo — remove o ssdMobilenetv1
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);

    console.log('Modelos carregados!');
  }

  // Reduz imagem para processar mais rápido
  private reduzirImagem(src: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        canvas.getContext('2d')?.drawImage(img, 0, 0, 320, 240);
        const pequena = new Image();
        pequena.onload = () => resolve(pequena);
        pequena.src = canvas.toDataURL('image/jpeg', 0.7);
      };
      img.src = src;
    });
  }

  tirarSelfie() {
    this.trigger.next();
  }

  async minhaSelfie(imagem: WebcamImage) {
    if (!this.fotoBI) {
      alert('Não tem nenhuma foto para comparar');
      return;
    }

    this.selfieImage = imagem;

    // Reduz as duas imagens antes de processar
    const biImg = await this.reduzirImagem(this.fotoBI!);
    const selfieImg = await this.reduzirImagem(this.selfieImage.imageAsDataUrl);

    console.log('Imagens carregadas, a comparar rostos...');

    const descricaoBI = await faceapi
      .detectSingleFace(biImg, this.detectorOpts)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const descricaoSelfie = await faceapi
      .detectSingleFace(selfieImg, this.detectorOpts)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (descricaoBI && descricaoSelfie) {
      const distancia = faceapi.euclideanDistance(
        descricaoBI.descriptor,
        descricaoSelfie.descriptor
      );

      if (distancia < 0.6) {
        this.aprovado = true;
        this.resultado = 'Reconhecimento facial aprovado! Distância: ' + distancia.toFixed(4);
        this.aparecer = true;
        this.fotoAcomparar = descricaoSelfie.descriptor;
      } else {
        this.resultado = 'Reconhecimento facial reprovado! Distância: ' + distancia.toFixed(4);
        this.rota.navigate(['/Cnebi']);
      }
    } else {
      this.resultado = 'Não foi possível detectar rosto em uma das imagens.';
    }
  }

  IniciarLiveness() {
    this.livenessPassed = false;
    this.cheksrealizados.clear();
    this.instrucoesAtual = 'Pisca os olhos (fechar e abrir)';
    this.iconeAtual = 'visibility';
    this.livenessStatus = 'A verificar...';

    if (this.intervalLiveness) clearInterval(this.intervalLiveness);

    // 800ms em vez de 500ms — menos processamento
    this.intervalLiveness = setInterval(() => {
      this.triggerLiveness.next();
    }, 800);

    // Timeout de 2 minutos
    setTimeout(() => {
      if (!this.livenessPassed) {
        clearInterval(this.intervalLiveness);
        this.livenessStatus = 'Tempo esgotado. Tenta novamente.';
      }
    }, 2 * 60 * 1000);
  }

  pararLiveness() {
    if (this.intervalLiveness) {
      clearInterval(this.intervalLiveness);
      this.intervalLiveness = null;
    }
    if (this.timeoutLiveness) {
      clearTimeout(this.timeoutLiveness);
      this.timeoutLiveness = null;
    }
    this.instrucoesAtual = 'Clica no botão para iniciar a prova de vida!';
    this.livenessStatus = 'Liveness parado.';
  }

  async framesCapturada(imagem: WebcamImage) {
    if (this.livenessPassed) return;
    if (!this.fotoAcomparar) return;

    // Reduz a imagem antes de processar
    const imgReduzida = await this.reduzirImagem(imagem.imageAsDataUrl);

    const deteccao = await faceapi
      .detectSingleFace(imgReduzida, this.detectorOpts)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (deteccao && this.fotoAcomparar) {
      const distancia = faceapi.euclideanDistance(
        deteccao.descriptor,
        this.fotoAcomparar
      );

      if (distancia > 0.65) {
        console.log('Rosto não corresponde ao do BI. Distância:', distancia.toFixed(4));
        this.pararLiveness();
        this.livenessStatus = 'Rosto não corresponde ao do BI. Tenta novamente.';
        return;
      }

      const pontos = deteccao.landmarks;

      // Passo 1 — Piscar olhos
      if (!this.cheksrealizados.has('piscar')) {
        const olhoEsquerdo = Math.abs(
          pontos.getLeftEye()[1].y - pontos.getLeftEye()[4].y
        );
        const olhoDireito = Math.abs(
          pontos.getRightEye()[1].y - pontos.getRightEye()[4].y
        );

        console.log('Altura olhos: Esquerdo', olhoEsquerdo, 'Direito', olhoDireito);

        if (olhoEsquerdo < 12 && olhoDireito < 12) {
          this.cheksrealizados.add('piscar');
          this.instrucoesAtual = 'Agora vira a cabeça para a esquerda';
          this.livenessStatus = 'Piscada detectada! ✓';
          this.iconeAtual = 'arrow_back';
          this.kyc = false;
        }
        return;
      }

      // Passo 2 — Virar para a esquerda
      if (
        !this.cheksrealizados.has('esquerda') &&
        this.cheksrealizados.has('piscar')
      ) {
        const narizX = pontos.getNose()[0].x;
        const narizEsquerda = pontos.getJawOutline()[0].x;

        if (narizX - narizEsquerda > 30) {
          this.cheksrealizados.add('esquerda');
          this.instrucoesAtual = 'Agora vire para a direita';
          this.livenessStatus += ' | Esquerda detectada! ✓';
          this.iconeAtual = 'arrow_forward';
          this.kyc = false;
        }
        return;
      }

      // Passo 3 — Virar para a direita
      if (
        !this.cheksrealizados.has('direita') &&
        this.cheksrealizados.has('esquerda')
      ) {
        const narizX = pontos.getNose()[0].x;
        const narizDireita = pontos.getJawOutline()[16].x;

        if (narizDireita - narizX > 30) {
          this.cheksrealizados.add('direita');
          this.instrucoesAtual = 'Parabéns, passaste pelo liveness!';
          this.livenessStatus += ' | Direita detectada! ✓';
          this.iconeAtual = 'check_circle';
          this.livenessPassed = true;
          clearInterval(this.intervalLiveness);
          this.kyc = true;

          this.buscar.enviarKYC(this.kyc).subscribe(data => {
            this.rota.navigate(['/cadastrowebauth']);
            this.buscar.mostrarPerfil();
          });
        }
      }

    } else {
      console.log('Nenhum rosto detectado!');
      this.kyc = false;
    }
  }
}
