package com.example.cardapaio.Senha;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class SenhaService {
    private final SenhaRepository repository;

    // Constantes para status
    public static final String STATUS_AGUARDANDO = "AGUARDANDO";
    public static final String STATUS_CHAMADA = "CHAMADA";
    public static final String STATUS_EM_ATENDIMENTO = "EM_ATENDIMENTO";
    public static final String STATUS_ATENDIDA = "ATENDIDA";
    
    // Constantes para tipo de senha
    public static final String TIPO_PREFERENCIAL = "preferencial";
    public static final String TIPO_NORMAL = "normal";

    public SenhaService(SenhaRepository repository) {
        this.repository = repository;
    }

    public List<Senha> listarTodos() {
        return repository.findAll();
    }

    public Senha adicionar(Senha senha) {
    if (senha.getTipoSenha() == null || senha.getTipoSenha().isEmpty()) {
        throw new IllegalArgumentException("O tipo de senha não pode estar vazio!");
    }

    // Define campos iniciais
    senha.setDtEmissao(new Date());
    senha.setStatus(STATUS_AGUARDANDO);
    
    // Gerar o número da senha automaticamente
    gerarNumeroSenha(senha);
    
    return repository.save(senha);
}
    private void gerarNumeroSenha(Senha senha) {
    // Determinar o prefixo com base no tipo
    String tipoSenha = senha.getTipoSenha();
    String prefixo = tipoSenha.equalsIgnoreCase(TIPO_PREFERENCIAL) ? "P" : "N";
    
    // Buscar TODAS as senhas deste tipo
    List<Senha> senhasMesmoTipo = repository.findByTipoSenhaOrderByIdSenhaDesc(tipoSenha);
    
    int proximoNumero = 1; // Valor padrão
    
    // Percorrer todas as senhas para encontrar o maior número
    for (Senha senhaExistente : senhasMesmoTipo) {
        String numeroAtual = senhaExistente.getSenha();
        if (numeroAtual != null && numeroAtual.startsWith(prefixo) && numeroAtual.length() > 1) {
            try {
                int numero = Integer.parseInt(numeroAtual.substring(1));
                if (numero >= proximoNumero) {
                    proximoNumero = numero + 1; // Incrementa para o próximo número
                }
            } catch (NumberFormatException e) {
                // Ignora se não for um número válido
            }
        }
    }
    
    // Formatar o número com zeros à esquerda (3 dígitos)
    senha.setSenha(prefixo + String.format("%03d", proximoNumero));
    
    // Verificação adicional para garantir unicidade
    boolean senhaUnica = false;
    int tentativas = 0;
    
    while (!senhaUnica && tentativas < 100) { // Limite para evitar loop infinito
        final String senhaFinal = senha.getSenha(); // Criar uma variável final para uso no lambda
        boolean existe = repository.existsBySenha(senhaFinal);
        
        if (existe) {
            // Se a senha já existe, incrementar e tentar novamente
            proximoNumero++;
            senha.setSenha(prefixo + String.format("%03d", proximoNumero));
            tentativas++;
        } else {
            senhaUnica = true;
        }
    }
    
    if (!senhaUnica) {
        throw new RuntimeException("Não foi possível gerar uma senha única após múltiplas tentativas");
    }
}

    
    // Métodos para obter senhas em espera
    public List<Senha> listarSenhasPreferenciaisEmEspera() {
        return repository.findByTipoSenhaAndStatusOrderByDtEmissaoAsc(TIPO_PREFERENCIAL, STATUS_AGUARDANDO);
    }
    
    public List<Senha> listarSenhasComunsEmEspera() {
        return repository.findByTipoSenhaAndStatusOrderByDtEmissaoAsc(TIPO_NORMAL, STATUS_AGUARDANDO);
    }
    
    // Contagem de senhas em espera
    public long contarSenhasPreferenciaisEmEspera() {
        return repository.countByTipoSenhaAndStatus(TIPO_PREFERENCIAL, STATUS_AGUARDANDO);
    }
    
    public long contarSenhasComunsEmEspera() {
        return repository.countByTipoSenhaAndStatus(TIPO_NORMAL, STATUS_AGUARDANDO);
    }
    
    // Chamar próxima senha (com prioridade para preferenciais)
    @Transactional
    public Senha chamarProximaSenha(String guiche) {
        // Verificar se já existe uma senha em atendimento neste guichê
        Optional<Senha> senhaEmAtendimento = repository.findByGuicheAndStatus(guiche, STATUS_EM_ATENDIMENTO);
        if (senhaEmAtendimento.isPresent()) {
            throw new IllegalStateException("Já existe uma senha em atendimento no guichê " + guiche);
        }
        
        // Tentar obter uma senha preferencial primeiro
        Optional<Senha> proximaSenha = repository.findFirstByTipoSenhaAndStatusOrderByDtEmissaoAsc(
                TIPO_PREFERENCIAL, STATUS_AGUARDANDO);
        
        // Se não houver senha preferencial, pegar uma senha normal
        if (proximaSenha.isEmpty()) {
            proximaSenha = repository.findFirstByTipoSenhaAndStatusOrderByDtEmissaoAsc(
                    TIPO_NORMAL, STATUS_AGUARDANDO);
        }
        
        // Se ainda não houver senha, retornar null
        if (proximaSenha.isEmpty()) {
            return null;
        }
        
        // Atualizar a senha para chamada
        Senha senha = proximaSenha.get();
        senha.setStatus(STATUS_CHAMADA);
        senha.setGuiche(guiche);
        senha.setDtChamada(new Date());
        
        return repository.save(senha);
    }
    
    // Iniciar atendimento
    @Transactional
    public Senha iniciarAtendimento(Long idSenha) {
        Senha senha = repository.findById(idSenha)
                .orElseThrow(() -> new IllegalArgumentException("Senha não encontrada: " + idSenha));
        
        if (!STATUS_CHAMADA.equals(senha.getStatus())) {
            throw new IllegalStateException("Senha não está no estado CHAMADA");
        }
        
        senha.setStatus(STATUS_EM_ATENDIMENTO);
        senha.setDtInicio(new Date());
        
        return repository.save(senha);
    }
    
    // Finalizar atendimento
    @Transactional
    public Senha finalizarAtendimento(Long idSenha) {
        Senha senha = repository.findById(idSenha)
                .orElseThrow(() -> new IllegalArgumentException("Senha não encontrada: " + idSenha));
        
        if (!STATUS_EM_ATENDIMENTO.equals(senha.getStatus())) {
            throw new IllegalStateException("Senha não está em atendimento");
        }
        
        senha.setStatus(STATUS_ATENDIDA);
        senha.setDtFim(new Date());
        
        return repository.save(senha);
    }
    
    // Obter senha atual em atendimento em um guichê
    public Optional<Senha> getSenhaEmAtendimento(String guiche) {
        return repository.findByGuicheAndStatus(guiche, STATUS_EM_ATENDIMENTO);
    }
    
    // Obter lista de senhas para o painel
    public List<Senha> listarSenhasParaPainel() {
        return repository.findTop5ByStatusInOrderByDtChamadaDesc(
                Arrays.asList(STATUS_CHAMADA, STATUS_EM_ATENDIMENTO));
    }
    
    // Calcular tempo médio de atendimento (em minutos)
    public int calcularTempoMedioAtendimento() {
        // Implementação simplificada - em um sistema real você calcularia baseado nas senhas já atendidas
        return 5; // 5 minutos fixos por enquanto
    }
}