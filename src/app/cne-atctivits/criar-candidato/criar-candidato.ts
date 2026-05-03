import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';

interface Candidato {
  id: number;
  nome: string;
  partido: string;
  idade: number;
  slogan: string;
  descricao: string;
  foto_url?: string;
  backgroundurl?: string;
  criando_em?: Date;
  numero?: number;
}

@Component({
  selector: 'app-criar-candidato',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-candidato.html',
  styleUrl: './criar-candidato.css'
})
export class CriarCandidato implements OnInit {

  @ViewChild('inputFoto') inputFoto!: ElementRef<HTMLInputElement>;
  @ViewChild('inputFundo') inputFundo!: ElementRef<HTMLInputElement>;

  form: FormGroup;
  fotoFile: File | null = null;
  fundoFile: File | null = null;
  previewFoto: string | null = null;
  previewFundo: string | null = null;
  enviando: boolean = false;
  mensagem: string = '';
  erroEnvio: boolean = false;

  // CRUD properties
  modo: 'criar' | 'editar' = 'criar';
  candidatoEmEdicao: Candidato | null = null;
  candidatos: Candidato[] = [];
  carregando: boolean = false;
  mostraFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private buscar: ServicesBuscar,
    private rota: Router
  ) {
    this.form = this.fb.group({
      nome:      ['', Validators.required],
      partido:   ['', Validators.required],
      idade:     [null, [Validators.required, Validators.min(18), Validators.max(120)]],
      slogan:    ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarCandidatos();
  }

  // ============================================================
  // CRUD — Carregar candidatos
  // ============================================================

  carregarCandidatos(): void {
    console.log('🔄 Carregando candidatos...');
    this.carregando = true;

    this.buscar.BuscarCandidatos().subscribe({
      next: (resposta) => {
        this.candidatos = resposta;
        this.carregando = false;
        console.log('✅ Candidatos carregados:', this.candidatos.length);
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar candidatos:', erro);
        this.candidatos = [];
        this.carregando = false;
      }
    });
  }

  // ============================================================
  // CRUD — Criar candidato
  // ============================================================

  iniciarCriacao(): void {
    this.modo = 'criar';
    this.candidatoEmEdicao = null;
    this.form.reset();
    this.fotoFile = null;
    this.fundoFile = null;
    this.previewFoto = null;
    this.previewFundo = null;
    this.mensagem = '';
    this.mostraFormulario = true;
  }

  // ============================================================
  // CRUD — Editar candidato
  // ============================================================

  iniciarEdicao(candidato: Candidato): void {
    console.log('✏️ Editando candidato:', candidato);
    this.modo = 'editar';
    this.candidatoEmEdicao = candidato;
    this.mostraFormulario = true;

    // Preenche o formulário com dados do candidato
    this.form.patchValue({
      nome:      candidato.nome,
      partido:   candidato.partido,
      idade:     candidato.idade,
      slogan:    candidato.slogan,
      descricao: candidato.descricao,
    });

    // Carrega previews das imagens existentes
    if (candidato.foto_url) {
      this.previewFoto = candidato.foto_url;
    }
    if (candidato.backgroundurl) {
      this.previewFundo = candidato.backgroundurl;
    }

    this.fotoFile = null;
    this.fundoFile = null;
  }

  // ============================================================
  // Upload de arquivos
  // ============================================================

  triggerFoto(): void  { this.inputFoto.nativeElement.click(); }
  triggerFundo(): void { this.inputFundo.nativeElement.click(); }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.fotoFile = input.files[0];
    this.gerarPreview(this.fotoFile, 'foto');
  }

  onFundoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.fundoFile = input.files[0];
    this.gerarPreview(this.fundoFile, 'fundo');
  }

  private gerarPreview(file: File, tipo: 'foto' | 'fundo'): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (tipo === 'foto') this.previewFoto = reader.result as string;
      else                 this.previewFundo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ============================================================
  // Submeter formulário (criar ou atualizar)
  // ============================================================

  submeter(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.mensagem = 'Por favor, preencha todos os campos correctamente.';
      this.erroEnvio = true;
      return;
    }

    // Em modo criação, exigir fotos. Em modo edição, fotos são opcionais.
    if (this.modo === 'criar' && (!this.fotoFile || !this.fundoFile)) {
      this.mensagem = 'Por favor, selecione a foto do candidato e a imagem de fundo.';
      this.erroEnvio = true;
      return;
    }

    this.enviando = true;
    this.mensagem = '';
    this.erroEnvio = false;

    if (this.modo === 'criar') {
      this.criarCandidato();
    } else {
      this.atualizarCandidato();
    }
  }

  private criarCandidato(): void {
    console.log('➕ Criando novo candidato...');

    const formData = new FormData();
    formData.append('nome',      this.form.value.nome);
    formData.append('partido',   this.form.value.partido);
    formData.append('idade',     this.form.value.idade.toString());
    formData.append('slogan',    this.form.value.slogan);
    formData.append('descricao', this.form.value.descricao);
    formData.append('foto',      this.fotoFile as File,  (this.fotoFile as File).name);
    formData.append('fundo',     this.fundoFile as File, (this.fundoFile as File).name);

    this.buscar.CriarCandidato(formData).subscribe({
      next: () => {
        console.log('✅ Candidato criado com sucesso!');
        this.mensagem = 'Candidato registado com sucesso!';
        this.erroEnvio = false;
        this.enviando = false;
        this.form.reset();
        this.previewFoto = null;
        this.previewFundo = null;
        this.fotoFile = null;
        this.fundoFile = null;
        this.mostraFormulario = false;
        this.carregarCandidatos();
      },
      error: (err) => {
        console.error('❌ Erro ao criar candidato:', err);
        this.mensagem = err?.error?.error ?? 'Erro ao registar o candidato.';
        this.erroEnvio = true;
        this.enviando = false;
      }
    });
  }

  private atualizarCandidato(): void {
    if (!this.candidatoEmEdicao) return;

    console.log('🔄 Atualizando candidato:', this.candidatoEmEdicao.id);

    const formData = new FormData();
    formData.append('nome',      this.form.value.nome);
    formData.append('partido',   this.form.value.partido);
    formData.append('idade',     this.form.value.idade.toString());
    formData.append('slogan',    this.form.value.slogan);
    formData.append('descricao', this.form.value.descricao);

    // Apenas anexa foto/fundo se novos arquivos foram selecionados
    if (this.fotoFile) {
      formData.append('foto', this.fotoFile, this.fotoFile.name);
    }
    if (this.fundoFile) {
      formData.append('fundo', this.fundoFile, this.fundoFile.name);
    }

    this.buscar.AtualizarCandidato(this.candidatoEmEdicao.id, formData).subscribe({
      next: () => {
        console.log('✅ Candidato atualizado com sucesso!');
        this.mensagem = 'Candidato atualizado com sucesso!';
        this.erroEnvio = false;
        this.enviando = false;
        this.mostraFormulario = false;
        this.carregarCandidatos();
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar candidato:', err);
        this.mensagem = err?.error?.error ?? 'Erro ao atualizar o candidato.';
        this.erroEnvio = true;
        this.enviando = false;
      }
    });
  }

  // ============================================================
  // CRUD — Eliminar candidato
  // ============================================================

  eliminarCandidato(candidato: Candidato): void {
    const confirmacao = confirm(`Tem a certeza que deseja eliminar o candidato "${candidato.nome}"?`);
    if (!confirmacao) return;

    console.log('🗑️ Eliminando candidato:', candidato.id);
    this.enviando = true;

    this.buscar.ApagarCandidato(candidato.id).subscribe({
      next: () => {
        console.log('✅ Candidato eliminado com sucesso!');
        this.mensagem = '';
        this.enviando = false;
        this.carregarCandidatos();
      },
      error: (err) => {
        console.error('❌ Erro ao eliminar candidato:', err);
        this.mensagem = err?.error?.error ?? 'Erro ao eliminar o candidato.';
        this.erroEnvio = true;
        this.enviando = false;
      }
    });
  }

  // ============================================================
  // Utilidades
  // ============================================================

  cancelarEdicao(): void {
    this.mostraFormulario = false;
    this.form.reset();
    this.fotoFile = null;
    this.fundoFile = null;
    this.previewFoto = null;
    this.previewFundo = null;
    this.candidatoEmEdicao = null;
  }

  // ============================================================
// Navegação
// ============================================================

voltarParaDashboard(): void {
  this.rota.navigate(['/dashboard']);
}

}