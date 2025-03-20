package com.example.cardapaio.Profissional;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.cardapaio.Status.Status;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    private final ProfissionalService service;

    public ProfissionalController(ProfissionalService service) {
        this.service = service;
    }

    @GetMapping
    public List<Profissional> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Profissional adicionar(@RequestBody Profissional profissional) {
        return service.adicionar(profissional);
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticar(@RequestBody Profissional profissional) {
        Profissional encontrado = service.buscarPorLogin(profissional.getLogin());

        if (encontrado == null || !encontrado.getSenha().equals(profissional.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login ou senha incorretos!");
        }

        if (encontrado.getStatus() == null || !encontrado.getStatus().getStatus().equalsIgnoreCase("Ativo")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado! Seu status não está ativo.");
        }

        return ResponseEntity.ok(encontrado);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PutMapping("/{id}/alterar-status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id) {
        Profissional profissional = service.buscarPorId(id);

        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profissional não encontrado!");
        }

        if (profissional.getStatus() == null) {
            profissional.setStatus(service.buscarStatusPorId(1L)); // Define "Ativo"
        }

        // Buscar o novo status no banco
        Long novoStatusId = profissional.getStatus().getStatus().equalsIgnoreCase("Ativo") ? 2L : 1L;
        Status novoStatus = service.buscarStatusPorId(novoStatusId);

        if (novoStatus == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Status não encontrado no banco!");
        }

        profissional.setStatus(novoStatus);

        Profissional atualizado = service.alterar(profissional);
        return ResponseEntity.ok(atualizado);
    }

    @PutMapping("/{id}/alterar-dados")
    public ResponseEntity<?> alterarDados(@PathVariable Long id, @RequestBody Profissional profissionalAtualizado) {
        Profissional profissional = service.buscarPorId(id);

        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profissional não encontrado!");
        }

        profissional.setNome(profissionalAtualizado.getNome());
        profissional.setLogin(profissionalAtualizado.getLogin());
        profissional.setSenha(profissionalAtualizado.getSenha());

        Profissional atualizado = service.alterar(profissional);
        return ResponseEntity.ok(atualizado);
    }

}
