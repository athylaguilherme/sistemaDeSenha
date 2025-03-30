package com.example.cardapaio.repositories;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

import com.example.cardapaio.Departamento.Departamento;
import com.example.cardapaio.Departamento.DepartamentoRepository;

import jakarta.persistence.EntityManager;

@DataJpaTest
@ActiveProfiles("test")
public class DepartamentoRepositoryTest {

    @Autowired
    DepartamentoRepository departamentoRepository;

    @Autowired
    EntityManager entityManager;

    private Departamento createDepartamento(String departamento){
        Departamento nDepartamento = new Departamento();
        nDepartamento.setDepartamento(departamento);
        this.entityManager.persist(nDepartamento);
        return nDepartamento;
    }

    @Test
    @DisplayName("Consulta no bd pelo departamento com sucesso")
    /* Esse Metodo ele criar no bd de teste um departamento com nome "Recepção"
     * Depois ele busca o mesmo departamento e verificar se o resultado é o esperado
     */
    void findByDepartamentoSucess(){
        String dp = "Recepção";
        this.createDepartamento(dp);

        List<Departamento> result = this.departamentoRepository.findByDepartamento(dp);

        assertThat(result);
    }

    @Test
    @DisplayName("Consulta no bd por departamento que não existe")
    /* Esse metodo consulta no bd um departamento não existe, e verificar se
     * o retorno é vazio.
     */
    void findByDepartamentoErro(){
        String dp = "Recepção";

        List<Departamento> result = this.departamentoRepository.findByDepartamento(dp);

        assertThat(result.isEmpty()).isTrue();
    }

}
