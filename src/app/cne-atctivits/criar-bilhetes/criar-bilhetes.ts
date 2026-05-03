import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesActivits } from '../services-activits';

@Component({
  selector: 'app-criar-bilhetes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-bilhetes.html',
  styleUrl: './criar-bilhetes.css'
})
export class CriarBilhetes implements OnInit {

  bilheteForm!: FormGroup;
  enviando: boolean = false;
  mensagem: string = '';
  erroEnvio: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private serviceCriarBilhete: ServicesActivits
  ) {}

  ngOnInit(): void {
    this.bilheteForm = this.fb.group({
      numero_bi: ['', 
        [ 
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(14),
          Validators.pattern(/^[A-Za-z0-9]+$/)
        ]
      ],
      nome_completo: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100)
      ]], 
      data_nascimento: ['', Validators.required], 
      genero: [''], 
      nacionalidade: ['Angolana'], 
      local_emissao: ['']
    });
  }

  onSubmit(): void {
    this.bilheteForm.markAllAsTouched();

    if (this.bilheteForm.invalid) {
      this.mensagem = 'Por favor, preencha todos os campos obrigatórios correctamente.';
      this.erroEnvio = true;
      return;
    }

    this.enviando = true;
    this.mensagem = '';
    this.erroEnvio = false;

    this.serviceCriarBilhete
      .criarNovoBilhete(this.bilheteForm.value)
      .subscribe({
        next: (res) => {
          console.log('Bilhete Criado com sucesso', res);
          this.mensagem = 'Bilhete criado com sucesso!';
          this.erroEnvio = false;
          this.enviando = false;
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao criar bilhete', error);
          this.mensagem = error?.error?.error ?? 'Erro ao criar o bilhete.';
          this.erroEnvio = true;
          this.enviando = false;
        }
      });
  }

  resetForm(): void {
    this.bilheteForm.reset({
      nacionalidade: 'Angolana',
      genero: '',
      local_emissao: ''
    });
    this.mensagem = '';
    this.erroEnvio = false;
  }

  getClass(area: string): string {
    const control = this.bilheteForm.get(area);
    
    if (!control) return '';
    
    if (control.invalid && (control.touched || control.dirty)) {
      return 'invalido';
    }
    
    if (control.valid && (control.touched || control.dirty)) {
      return 'validado';
    }
    
    return '';
  }
}