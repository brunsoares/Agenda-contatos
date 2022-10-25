package io.github.brunnsoares.agendaapi.api.rest;

import io.github.brunnsoares.agendaapi.model.entity.Contato;
import io.github.brunnsoares.agendaapi.model.repository.ContatoRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

@RestController
@RequestMapping("/api/contatos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ContatoController {

    private final ContatoRepository repository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contato salvarContato(@RequestBody Contato contato){
        return repository.save(contato);
    }

    @GetMapping
    public Page<Contato> buscarContatos(
            @RequestParam(value = "pagina", defaultValue = "0") Integer pagina,
            @RequestParam(value = "tamanho", defaultValue = "10") Integer tamanho
    ){
        Sort sort = Sort.by(Sort.Direction.ASC,"id");
        PageRequest pageRequest = PageRequest.of(pagina, tamanho, sort);
        return repository.findAll(pageRequest);
    }

    @PatchMapping("{id}/favorito")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void favoritarContato(@PathVariable Integer id){
        Optional<Contato> contato = repository.findById(id);
        contato.ifPresent( c -> {
            boolean favorito = c.getFavorito() == Boolean.TRUE;
            c.setFavorito(!favorito);
            repository.save(c);
        });
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarContato(@PathVariable Integer id){
        repository.deleteById(id);
    }

    @PutMapping("{id}/foto")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public byte[] adicionarFoto(@PathVariable Integer id, @RequestParam("foto") Part foto){
        Optional<Contato> contato = repository.findById(id);
        return contato.map( c -> {
            try{
                InputStream input = foto.getInputStream();
                byte[] bytes = new byte[(int) foto.getSize()];
                IOUtils.readFully(input, bytes);
                c.setFoto(bytes);
                repository.save(c);
                input.close();
                return bytes;
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }).orElse(null);
    }


}
