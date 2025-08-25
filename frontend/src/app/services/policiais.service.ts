import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Policial } from '../models/policial.model';

@Injectable({
  providedIn: 'root'
})
export class PoliciaisService {
  private apiUrl = 'http://localhost:3000/policiais';

  constructor(private http: HttpClient) { }

  cadastrarPolicial(policial: Policial): Observable<any> {
    return this.http.post<any>(this.apiUrl, policial)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarPoliciais(): Observable<Policial[]> {
    return this.http.get<Policial[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  obterPorId(id: number): Observable<Policial> {
    return this.http.get<Policial>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  editarPolicial(id: number, policial: Policial): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, policial)
      .pipe(catchError(this.handleError));
  }

  excluirPolicial(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado cliente (rede, etc.)
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado servidor
      // Tenta extrair a mensagem útil do backend
      const payload = error.error;
      if (payload) {
        if (typeof payload === 'string') {
          errorMessage = payload;
        } else if (typeof payload === 'object') {
          errorMessage = payload.error || payload.message || `Código do erro: ${error.status}`;
        }
      } else {
        errorMessage = `Código do erro: ${error.status}`;
      }
    }

    console.error('HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
