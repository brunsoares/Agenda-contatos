import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Contato } from './contato/contato';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginaContato } from './contato/paginaContato';

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

  listar(pagina, tamanho): Observable<PaginaContato>{
    const params = new HttpParams()
          .set('pagina', pagina)
          .set('tamanho', tamanho)
    return this.http.get<any>(`${this.url}?${params.toString()}`);
  }

  favoritar(contato:Contato): Observable<any>{
    return this.http.patch(`${this.url}/${contato.id}/favorito`, null);
  }

  uploadFoto(contato: Contato, formData:FormData): Observable<any>{
    return this.http.put(`${this.url}/${contato.id}/foto`, formData, {responseType: 'blob'});
  }
}
