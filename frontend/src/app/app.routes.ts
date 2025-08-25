import { Routes } from '@angular/router';
import { CadastroComponent } from './components/cadastro.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'cadastro', pathMatch: 'full' },
	{ path: 'cadastro', component: CadastroComponent },
	{ path: 'listagem', loadComponent: () => import('./components/listagem.component').then(m => m.ListagemComponent) },
	{ path: '**', redirectTo: 'cadastro' }
];
