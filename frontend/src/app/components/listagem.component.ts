import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PoliciaisService } from '../services/policiais.service';
import { Policial } from '../models/policial.model';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <h2 class="title">Lista de Policiais</h2>

        <div class="top-actions">
          <div class="filters">
          <input type="text" placeholder="Filtrar por CPF" [(ngModel)]="filtroCpf" (input)="onFiltroChange()" class="input" />
          <button class="btn success" (click)="carregar()" [disabled]="loading">{{ loading ? 'Atualizando...' : 'Atualizar' }}</button>
          </div>
          <a class="btn btn-secondary" routerLink="/cadastro">Novo cadastro</a>
        </div>

        <div class="alert error" *ngIf="errorMessage">{{ errorMessage }}</div>

        <div class="table-wrapper" *ngIf="policiais.length">
          <table class="table">
            <thead>
              <tr>
                <th>RG Civil</th>
                <th>RG Militar</th>
                <th>CPF</th>
                <th>Data Nascimento</th>
                <th>Matrícula</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of policiais; trackBy: trackById">
                <td>{{ p.rg_civil }}</td>
                <td>{{ p.rg_militar }}</td>
                <td>{{ formatCpfView(p.cpf) }}</td>
                <td>{{ p.data_nascimento | date: 'dd/MM/yyyy' }}</td>
                <td style="display:flex;gap:.5rem;align-items:center;white-space:nowrap">
                  <span>{{ p.matricula }}</span>
                  <button class="btn small success" (click)="editar(p)">Editar</button>
                  <button class="btn small danger" (click)="excluir(p)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="muted" *ngIf="!loading && !policiais.length && !errorMessage">Nenhum policial encontrado.</div>
      </div>
    </div>
  `,
  styleUrls: ['./listagem.component.css']
})
export class ListagemComponent {
  policiais: Policial[] = [];
  loading = false;
  errorMessage = '';
  filtroCpf = '';

  constructor(private service: PoliciaisService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.errorMessage = '';
    this.service.listarPoliciais().subscribe({
      next: (dados: Policial[]) => {
        const list = Array.isArray(dados) ? dados : [];
        this.policiais = this.filtroCpf
          ? list.filter(p => this.formatCpfView(p.cpf).includes(this.filtroCpf))
          : list;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.message || 'Falha ao carregar policiais';
      }
    });
  }

  onFiltroChange() {
    this.carregar();
  }

  trackById(_: number, item: Policial) {
    return item.id ?? `${item.cpf}-${item.matricula}`;
  }

  formatCpfView(cpf: string) {
    const v = (cpf || '').replace(/\D/g, '').slice(0, 11);
    return v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  editar(p: Policial) {
    // Poderia navegar para uma tela de edição; por ora, exemplo simples que reaproveita prompt
    const novoRgCivil = prompt('RG Civil:', p.rg_civil ?? '');
    if (novoRgCivil == null) return;
    const novoRgMilitar = prompt('RG Militar:', p.rg_militar ?? '');
    if (novoRgMilitar == null) return;
    const novoCpf = prompt('CPF (somente números):', (p.cpf || '').replace(/\D/g, ''));
    if (novoCpf == null) return;
    const novaData = prompt('Data de Nascimento (YYYY-MM-DD):', (p.data_nascimento || '').toString().slice(0,10));
    if (novaData == null) return;
    const novaMatricula = prompt('Matrícula:', p.matricula ?? '');
    if (novaMatricula == null) return;
    const id = p.id as number;
    this.loading = true;
    this.errorMessage = '';
    this.service.editarPolicial(id, {
      id,
      rg_civil: novoRgCivil,
      rg_militar: novoRgMilitar,
      cpf: novoCpf,
      data_nascimento: novaData,
      matricula: novaMatricula
    }).subscribe({
      next: () => this.carregar(),
      error: (err: any) => { this.loading = false; this.errorMessage = err?.message || 'Falha ao editar.'; }
    });
  }

  excluir(p: Policial) {
    if (!p.id) return;
    if (!confirm('Confirma excluir este policial?')) return;
    this.loading = true;
    this.errorMessage = '';
    this.service.excluirPolicial(p.id).subscribe({
      next: () => this.carregar(),
      error: (err: any) => { this.loading = false; this.errorMessage = err?.message || 'Falha ao excluir.'; }
    });
  }
}
