import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject } from 'rxjs';
import * as faceapi from 'face-api.js';
import Tesseract from 'tesseract.js';
import { data, math } from '@tensorflow/tfjs';
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


frenteDocumentos() {
throw new Error('Method not implemented.');
}
carregarArquivo() {
throw new Error('Method not implemented.');
}
onCaptureFrente($event: WebcamImage) {
throw new Error('Method not implemented.');
}
SerfieBI($event: WebcamImage) {
throw new Error('Method not implemented.');
}




liberarVoto() {

}

aparecer: boolean = false;
intervalLiveness: any = null;  // Para o loop de captura
timeoutLiveness: any = null; // para contagem
previousNoseX: number | null = null;  // Para detectar movimento da cabeça
iconeAtual: string = 'touch_app';
livenessPassed: boolean = false;
instrucoesAtual: string = 'Clica no botão para iniciar a prova de vida!';
livenessStatus: string = 'Registo do que já foi feito';
triggerLiveness = new Subject<void>()
cheksrealizados: Set<string> = new Set()
triggerLivenessObservable = this.triggerLiveness.asObservable();
aprovado: boolean = false;
resultado: string = "";
selfieImage: WebcamImage | null = null;
fotoBI: string | null = null;
fotoAcomparar: Float32Array<ArrayBufferLike> | null = null;


trigger = new Subject<void>();
triggerObservable = this.trigger.asObservable();

resultadoOCR: string = "";

kyc: boolean = false;


constructor(private dadosService: ServiceEnviar, private rota: Router, private buscar: ServicesBuscar) {
  this.dadosService.documento$.subscribe(img => {
    console.log(img)
    this.fotoBI = img as string | null;
  });
}



  async ngOnInit() {

  // Configurações para o FaceAPI
  await faceapi.tf.setBackend('cpu'); //Configuração para sistemas lentos
  await faceapi.tf.ready();
 
  const MODEL_URL = 'https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights'; //Busca o faceAPI pela cdn
  // Buscando cada modulo
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}


tirarSelfie() {
  this.trigger.next();
  //this.LeitorOCR();
  }
  
  
  async minhaSelfie(imagem: WebcamImage) {
  
    if (!this.fotoBI){
      alert('Não tem nehuma foto para comparar')
      return
    } 

    
  
    this.selfieImage = imagem;
  
    const biImg = new Image();
    biImg.src = this.fotoBI!;  // a foto do BI
   // await new Promise(resolve => biImg.onload = resolve)
    const selfieImg = new Image();
    selfieImg.src = this.selfieImage.imageAsDataUrl;  // a 
   // await new Promise(resolve => selfieImg.onload = resolve);
  
    // Espera as imagens carregarem completamente
    await biImg.decode();
    await selfieImg.decode();
  
    console.log('Imagens carregadas, a comparar rostos...');
    const descricaoBI =  await faceapi.detectSingleFace(biImg).withFaceLandmarks().withFaceDescriptor()
    const descricaoSelfie = await faceapi.detectSingleFace(selfieImg).withFaceLandmarks().withFaceDescriptor()
    if (descricaoBI && descricaoSelfie) {
      const distancia = faceapi.euclideanDistance(descricaoBI.descriptor, descricaoSelfie.descriptor)
  
      if(distancia < 0.6){
        alert("Reconhecimento facial aprovado! Distância: " + distancia.toFixed(4));
        this.aprovado = true;
        this.resultado = "Reconhecimento facial aprovado! Distância: " + distancia.toFixed(4);
        this.aparecer = true;
        this.fotoAcomparar = descricaoSelfie.descriptor;
        
      
      }else{
        alert("Reconhecimento facial reprovado! Distância: " + distancia.toFixed(4));
       this.resultado = "Reconhecimento facial reprovado! Distância: " + distancia.toFixed(4);
       this.rota.navigate(['/Cnebi']);
      }
      
      
    }else{
      this.resultado = "Não foi possível detectar rosto em uma das imagens.";
    }
  }
  
    async LeitorOCR(){
    if(!this.fotoBI){
      console.log('Não deu para fazer o OCR')
      return
    }
    console.log('OCR iniciado...')
  
  
    const {data: {text}} = await Tesseract.recognize(this.fotoBI, 'por' ,{
      logger: (m: any) => console.log(m)
    });
  
    this.resultadoOCR = text;
    console.log('Resultado Gerado', text);
  }







