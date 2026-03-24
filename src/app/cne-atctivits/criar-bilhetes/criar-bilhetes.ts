import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesActivits } from '../services-activits';

@Component({
  selector: 'app-criar-bilhetes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-bilhetes.html',
  styleUrl: './criar-bilhetes.css'
})
export class CriarBilhetes implements OnInit{

  bilheteForm!: FormGroup;


  constructor(private fb: FormBuilder, private serviceCriarBilhete: ServicesActivits){}


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
        ]
      
      ], 

      data_nascimento: ['', Validators.required], 
      genero: [''], 
      nacionalidade: ['Angolana'], 
      local_emissao: ['']
    });
  }


  onSubmit(): void{

    if(this.bilheteForm.valid){

      this.serviceCriarBilhete
      .criarNovoBilhete(this.bilheteForm.value)
      .subscribe({

        next: (res)=>{

          console.log('Bilhete Criado com sucesso');
        },

        error: (error)=>{
          console.error('Erro ao criar bilhete', error);
        }

      })

    }else{
      console.warn('Formulário inválido');
    }

  }


  getClass(area: string): string{

    const control = this.bilheteForm.get(area);

    if (!control) return '';

    if (this.bilheteForm.invalid && (this.bilheteForm.dirty || this.bilheteForm.touched)){

      return 'invalido';
    }

    if (this.bilheteForm.valid && (this.bilheteForm.dirty || this.bilheteForm.touched)) {
        return 'validado';
    }

    return '';

  }



}
