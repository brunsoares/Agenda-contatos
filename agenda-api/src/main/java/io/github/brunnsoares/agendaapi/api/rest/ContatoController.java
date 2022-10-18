package io.github.brunnsoares.agendaapi.api.rest;

import io.github.brunnsoares.agendaapi.model.entity.Contato;
import io.github.brunnsoares.agendaapi.model.repository.ContatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contatos")
@RequiredArgsConstructor
public class ContatoController {

    private final ContatoRepository repository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contato salvarContato(@RequestBody Contato contato){
        return repository.save(contato);
    }

    @GetMapping
    public List<Contato> buscarContatos(){
        return repository.findAll();
    }

    @PatchMapping("{id}/favorito")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void favoritarContato(@PathVariable Integer id, @RequestBody Boolean favorito){
        Optional<Contato> contato = repository.findById(id);
        contato.ifPresent( c -> {
            c.setFavorito(favorito);
            repository.save(c);
        });
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarContato(@PathVariable Integer id){
        repository.deleteById(id);
    }


}
