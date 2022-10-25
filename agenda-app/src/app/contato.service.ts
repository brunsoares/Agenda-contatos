import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contato } from './contato/contato';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  salvar(contato: Contato): Observable<Contato>{
    return this.http.post<Contato>(this.url, contato);
  }

  listar(): Observable<Contato[]>{
    return this.http.get<any>(this.url);
  }

  favoritar(contato:Contato): Observable<any>{
    return this.http.patch(`${this.url}/${contato.id}/favorito`, null);
  }

  uploadFoto(contato: Contato, formData:FormData): Observable<any>{
    return this.http.put(`${this.url}/${contato.id}/foto`, formData, {responseType: 'blob'});
  }
}
