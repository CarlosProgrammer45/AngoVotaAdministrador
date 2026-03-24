import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


// COMPONENTE SPLASH SCREEN - DECLARADO PRIMEIRO

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [NgIf, DecimalPipe, RouterLink, RouterLinkActive],
  template: `
    <div class="splash-container" [class.fade-out]="saindo">

      <!-- Partículas de fundo -->
      <div class="splash-bg">
        <div class="splash-orb splash-orb-1"></div>
        <div class="splash-orb splash-orb-2"></div>
        <div class="splash-orb splash-orb-3"></div>
        <div class="splash-grid"></div>
      </div>

      <div class="splash-content">

        <!-- Logo -->
        <div class="splash-logo-wrap">
          <div class="splash-hex">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <polygon points="32,4 58,18 58,46 32,60 6,46 6,18"
                fill="none" stroke="rgba(59,130,246,0.6)" stroke-width="1.5"/>
              <polygon points="32,12 50,22 50,42 32,52 14,42 14,22"
                fill="rgba(59,130,246,0.08)" stroke="rgba(96,165,250,0.4)" stroke-width="1"/>
              <path d="M22 32l7 7L42 24"
                stroke="#60A5FA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="splash-hex-ring"></div>
          </div>
        </div>

        <!-- Nome -->
        <h1 class="splash-title">
          <span class="splash-title-outline">Ango</span><span class="splash-title-solid">Vota</span>
        </h1>
        <p class="splash-subtitle">Sistema Nacional de Votação Eletrónica</p>

        <!-- Divider -->
        <div class="splash-divider"></div>

        <!-- Barra de progresso -->
        <div class="splash-progress-wrap">
          <div class="splash-progress-bar">
            <div class="splash-progress-fill" [style.width]="progresso + '%'"></div>
            <div class="splash-progress-glow" [style.left]="progresso + '%'"></div>
          </div>
          <div class="splash-progress-footer">
            <span class="splash-msg">{{ mensagemCarregamento }}</span>
            <span class="splash-pct">{{ progresso | number:'1.0-0' }}%</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

    .splash-container {
      position: fixed;
      inset: 0;
      background: #060d1a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.9s ease;
      overflow: hidden;
      font-family: 'Sora', sans-serif;
    }
    .splash-container.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    /* ── Fundo ── */
    .splash-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .splash-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }
    .splash-orb-1 {
      width: 500px; height: 500px;
      background: rgba(37, 99, 235, 0.18);
      top: -150px; left: -100px;
      animation: orbFloat 8s ease-in-out infinite;
    }
    .splash-orb-2 {
      width: 400px; height: 400px;
      background: rgba(59, 130, 246, 0.12);
      bottom: -100px; right: -80px;
      animation: orbFloat 10s ease-in-out infinite reverse;
    }
    .splash-orb-3 {
      width: 300px; height: 300px;
      background: rgba(96, 165, 250, 0.08);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation: orbPulse 4s ease-in-out infinite;
    }
    .splash-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    @keyframes orbFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-30px); }
    }
    @keyframes orbPulse {
      0%, 100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
      50% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
    }

    /* ── Conteúdo ── */
    .splash-content {
      position: relative;
      z-index: 2;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      animation: fadeInUp 0.8s ease both;
    }

    /* ── Hex logo ── */
    .splash-logo-wrap {
      position: relative;
      margin-bottom: 2rem;
    }
    .splash-hex {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      animation: hexSpin 0.9s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .splash-hex-ring {
      position: absolute;
      inset: -14px;
      border-radius: 50%;
      border: 1px solid rgba(59,130,246,0.25);
      animation: ringPulse 2.5s ease-in-out infinite;
    }
    .splash-hex-ring::after {
      content: '';
      position: absolute;
      inset: 10px;
      border-radius: 50%;
      border: 1px solid rgba(96,165,250,0.15);
    }
    @keyframes hexSpin {
      from { opacity: 0; transform: scale(0.5) rotate(-30deg); }
      to   { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes ringPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.08); opacity: 1; }
    }

    /* ── Título ── */
    .splash-title {
      font-size: 2.8rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      margin: 0 0 0.5rem;
      line-height: 1;
      animation: fadeInUp 0.8s ease 0.2s both;
    }
    .splash-title-outline {
      -webkit-text-stroke: 1.5px rgba(255,255,255,0.7);
      color: transparent;
    }
    .splash-title-solid {
      color: #60A5FA;
    }

    .splash-subtitle {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.3);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin: 0;
      animation: fadeInUp 0.8s ease 0.35s both;
    }

    /* ── Divider ── */
    .splash-divider {
      width: 40px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent);
      margin: 1.75rem 0;
      animation: fadeInUp 0.8s ease 0.45s both;
    }

    /* ── Progress ── */
    .splash-progress-wrap {
      width: 280px;
      animation: fadeInUp 0.8s ease 0.55s both;
    }
    .splash-progress-bar {
      position: relative;
      width: 100%;
      height: 2px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: visible;
      margin-bottom: 0.9rem;
    }
    .splash-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1d4ed8, #3B82F6, #60A5FA);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    .splash-progress-glow {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #93C5FD;
      box-shadow: 0 0 10px 3px rgba(96,165,250,0.8);
      transition: left 0.3s ease;
    }
    .splash-progress-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .splash-msg {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.3);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .splash-pct {
      font-size: 0.7rem;
      font-weight: 600;
      color: rgba(59,130,246,0.7);
      letter-spacing: 1px;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
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

      const index = Math.floor(this.progresso / 20);
      if (index < this.mensagens.length) {
        this.mensagemCarregamento = this.mensagens[index];
      }

      if (this.progresso >= 100) {
        this.progresso = 100;
        clearInterval(interval);
        setTimeout(() => {
          this.saindo = true;
          setTimeout(() => this.terminado.emit(), 800);
        }, 500);
      }
    }, 200);
  }
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, SplashScreenComponent, RouterLink, RouterLinkActive],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css'
})
export class PaginaPrincipal implements OnInit, AfterViewInit {

  // ── Canvas da esfera neuronal (hero) ──
  @ViewChild('heroCanvas') heroCanvasRef!: ElementRef<HTMLCanvasElement>;
  // ── Canvas modernização (system section) — via getElementById ──

  mostrarSplash: boolean = true;
  menuAberto: boolean = false;
  navScrolled: boolean = false;

  provinciasNorte: string[] = ['Luanda', 'Benguela', 'Huambo', 'Huíla', 'Cabinda', 'Bié', 'Malanje', 'Namibe'];
  provinciasSul: string[] = ['Cuanza Sul', 'Cuanza Norte', 'Lunda Sul', 'Lunda Norte', 'Uíge', 'Zaire', 'Cuando Cubango', 'Moxico', 'Bengo', 'Cunene'];

  faqItems = [
    {
      pergunta: 'Como é feita a minha identificação?',
      resposta: 'A identificação é realizada através do Bilhete de Identidade nacional e reconhecimento facial ou biométrico, cruzando dados com a base oficial da CNE.',
      aberto: true
    },
    {
      pergunta: 'O sistema pode ser hackeado?',
      resposta: 'Nenhum sistema é 100% infalível, mas o AngoVota utiliza camadas de redundância e blockchain descentralizada que exigiria o controle simultâneo de 51% da rede global de validação para qualquer alteração.',
      aberto: false
    },
    {
      pergunta: 'Posso mudar o meu voto?',
      resposta: 'Não. Uma vez confirmado e submetido, o voto é selado criptograficamente e registado na blockchain. Esta regra mantém a integridade do processo eleitoral clássico.',
      aberto: false
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private rota: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initVoteAnimation();    // animação hero
      this.initNavScroll();        // fundo navbar ao scroll
      this.initSecurityCanvas();
      this.initSystemCanvas();     // canvas modernização
      this.initSmoothScroll();
      this.initScrollAnimations();
    }
  }

  onSplashTerminado(): void {
    this.mostrarSplash = false;
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
    document.body.style.overflow = this.menuAberto ? 'hidden' : '';
  }

  toggleFaq(index: number): void {
    this.faqItems[index].aberto = !this.faqItems[index].aberto;
  }

  alertaVotar(): void {
    
    this.rota.navigate(['/HeaderBi']) 
  }

  // 
  // ANIMAÇÃO DE VOTO — HERO
  //
  private initVoteAnimation(): void {
    const canvas = this.heroCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Partículas que sobem como votos/blockchain
    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      alpha: number; size: number;
      type: 'dot' | 'check' | 'lock';
      pulse: number;
    }

    const particles: Particle[] = [];
    const TYPES: Particle['type'][] = ['dot', 'check', 'lock'];

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 0.8),
      alpha: 0,
      size: 6 + Math.random() * 12,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      pulse: Math.random() * Math.PI * 2
    });

    for (let i = 0; i < 28; i++) {
      const p = spawnParticle();
      p.y = Math.random() * canvas.height; // espalha inicialmente
      p.alpha = Math.random() * 0.5;
      particles.push(p);
    }

    // Nós de rede blockchain — fixos, ligados entre si
    interface Node { x: number; y: number; r: number; pulse: number; }
    const nodes: Node[] = [];
    const NODE_COUNT = 12;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: 0.05 + Math.random() * 0.9,
        y: 0.05 + Math.random() * 0.9,
        r: 3 + Math.random() * 4,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let t = 0;

    const drawCheck = (x: number, y: number, s: number, a: number) => {
      ctx.save();
      ctx.strokeStyle = `rgba(100, 200, 120, ${a})`;
      ctx.lineWidth = s * 0.18;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - s * 0.35, y);
      ctx.lineTo(x - s * 0.05, y + s * 0.35);
      ctx.lineTo(x + s * 0.4, y - s * 0.3);
      ctx.stroke();
      ctx.restore();
    };

    const drawLock = (x: number, y: number, s: number, a: number) => {
      ctx.save();
      ctx.strokeStyle = `rgba(150, 180, 255, ${a})`;
      ctx.lineWidth = s * 0.15;
      ctx.lineCap = 'round';
      // corpo do cadeado
      ctx.strokeRect(x - s*0.3, y - s*0.05, s*0.6, s*0.45);
      // arco
      ctx.beginPath();
      ctx.arc(x, y - s*0.05, s*0.25, Math.PI, 0);
      ctx.stroke();
      ctx.restore();
    };

    const frame = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      // ── Linhas de rede blockchain ──
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < W * 0.35) {
            const alpha = (1 - dist / (W * 0.35)) * 0.25;
            ctx.strokeStyle = `rgba(80, 140, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.stroke();
          }
        }
      }

      // ── Nós da rede ──
      for (const n of nodes) {
        n.pulse += 0.03;
        const glow = 0.4 + Math.sin(n.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 160, 255, ${glow})`;
        ctx.fill();
        // anel externo pulsante
        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, n.r + 4 + Math.sin(n.pulse) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80, 160, 255, ${glow * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── Partículas flutuantes ──
      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.pulse += 0.04;
        p.alpha += 0.008;
        if (p.alpha > 0.7) p.alpha = 0.7;

        if (p.y < -30) {
          Object.assign(p, spawnParticle());
        }

        const a = p.alpha * (0.8 + Math.sin(p.pulse) * 0.2);
        if (p.type === 'dot') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 180, 255, ${a})`;
          ctx.fill();
        } else if (p.type === 'check') {
          drawCheck(p.x, p.y, p.size, a);
        } else {
          drawLock(p.x, p.y, p.size, a);
        }
      }

      requestAnimationFrame(frame);
    };

    frame();
  }


  // ============================================
  // CANVAS MODERNIZAÇÃO — SYSTEM SECTION
  // ============================================
  private initSystemCanvas(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = document.getElementById('systemCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;

    const resize = () => {
      const c = canvas.parentElement;
      if (!c) return;
      W = canvas.width  = c.offsetWidth;
      H = canvas.height = c.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dados: colunas de blocos de votação a processar
    interface Block {
      x: number; y: number;
      w: number; h: number;
      progress: number; // 0-1 fill
      speed: number;
      col: number;
    }

    const COLS = 6;
    const blocks: Block[] = [];

    const makeBlock = (col: number, y: number): Block => ({
      x: 0, y,
      w: 0, h: 36 + Math.random() * 20,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.006,
      col
    });

    for (let c = 0; c < COLS; c++) {
      for (let i = 0; i < 4; i++) {
        blocks.push(makeBlock(c, 0));
      }
    }

    // Floating hexagons (vote tokens)
    interface Hex {
      x: number; y: number;
      vx: number; vy: number;
      size: number; alpha: number;
      pulse: number;
    }
    const hexes: Hex[] = [];
    for (let i = 0; i < 18; i++) {
      hexes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random()-0.5)*0.0004,
        vy: (Math.random()-0.5)*0.0004,
        size: 6 + Math.random()*14,
        alpha: 0.04 + Math.random()*0.1,
        pulse: Math.random()*Math.PI*2
      });
    }

    const drawHex = (x: number, y: number, r: number, a: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI/3)*i - Math.PI/6;
        const px = x + r*Math.cos(angle);
        const py = y + r*Math.sin(angle);
        i === 0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(96,165,250,${a})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Connection lines between random hexes
    interface Connection { a: number; b: number; alpha: number; }
    const conns: Connection[] = [];
    for (let i = 0; i < hexes.length; i++) {
      for (let j = i+1; j < hexes.length; j++) {
        if (Math.random() < 0.18) conns.push({ a: i, b: j, alpha: 0.04 + Math.random()*0.06 });
      }
    }

    let t = 0;

    const frame = () => {
      if (W === 0 || H === 0) { requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      const colW = W / COLS;

      // ── Column grid lines ──
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * colW, 0);
        ctx.lineTo(c * colW, H);
        ctx.strokeStyle = 'rgba(59,130,246,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── Blocks (data/vote records flowing) ──
      blocks.forEach((b, idx) => {
        if (b.w === 0) {
          // initialize position
          b.w = colW * 0.7;
          b.x = b.col * colW + (colW - b.w) / 2;
          b.y = (Math.floor(idx / COLS)) * (b.h + 12) + (b.col % 2) * 20;
        }

        b.y -= b.speed * H * 0.5;
        if (b.y + b.h < 0) {
          b.y = H + Math.random() * 80;
          b.progress = 0;
          b.h = 30 + Math.random() * 22;
        }

        b.progress = Math.min(1, b.progress + b.speed * 0.8);

        // Block outline
        const bAlpha = 0.12 + b.progress * 0.12;
        ctx.strokeStyle = `rgba(59,130,246,${bAlpha})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Block fill (progress)
        const fillW = b.w * b.progress;
        ctx.fillStyle = `rgba(59,130,246,${0.05 + b.progress*0.08})`;
        ctx.fillRect(b.x, b.y, fillW, b.h);

        // Checkmark when complete
        if (b.progress > 0.95) {
          const cx2 = b.x + b.w/2;
          const cy2 = b.y + b.h/2;
          const s = b.h * 0.3;
          ctx.save();
          ctx.strokeStyle = `rgba(100,200,130,${(b.progress-0.95)*20 * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx2-s, cy2);
          ctx.lineTo(cx2-s*0.2, cy2+s*0.8);
          ctx.lineTo(cx2+s, cy2-s*0.6);
          ctx.stroke();
          ctx.restore();
        }

        // Scanline inside block
        const scanY = b.y + (b.h * ((t * b.speed * 40) % 1));
        ctx.beginPath();
        ctx.moveTo(b.x, scanY);
        ctx.lineTo(b.x + b.w, scanY);
        ctx.strokeStyle = `rgba(96,165,250,0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // ── Floating hex tokens ──
      conns.forEach(conn => {
        const ha = hexes[conn.a], hb = hexes[conn.b];
        ctx.beginPath();
        ctx.moveTo(ha.x*W, ha.y*H);
        ctx.lineTo(hb.x*W, hb.y*H);
        ctx.strokeStyle = `rgba(59,130,246,${conn.alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      hexes.forEach(h => {
        h.x += h.vx; h.y += h.vy; h.pulse += 0.02;
        if (h.x < 0 || h.x > 1) h.vx *= -1;
        if (h.y < 0 || h.y > 1) h.vy *= -1;
        const a = h.alpha * (0.7 + Math.sin(h.pulse)*0.3);
        drawHex(h.x*W, h.y*H, h.size, a);
      });

      // ── Horizontal scan line across full canvas ──
      const scanFull = (Math.sin(t * 0.4) * 0.5 + 0.5) * H;
      const scanGrad = ctx.createLinearGradient(0, scanFull-2, 0, scanFull+2);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(59,130,246,0.08)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanFull-2, W, 4);

      requestAnimationFrame(frame);
    };

    frame();
  }

  // ============================================
  // SCROLL DA NAVBAR
  // ============================================
  private initNavScroll(): void {
    window.addEventListener('scroll', () => {
      this.navScrolled = window.scrollY > 20;
    });
  }

  // ============================================
  // CANVAS SEGURANÇA (existente — sem alterações)
  // ============================================
  private initSecurityCanvas(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = document.getElementById('securityCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let particles: any[] = [];

    class Particle {
      x!: number; y!: number;
      vx!: number; vy!: number;
      size!: number;

      constructor() {
        this.x    = Math.random() * width;
        this.y    = Math.random() * height;
        this.vx   = (Math.random() - 0.5) * 0.5;
        this.vy   = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update(): void {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width)  this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(c: CanvasRenderingContext2D): void {
        c.fillStyle = '#3B82F633';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const init = (): void => {
      const container = canvas.parentElement;
      if (!container) return;
      width  = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width  = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < 40; i++) particles.push(new Particle());
    };

    const animate = (): void => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(ctx); });

      ctx.strokeStyle = '#3B82F622';
      ctx.lineWidth   = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();
  }

  private initSmoothScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  private initScrollAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-fade-in');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
}
