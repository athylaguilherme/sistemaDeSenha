package com.example.cardapaio.Senha;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8000") // Atualize para a porta correta do seu frontend
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
    
    // Endpoint para chamar próxima senha
    @PostMapping("/chamar")
    public ResponseEntity<?> chamarProximaSenha(@RequestParam String guiche) {
        try {
            Senha senha = service.chamarProximaSenha(guiche);
            if (senha == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Não há senhas em espera");
                return ResponseEntity.ok().body(response);
            }
            return ResponseEntity.ok(senha);
        } catch (IllegalStateException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Endpoint para iniciar atendimento
    @PostMapping("/{id}/iniciar")
    public ResponseEntity<?> iniciarAtendimento(@PathVariable Long id) {
        try {
            Senha senha = service.iniciarAtendimento(id);
            return ResponseEntity.ok(senha);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Endpoint para finalizar atendimento
    @PostMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizarAtendimento(@PathVariable Long id) {
        try {
            Senha senha = service.finalizarAtendimento(id);
            return ResponseEntity.ok(senha);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Endpoint para obter senha em atendimento em um guichê
    @GetMapping("/guiche/{guiche}")
    public ResponseEntity<?> getSenhaEmAtendimento(@PathVariable String guiche) {
        Optional<Senha> senhaOpt = service.getSenhaEmAtendimento(guiche);
        if (senhaOpt.isPresent()) {
            return ResponseEntity.ok(senhaOpt.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Nenhuma senha em atendimento no guichê " + guiche);
            return ResponseEntity.ok(response);
        }
    }
    
    // Endpoint para obter lista de senhas para o painel
    @GetMapping("/painel")
    public List<Senha> listarSenhasParaPainel() {
        return service.listarSenhasParaPainel();
    }
    
    // Endpoint para obter estatísticas
    @GetMapping("/estatisticas")
    public Map<String, Object> getEstatisticas() {
        Map<String, Object> estatisticas = new HashMap<>();
        
        estatisticas.put("senhasPreferenciaisEmEspera", service.contarSenhasPreferenciaisEmEspera());
        estatisticas.put("senhasComunsEmEspera", service.contarSenhasComunsEmEspera());
        estatisticas.put("totalEmEspera", 
                service.contarSenhasPreferenciaisEmEspera() + service.contarSenhasComunsEmEspera());
        estatisticas.put("tempoMedioAtendimento", service.calcularTempoMedioAtendimento());
        
        return estatisticas;
    }
    
    // Adicionar endpoints para listar senhas em espera por tipo
    @GetMapping("/preferencial/espera")
    public List<Senha> listarSenhasPreferenciaisEmEspera() {
        return service.listarSenhasPreferenciaisEmEspera();
    }
    
    @GetMapping("/comum/espera")
    public List<Senha> listarSenhasComunsEmEspera() {
        return service.listarSenhasComunsEmEspera();
    }
    
    // Contador de senhas em espera por tipo
    @GetMapping("/preferencial/contador")
    public ResponseEntity<Map<String, Long>> contarSenhasPreferenciaisEmEspera() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", service.contarSenhasPreferenciaisEmEspera());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/comum/contador")
    public ResponseEntity<Map<String, Long>> contarSenhasComunsEmEspera() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", service.contarSenhasComunsEmEspera());
        return ResponseEntity.ok(response);
    }
}