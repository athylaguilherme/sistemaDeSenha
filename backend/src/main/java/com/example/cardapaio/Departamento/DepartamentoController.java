package com.example.cardapaio.Departamento;

import com.example.cardapaio.Status.Status;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/departamentos")
public class DepartamentoController {
    private final DepartamentoService service;

    public DepartamentoController(DepartamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Departamento> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Departamento adicionar(@RequestBody Departamento departamento) {
        return service.adicionar(departamento);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PutMapping("/{id}/alterar-status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id) {
        Departamento departamento = service.buscarPorId(id);

        if (departamento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Departamento não encontrado!");
        }

        if (departamento.getStatus() == null) {
            departamento.setStatus(service.buscarStatusPorId(1L)); // Define "Ativo"
        }

        // Buscar o novo status no banco
        Long novoStatusId = departamento.getStatus().getStatus().equalsIgnoreCase("Ativo") ? 2L : 1L;
        Status novoStatus = service.buscarStatusPorId(novoStatusId);

        if (novoStatus == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Status não encontrado no banco!");
        }

        departamento.setStatus(novoStatus);

        Departamento atualizado = service.alterar(departamento);
        return ResponseEntity.ok(atualizado);
    }

    @PutMapping("/{id}/alterar-dados")
    public ResponseEntity<?> alterarDados(@PathVariable Long id, @RequestBody Departamento departamentoAtualizado) {
        Departamento departamento = service.buscarPorId(id);

        if (departamento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("departamento não encontrado!");
        }

        departamento.setDepartamento(departamentoAtualizado.getDepartamento());

        Departamento atualizado = service.alterar(departamento);
        return ResponseEntity.ok(atualizado);
    }

}
