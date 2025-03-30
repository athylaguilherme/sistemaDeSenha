package com.example.cardapaio.Profissional;

import com.example.cardapaio.Status.Status;

import org.springframework.stereotype.Service;

import com.example.cardapaio.Status.StatusRepository;

import java.util.List;

@Service
public class ProfissionalService {
    private final ProfissionalRepository repository;
    private final StatusRepository statusRepository;

    public ProfissionalService(ProfissionalRepository repository, StatusRepository statusRepository) {
        this.repository = repository;
        this.statusRepository = statusRepository;
    }

    public List<Profissional> listarTodos() {
        return repository.findAll();
    }

    public Profissional adicionar(Profissional profissional) {
        // Verifica se o status já existe, senão cria um padrão
        if (profissional.getStatus() == null || profissional.getStatus().getIdStatus() == null) {
            Status statusPadrao = statusRepository.findById(1L).orElse(null);
            if (statusPadrao == null) {
                statusPadrao = new Status();
                statusPadrao.setStatus("Ativo"); // Define um status padrão
                statusPadrao = statusRepository.save(statusPadrao);
            }
            profissional.setStatus(statusPadrao);
        }
        return repository.save(profissional);
    }

    public Profissional buscarPorLogin(String login) {
        return repository.findByLogin(login);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Status buscarStatusPorId(long id) {
        // Implement the method to fetch Status by id
        // This is just a placeholder implementation
        return new Status(id, id == 1L ? "Ativo" : "Inativo");
    }

    public Profissional alterar(Profissional profissional) {
        return repository.save(profissional);
    }

    public Profissional buscarPorId(Long id) {
        return repository.findById(id).orElse(null); // Retorna nulo se não encontrar
    }

}
