import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  template: `
    <div class="splash-container" [class.fade-out]="saindo">
      <div class="splash-content">
        <div class="logo-animation">
          <div class="logo-circle">
            <span>A</span>
          </div>
        </div>
        <h1 class="splash-title">AngoVota</h1>
        <p class="splash-subtitle">Sistema Nacional de Votação Eletrónica</p>
        <div class="loading-bar">
          <div class="loading-progress" [style.width]="progresso + '%'"></div>
        </div>
        <p class="loading-text">{{ mensagemCarregamento }}</p>
      </div>
    </div>
  `,
  styles: [`
    .splash-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: #0A1929;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.8s ease;
    }

    .splash-container.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    .splash-content {
      text-align: center;
      max-width: 500px;
      padding: 2rem;
    }

    .logo-animation {
      margin-bottom: 2rem;
      animation: pulse 2s infinite;
    }

    .logo-circle {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #3B82F6, #1A2B3F);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 0 50px rgba(59, 130, 246, 0.5);
      animation: rotate 10s linear infinite;
    }

    .logo-circle span {
      color: white;
      font-size: 4rem;
      font-weight: 900;
      animation: pulse 2s infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .splash-title {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(to right, #3B82F6, #60A5FA, #93C5FD);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
      animation: fadeInUp 1s ease;
    }

    .splash-subtitle {
      color: #9CA3AF;
      font-size: 1rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 3rem;
      animation: fadeInUp 1s ease 0.2s both;
    }

    .loading-bar {
      width: 300px;
      height: 4px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 4px;
      overflow: hidden;
      margin: 2rem auto 1rem;
      animation: fadeInUp 1s ease 0.4s both;
    }

    .loading-progress {
      height: 100%;
      background: linear-gradient(90deg, #3B82F6, #60A5FA);
      border-radius: 4px;
      transition: width 0.3s ease;
      box-shadow: 0 0 20px #3B82F6;
    }

    .loading-text {
      color: #6B7280;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: fadeInUp 1s ease 0.6s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SplashScreenComponent implements OnInit {
  @Output() terminado = new EventEmitter<void>();
  
  progresso: number = 0;
  saindo: boolean = false;
  
  mensagens: string[] = [
    'A carregar sistema...',
    'A estabelecer ligação segura...',
    'A verificar integridade...',
    'Quase lá...',
    'Bem-vindo à democracia digital!'
  ];
  
  mensagemCarregamento: string = this.mensagens[0];
  
  ngOnInit(): void {
    this.simularCarregamento();
  }
  
  private simularCarregamento(): void {
    const interval = setInterval(() => {
      this.progresso += Math.random() * 15;
      
      // Atualiza mensagem baseada no progresso
      const index = Math.floor(this.progresso / 20);
      if (index < this.mensagens.length) {
        this.mensagemCarregamento = this.mensagens[index];
      }
      
      if (this.progresso >= 100) {
        this.progresso = 100;
        clearInterval(interval);
        
        // Pequeno delay antes de desaparecer
        setTimeout(() => {
          this.saindo = true;
          
          // Emite evento após animação de saída
          setTimeout(() => {
            this.terminado.emit();
          }, 800);
        }, 500);
      }
    }, 200);
  }
}