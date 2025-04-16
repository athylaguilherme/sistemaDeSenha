package com.example.cardapaio.Profissional;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    List<Profissional> findByNome(String nome);

    Profissional findByLogin(String login);
}