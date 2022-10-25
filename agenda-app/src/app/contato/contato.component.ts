import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private service: ContatoService,
    private builder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
  }

  submit(){
    this.montarContato();
    this.service.salvar(this.contato).subscribe(
      response => {
        let listaNova: Contato[] = [...this.contatos, response];
        this.contatos = listaNova;
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

  listarContatos(){
    this.service.listar().subscribe(
      response => {
        this.contatos = response;
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

}
