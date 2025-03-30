package com.example.cardapaio.Senha;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SenhaService {
    private final SenhaRepository repository;

    public SenhaService(SenhaRepository repository) {
        this.repository = repository;
    }

    public List<Senha> listarTodos() {
        return repository.findAll();
    }

    public Senha adicionar(Senha senha) {
        if (senha.getSenha() == null || senha.getSenha().isEmpty()) {
            throw new IllegalArgumentException("A senha não pode estar vazia!");
        }

        // Se a data não for fornecida, define automaticamente
        if (senha.getDtEmissao() == null) {
            senha.setDtEmissao(new Date());
        }

        return repository.save(senha);
    }
}
