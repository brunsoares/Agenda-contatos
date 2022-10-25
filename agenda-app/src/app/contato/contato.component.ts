import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contato: Contato;
  contatos: Contato[] = [];
  ordemColunas = ['foto','id', 'nome', 'email', 'favorito'];
  totalElementos = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptions: number[] = [10];

  constructor(
    private service: ContatoService,
    private builder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos(this.pagina, this.tamanho);
  }

  submit(){
    this.montarContato();
    this.service.salvar(this.contato).subscribe(
      response => {
        this.listarContatos();
        this.snackBar.open("Contato adicionado com sucesso!",'Sucesso',{
          duration: 2000
        });
        this.formulario.reset();
      })
  }

  montarContato(){
    const formularioValores = this.formulario.value;
    this.contato = new Contato(formularioValores.nome, formularioValores.email);
  }

  montarFormulario(){
    this.formulario = this.builder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    });
  }

  listarContatos(pagina=0, tamanho=10){
    this.service.listar(pagina, tamanho).subscribe(
      response => {
        this.contatos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
      }
    );
  }

  favoritar(contatoFavorito:Contato){
    this.service.favoritar(contatoFavorito).subscribe(
      response => {
        contatoFavorito.favorito = !contatoFavorito.favorito;
      }
    );
  }

  uploadFoto(event, contato:Contato){
    const arquivos = event.target.files;
    if(arquivos){
      const foto = arquivos[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service.uploadFoto(contato, formData).subscribe(
        response =>{
          this.listarContatos();
        }
      );
    }
  }

  detalhesContato(contato:Contato){
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    })
  }

  paginar(event: PageEvent){
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho);
  }

}
