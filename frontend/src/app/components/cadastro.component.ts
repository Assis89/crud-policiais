import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoliciaisService } from '../services/policiais.service';
import { Policial } from '../models/policial.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-card">
        <h2 class="form-title">Cadastro de Policial Militar</h2>
        
        <form [formGroup]="cadastroForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label for="rg_civil">RG Civil *</label>
            <input
              id="rg_civil"
              type="text"
              class="form-control"
              formControlName="rg_civil"
              [class.error]="cadastroForm.get('rg_civil')?.invalid && cadastroForm.get('rg_civil')?.touched"
              placeholder="Digite o RG Civil"
            />
            <div class="error-message" *ngIf="cadastroForm.get('rg_civil')?.invalid && cadastroForm.get('rg_civil')?.touched">
              RG Civil é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="rg_militar">RG Militar *</label>
            <input
              id="rg_militar"
              type="text"
              class="form-control"
              formControlName="rg_militar"
              [class.error]="cadastroForm.get('rg_militar')?.invalid && cadastroForm.get('rg_militar')?.touched"
              placeholder="Digite o RG Militar"
            />
            <div class="error-message" *ngIf="cadastroForm.get('rg_militar')?.invalid && cadastroForm.get('rg_militar')?.touched">
              RG Militar é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="cpf">CPF *</label>
            <input
              id="cpf"
              type="text"
              class="form-control"
              formControlName="cpf"
              [class.error]="cadastroForm.get('cpf')?.invalid && cadastroForm.get('cpf')?.touched"
              placeholder="000.000.000-00"
              (input)="formatCpf($event)"
              maxlength="14"
            />
            <div class="error-message" *ngIf="cadastroForm.get('cpf')?.invalid && cadastroForm.get('cpf')?.touched">
              <span *ngIf="cadastroForm.get('cpf')?.errors?.['required']">CPF é obrigatório</span>
              <span *ngIf="cadastroForm.get('cpf')?.errors?.['cpfInvalido']">CPF inválido</span>
            </div>
          </div>

          <div class="form-group">
            <label for="data_nascimento">Data de Nascimento *</label>
            <input
              id="data_nascimento"
              type="date"
              class="form-control"
              formControlName="data_nascimento"
              [class.error]="cadastroForm.get('data_nascimento')?.invalid && cadastroForm.get('data_nascimento')?.touched"
            />
            <div class="error-message" *ngIf="cadastroForm.get('data_nascimento')?.invalid && cadastroForm.get('data_nascimento')?.touched">
              Data de nascimento é obrigatória
            </div>
          </div>

          <div class="form-group">
            <label for="matricula">Matrícula *</label>
            <input
              id="matricula"
              type="text"
              class="form-control"
              formControlName="matricula"
              [class.error]="cadastroForm.get('matricula')?.invalid && cadastroForm.get('matricula')?.touched"
              placeholder="Digite a matrícula"
            />
            <div class="error-message" *ngIf="cadastroForm.get('matricula')?.invalid && cadastroForm.get('matricula')?.touched">
              Matrícula é obrigatória
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn--md btn-primary" 
              [disabled]="cadastroForm.invalid || loading"
            >
              {{ loading ? 'Cadastrando...' : 'Cadastrar Policial' }}
            </button>
            
            <button 
              type="button" 
              class="btn btn--md btn-secondary" 
              (click)="voltarListagem()"
            >
              Voltar para Listagem
            </button>
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
            <div style="margin-top: 0.75rem; display: flex; justify-content: center;">
              <button type="button" class="btn btn--md btn-secondary" (click)="voltarListagem()">
                Ir para Listagem agora
              </button>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

        </form>
      </div>
    </div>
  `,
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  cadastroForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private policiaisService: PoliciaisService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      rg_civil: ['', [Validators.required]],
      rg_militar: ['', [Validators.required]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      data_nascimento: ['', [Validators.required]],
      matricula: ['', [Validators.required]]
    });
  }

  cpfValidator(control: any) {
    const v = (control.value || '').replace(/\D/g, '');
    if (v.length !== 11) return { cpfInvalido: true };
    if (/^(\d)\1{10}$/.test(v)) return { cpfInvalido: true };
    const calc = (base: string, factor: number) => {
      let sum = 0;
      for (let i = 0; i < base.length; i++) sum += parseInt(base[i], 10) * (factor - i);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };
    const d1 = calc(v.substring(0, 9), 10);
    const d2 = calc(v.substring(0, 10), 11);
    if (d1 !== parseInt(v[9], 10) || d2 !== parseInt(v[10], 10)) return { cpfInvalido: true };
    return null;
  }

  formatCpf(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    event.target.value = value;
    this.cadastroForm.patchValue({ cpf: value });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = { ...this.cadastroForm.value };
      // Remove formatação do CPF
      formData.cpf = formData.cpf.replace(/\D/g, '');

      this.policiaisService.cadastrarPolicial(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Policial cadastrado com sucesso!';
          this.cadastroForm.reset();
          
          // Redirecionar para listagem após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/listagem']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Erro ao cadastrar policial';
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.cadastroForm.controls).forEach(key => {
        this.cadastroForm.get(key)?.markAsTouched();
      });
    }
  }

  voltarListagem() {
    this.router.navigate(['/listagem']);
  }
}
