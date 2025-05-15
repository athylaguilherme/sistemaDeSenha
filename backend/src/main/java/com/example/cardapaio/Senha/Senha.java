package com.example.cardapaio.Senha;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Senha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSenha;

    private String senha;
    private String tipoSenha;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dtEmissao;
    
    // Novos campos
    private String status; // "AGUARDANDO", "CHAMADA", "EM_ATENDIMENTO", "ATENDIDA"
    private String guiche; // Número do guichê que está atendendo
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dtChamada; // Data/hora em que a senha foi chamada
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dtInicio; // Data/hora de início do atendimento
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dtFim; // Data/hora de término do atendimento
}