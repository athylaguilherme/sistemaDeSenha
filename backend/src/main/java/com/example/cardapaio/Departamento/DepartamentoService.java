package com.example.cardapaio.Departamento;

import com.example.cardapaio.Status.Status;

import org.springframework.stereotype.Service;

import com.example.cardapaio.Status.StatusRepository;

import java.util.List;

@Service
public class DepartamentoService {
    private final DepartamentoRepository repository;
    private final StatusRepository statusRepository;

    public DepartamentoService(DepartamentoRepository repository, StatusRepository statusRepository) {
        this.repository = repository;
        this.statusRepository = statusRepository;
    }

    public List<Departamento> listarTodos() {
        return repository.findAll();
    }

    public Departamento adicionar(Departamento departamento) {
        // Verifica se o status já existe, senão cria um padrão
        if (departamento.getStatus() == null || departamento.getStatus().getIdStatus() == null) {
            Status statusPadrao = statusRepository.findById(1L).orElse(null);
            if (statusPadrao == null) {
                statusPadrao = new Status();
                statusPadrao.setStatus("Ativo"); // Define um status padrão
                statusPadrao = statusRepository.save(statusPadrao);
            }
            departamento.setStatus(statusPadrao);
        }
        return repository.save(departamento);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Status buscarStatusPorId(long id) {
        // Implement the method to fetch Status by id
        // This is just a placeholder implementation
        return new Status(id, id == 1L ? "Ativo" : "Inativo");
    }

    public Departamento alterar(Departamento departamento) {
        return repository.save(departamento);
    }

    public Departamento buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

}
