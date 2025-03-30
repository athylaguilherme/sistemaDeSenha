package com.example.cardapaio.Departamento;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    List<Departamento> findByDepartamento(String departamento);
}