package io.github.brunnsoares.agendaapi.model.repository;

import io.github.brunnsoares.agendaapi.model.entity.Contato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContatoRepository extends JpaRepository<Contato, Integer> {
}
