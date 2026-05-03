import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject } from 'rxjs';
import * as faceapi from 'face-api.js';
import Tesseract from 'tesseract.js';
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

videoOptions: MediaTrackConstraints = {
  facingMode: 'user'
};

kyc: boolean = false;

// Estado de processamento para o overlay de lo
aProcessar: boolean = false;
mensagemProcessamento: string = 'A processar...';

livenessAtivo: boolean = false

// --- ADICIONADO: Notificação visual em vez de alert() ---
notificacao: { mensagem: string; tipo: 'sucesso' | 'erro' | 'info' } | null = null;
private notificacaoTimeout: any = null;

//  Flag para evitar frames duplicados no liveness (throttle manual) 
private livenessEmProcessamento: boolean = false;

//  Flag para evitar que o botão da selfie seja clicado enquanto já está a processar
private selfieEmProcessamento: boolean = false;

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
  // --- ADICIONADO: Ignora cliques enquanto a selfie anterior ainda está a ser processada ---
  if (this.selfieEmProcessamento) return;
  this.trigger.next();
  }
  
  
  async minhaSelfie(imagem: WebcamImage) {
  
    if (!this.fotoBI){
      // --- ADICIONADO: Substituído alert() por notificação visual ---
      this.mostrarNotificacao('Não tem nenhuma foto para comparar', 'erro');
      return
    } 

    // --- ADICIONADO: Bloqueia novos disparos enquanto está a processar, liberta no final ---
    this.selfieEmProcessamento = true;

    // --- ADICIONADO: Ativa o overlay de processamento com mensagem ---
    this.aProcessar = true;
    this.mensagemProcessamento = 'A comparar rostos...';
  
    this.selfieImage = imagem;
  
    const biImg = new Image();
    biImg.src = this.fotoBI!;
    const selfieImg = new Image();
    selfieImg.src = this.selfieImage.imageAsDataUrl;
  
    // Espera as imagens carregarem completamente
    await biImg.decode();
    await selfieImg.decode();
  
    console.log('Imagens carregadas, a comparar rostos...');

    // Atualiza a mensagem do overlay durante a deteção
    this.mensagemProcessamento = 'A detetar rosto...';

    const descricaoBI =  await faceapi.detectSingleFace(biImg).withFaceLandmarks().withFaceDescriptor()
    const descricaoSelfie = await faceapi.detectSingleFace(selfieImg).withFaceLandmarks().withFaceDescriptor()

    // Desativa o overlay após a deteção 
    this.aProcessar = false;

    if (descricaoBI && descricaoSelfie) {
      const distancia = faceapi.euclideanDistance(descricaoBI.descriptor, descricaoSelfie.descriptor)
  
      if(distancia < 0.6){
        // --- ADICIONADO: Substituído alert() por notificação visual ---
        this.mostrarNotificacao('Reconhecimento facial aprovado! Distância: ' + distancia.toFixed(4), 'sucesso');
        this.aprovado = true;
        this.resultado = "Reconhecimento facial aprovado! Distância: " + distancia.toFixed(4);
        this.aparecer = true;
        this.fotoAcomparar = descricaoSelfie.descriptor;
        // Liberta o guard — aprovado, não precisa de repetir ---
        this.selfieEmProcessamento = false;
        
      }else{
        //  notificação visual
        this.mostrarNotificacao('Reconhecimento facial reprovado! Distância: ' + distancia.toFixed(4), 'erro');
       this.resultado = "Reconhecimento facial reprovado! Distância: " + distancia.toFixed(4);
       // Liberta o guard antes de navegar ---
       this.selfieEmProcessamento = false;
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
  
  
    const {data: {text}} = await Tesseract.recognize(this.fotoBI, 'eng' ,{
      logger: (m: any) => console.log(m)
    });
  
    this.resultadoOCR = text;
    console.log('Resultado Gerado', text);
  }


//Método para mostrar notificação visual temporária
mostrarNotificacao(mensagem: string, tipo: 'sucesso' | 'erro' | 'info') {
  // Limpa o timeout anterior se houver uma notificação ativa
  if (this.notificacaoTimeout) clearTimeout(this.notificacaoTimeout);
  this.notificacao = { mensagem, tipo };
  // Desaparece automaticamente após 4 segundos
  this.notificacaoTimeout = setTimeout(() => {
    this.notificacao = null;
  }, 4000);
}


IniciarLiveness(){

  this.livenessPassed = false
  this.cheksrealizados.clear();
  this.instrucoesAtual = 'Pisca os olhos(fechar e abrir)';
  this.iconeAtual = 'visibility';
  this.livenessStatus = 'A verificar...';

  // Reset do flag ao reiniciar ---
  this.livenessEmProcessamento = false;

  // Reset do overlay caso tenha ficado ativo de uma tentativa anterior
  this.aProcessar = false;

  // ADICIONADO: Marca o liveness como ativo para desativar o botão Iniciar e ativar o Parar
  this.livenessAtivo = true;

  if (this.intervalLiveness) clearInterval(this.intervalLiveness);

  // Intervalo aumentado de 500ms para 700ms para evitar sobreposição de frames
  //     no processamento da faceapi, que causava o botão precisar de ser clicado duas vezes ---
  this.intervalLiveness = setInterval(() => {
    // Só dispara novo frame se o anterior já terminou
    if (!this.livenessEmProcessamento) {
      this.triggerLiveness.next();
    }
  }, 700);

  // Para o loop quando acabar ou cancelar
  setTimeout(() => {
    if (!this.livenessPassed) {
      clearInterval(this.intervalLiveness);
      this.livenessStatus = 'Tempo esgotado. Tenta novamente.';
      this.livenessAtivo = false;
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
  // Reset do flag ao parar ---
  this.livenessEmProcessamento = false;
  // Garante que o overlay desaparece mesmo que o liveness seja parado a meio de um await
  this.aProcessar = false;
  //  Marca o liveness como inativo para reativar o botão Iniciar
  this.livenessAtivo = false;
  this.instrucoesAtual = 'Clica no botão para iniciar a prova de vida!';
  this.livenessStatus = 'Liveness parado.';
}

async framesCapturada(imagem: WebcamImage) {

  if(this.livenessPassed) return;

  if(!this.fotoAcomparar) return;

  // Throttle — ignora o frame se ainda está a processar o anterior,
  //     isto evita a fila de frames acumulados que causava lentidão e duplo clique
  if (this.livenessEmProcessamento) return;
  this.livenessEmProcessamento = true;

  const img = new Image();
  img.src = imagem.imageAsDataUrl;
  await img.decode();

  // Mantido SsdMobilenetv1 — é o único que garante landmarks precisos o suficiente
  // para detetar corretamente a posição nariz/maxilar usada nas verificações esquerda/direita.
  // TinyFaceDetector é mais rápido mas causa falsos positivos nessas verificações.
  const deteccao = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
  .withFaceLandmarks().withFaceDescriptor();


  if(deteccao && this.fotoAcomparar){

    const distancia = faceapi.euclideanDistance(deteccao.descriptor, this.fotoAcomparar);

    if (distancia > 0.65){ 
      console.log('Rosto não corresponde ao do BI. Distância:', distancia.toFixed(4));
      this.pararLiveness();
      this.livenessStatus = 'Rosto não corresponde ao do BI. Tenta novamente.';
      //Notificação visual quando o rosto não corresponde ---
      this.mostrarNotificacao('Rosto não corresponde ao do BI. Tenta novamente.', 'erro');
      this.livenessEmProcessamento = false; // --- ADICIONADO: liberta o throttle ao sair ---
      return;
    }
    

    const pontos = deteccao.landmarks
  

  if(!this.cheksrealizados.has('piscar')){
    const olhoEsquerdo = Math.abs(pontos.getLeftEye()[1].y - pontos.getLeftEye()[4].y);
    const olhoDireito = Math.abs(pontos.getRightEye()[1].y - pontos.getRightEye()[4].y);

    console.log('Altura olhos: Esquerdo', olhoEsquerdo, 'Direito', olhoDireito);
    
    if(olhoEsquerdo < 12 && olhoDireito < 12){
      this.cheksrealizados.add('piscar');
      this.instrucoesAtual = 'Agora vira a cabeça para a esquerda';
      this.livenessStatus = 'Piscada detectada! ✓';
      this.iconeAtual = 'arrow_back';
      this.kyc = false;

      // Para a captura imediatamente após detetar a piscada,
      // assim o utilizador não fica a piscar sem feedback enquanto o intervalo continua
      clearInterval(this.intervalLiveness);
      // Recomeça o intervalo após uma pequena pausa para dar tempo ao utilizador de ler a instrução
      setTimeout(() => {
        if (!this.livenessPassed) {
          this.intervalLiveness = setInterval(() => {
            if (!this.livenessEmProcessamento) this.triggerLiveness.next();
          }, 700);
        }
      }, 1200);
    }
    this.livenessEmProcessamento = false;
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

      // Para a captura e espera 1.5s antes de recomeçar a verificar a direita.
      // Sem esta pausa o utilizador ainda está virado para a esquerda quando o próximo
      // frame é capturado, e como as coordenadas são simétricas isso pode validar a direita
      // imediatamente sem o utilizador ter mexido — era esse o falso positivo reportado.
      clearInterval(this.intervalLiveness);
      setTimeout(() => {
        if (!this.livenessPassed) {
          this.intervalLiveness = setInterval(() => {
            if (!this.livenessEmProcessamento) this.triggerLiveness.next();
          }, 700);
        }
      }, 1500);
    }
    this.livenessEmProcessamento = false;
    return;
  }

  if(!this.cheksrealizados.has('direita') && this.cheksrealizados.has('esquerda')){
    const narizX = pontos.getNose()[0].x;
    const narizDireita = pontos.getJawOutline()[16].x;

    // Limite aumentado de 30 para 40 na direita para exigir uma rotação
    // mais clara e evitar que valores residuais da posição anterior (esquerda) disparem
    // um falso positivo logo no primeiro frame após a pausa
    if(narizDireita - narizX > 40){

      this.cheksrealizados.add('direita');
      this.instrucoesAtual = 'Parabéns, passaste pelo liveness';
      this.livenessStatus += ' | Direita detectada! ✓';
      this.iconeAtual = 'check_circle';
      this.livenessPassed = true;
      clearInterval(this.intervalLiveness);
      this.kyc = true;
      // --- ADICIONADO: Notificação de sucesso no liveness ---
      this.mostrarNotificacao('Prova de vida concluída com sucesso!', 'sucesso');
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

  // liberta o aelerador no final do processamento normal 
  this.livenessEmProcessamento = false;
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