IniciarLiveness(){

  this.livenessPassed = false
  this.cheksrealizados.clear();
  this.instrucoesAtual = 'Pisca os olhos(fechar e abrir)';
  this.iconeAtual = 'visibility';
  this.livenessStatus = 'A verificar...';

  if (this.intervalLiveness) clearInterval(this.intervalLiveness);
  this.intervalLiveness = setInterval(() => {
    this.triggerLiveness.next();  // Dispara captura de frame
  }, 500);

  // Para o loop quando acabar ou cancelar
  setTimeout(() => {
    if (!this.livenessPassed) {
      clearInterval(this.intervalLiveness);
      this.livenessStatus = 'Tempo esgotado. Tenta novamente.';
    }
  }, 2 * 60 * 1000);  // 1 minuto máximo
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

  if(this.livenessPassed) return;

  if(!this.fotoAcomparar) return;

  const img = new Image();
  img.src = imagem.imageAsDataUrl;
  await img.decode();

  const deteccao = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
  .withFaceLandmarks().withFaceDescriptor();


  if(deteccao && this.fotoAcomparar){

    const distancia = faceapi.euclideanDistance(deteccao.descriptor, this.fotoAcomparar);

    if (distancia > 0.65){ 
      console.log('Rosto não corresponde ao do BI. Distância:', distancia.toFixed(4));
      this.pararLiveness();
      this.livenessStatus = 'Rosto não corresponde ao do BI. Tenta novamente.';
      return;
    }
    

   


    const pontos = deteccao.landmarks
  

  if(!this.cheksrealizados.has('piscar')){
    const olhoEsquerdo = Math.abs(pontos.getLeftEye()[1].y - pontos.getLeftEye()[4].y);
    const olhoDireito = Math.abs(pontos.getRightEye()[1].y - pontos.getRightEye()[4].y);

    console.log('Altura olhos: Esquerdo', olhoEsquerdo, 'Direito', olhoDireito);
    
    if(olhoEsquerdo < 12 && olhoDireito < 12){
      this.cheksrealizados.add('piscar');
      this.instrucoesAtual = 'Agora vira a cabeça para a esquerda'
      this.livenessStatus = 'Piscada detectada! ✓'
      this.iconeAtual = 'arrow_back';
      this.kyc = false;
    }
    return;

  }


  if(!this.cheksrealizados.has('esquerda') && this.cheksrealizados.has('piscar')){
    const narizX = pontos.getNose()[0].x;
    const narizEsquerda = pontos.getJawOutline()[0].x;
    if(narizX - narizEsquerda > 30){
      this.cheksrealizados.add('esquerda');
      this.instrucoesAtual = "Agora vire para a direita";
      this.livenessStatus += ' | Esquerda detectada! ✓';
      this.iconeAtual = 'arrow_forward';
      this.kyc = false;
    }
    return
  }

  if(!this.cheksrealizados.has('direita') && this.cheksrealizados.has('esquerda')){
    const narizX = pontos.getNose()[0].x;
    const narizDireita = pontos.getJawOutline()[16].x;
    if(narizDireita - narizX > 30){

      this.cheksrealizados.add('direita');
      this.instrucoesAtual = 'Parabéns, passaste pelo liveness'
      this.livenessStatus += ' | Direita detectada! ✓';
      this.iconeAtual = 'check_circle';
      this.livenessPassed = true;
      clearInterval(this.intervalLiveness);
      this.kyc = true;
      this.buscar.enviarKYC(this.kyc).subscribe( data=> {
        
         this.rota.navigate(['/cadastrowebauth']);
         this.buscar.mostrarPerfil();
      })
      
    }
    
  }
  
}else{
  console.log('Nenhu rosto detectado!');
  this.kyc = false;

}

}

/*
enviarFoto(evento: any) {
  const ficheiro = evento.target.files[0];
  const leitor = new FileReader();
  leitor.onload = (e: any)=> this.fotoBI = e.target.result;
  leitor.readAsDataURL(ficheiro);
  
}
  */
}
