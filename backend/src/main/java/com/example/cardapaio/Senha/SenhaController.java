package com.example.cardapaio.Senha;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/senhas")
public class SenhaController {
    private final SenhaService service;

    public SenhaController(SenhaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Senha> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Senha adicionar(@RequestBody Senha senha) {
        return service.adicionar(senha);
    }
}
