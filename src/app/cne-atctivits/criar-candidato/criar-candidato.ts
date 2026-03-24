import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicesBuscar } from '../../Comunicacao-com-backend/services-buscar';

@Component({
  selector: 'app-criar-candidato',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-candidato.html',
  styleUrl: './criar-candidato.css'
})
export class CriarCandidato {

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

  submeter(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.mensagem = 'Por favor, preencha todos os campos correctamente.';
      this.erroEnvio = true;
      return;
    }

    if (!this.fotoFile || !this.fundoFile) {
      this.mensagem = 'Por favor, selecione a foto do candidato e a imagem de fundo.';
      this.erroEnvio = true;
      return;
    }

    this.enviando = true;
    this.mensagem = '';
    this.erroEnvio = false;

    const formData = new FormData();
    formData.append('nome',      this.form.value.nome);
    formData.append('partido',   this.form.value.partido);
    formData.append('idade',     this.form.value.idade.toString());
    formData.append('slogan',    this.form.value.slogan);
    formData.append('descricao', this.form.value.descricao);
    formData.append('foto',      this.fotoFile,  this.fotoFile.name);
    formData.append('fundo',     this.fundoFile, this.fundoFile.name);

    this.buscar.CriarCandidato(formData).subscribe({
      next: () => {
        this.mensagem = 'Candidato registado com sucesso!';
        this.erroEnvio = false;
        this.enviando = false;
        this.form.reset();
        this.previewFoto = null;
        this.previewFundo = null;
        this.fotoFile = null;
        this.fundoFile = null;
        setTimeout(() => this.rota.navigate(['/candidatos']), 1500);
      },
      error: (err) => {
        this.mensagem = err?.error?.error ?? 'Erro ao registar o candidato.';
        this.erroEnvio = true;
        this.enviando = false;
        console.error(err);
      }
    });
  }
}