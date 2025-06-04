package com.example.cardapaio.Senha;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SenhaRepository extends JpaRepository<Senha, Long> {
    
    // Encontrar senhas aguardando por tipo
    List<Senha> findByTipoSenhaAndStatusOrderByDtEmissaoAsc(String tipoSenha, String status);
    
    // Encontrar todas as senhas aguardando
    List<Senha> findByStatusOrderByDtEmissaoAsc(String status);
    
    // Encontrar a próxima senha preferencial
    Optional<Senha> findFirstByTipoSenhaAndStatusOrderByDtEmissaoAsc(String tipoSenha, String status);
    
    // Encontrar a próxima senha comum
    Optional<Senha> findFirstByStatusOrderByDtEmissaoAsc(String status);
    
    // Encontrar senha em atendimento por guichê
    Optional<Senha> findByGuicheAndStatus(String guiche, String status);
    
    // Contar senhas aguardando por tipo
    long countByTipoSenhaAndStatus(String tipoSenha, String status);
    
    // Contar todas as senhas aguardando
    long countByStatus(String status);
    
    // Encontrar todas as senhas chamadas recentemente (para o painel)
    List<Senha> findTop5ByStatusInOrderByDtChamadaDesc(List<String> statusList);

    Optional<Senha> findFirstByTipoSenhaOrderByIdSenhaDesc(String tipoSenha);
    boolean existsBySenha(String senha);
    List<Senha> findByTipoSenhaOrderByIdSenhaDesc(String tipoSenha);
}