package com.example.cardapaio.service;

import com.example.cardapaio.Departamento.Departamento;
import com.example.cardapaio.Departamento.DepartamentoRepository;
import com.example.cardapaio.Departamento.DepartamentoService;
import com.example.cardapaio.Status.Status;
import com.example.cardapaio.Status.StatusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DepartamentoServiceTest {

    @Mock
    private DepartamentoRepository departamentoRepository;

    @Mock
    private StatusRepository statusRepository;

    @InjectMocks
    private DepartamentoService departamentoService;

    private Departamento departamento;
    private Status status;

    @BeforeEach
    void setUp() {
        status = new Status();
        status.setIdStatus(1L);
        status.setStatus("Ativo");

        departamento = new Departamento();
        departamento.setIdDepartamento(1L);
        departamento.setDepartamento("TI");
        departamento.setStatus(status);
    }

    // ========== TESTES DO CAMINHO FELIZ ==========

    @Test
    void listarTodos_deveRetornarListaDeDepartamentos() {
        // Arrange
        List<Departamento> departamentos = Arrays.asList(
                departamento,
                new Departamento(2L, "RH", status)
        );
        when(departamentoRepository.findAll()).thenReturn(departamentos);

        // Act
        List<Departamento> resultado = departamentoService.listarTodos();

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("TI", resultado.get(0).getDepartamento());
        assertEquals("RH", resultado.get(1).getDepartamento());
        verify(departamentoRepository, times(1)).findAll();
    }

    @Test
    void adicionar_comStatusExistente_deveSalvarDepartamento() {
        // Arrange
        when(departamentoRepository.save(any(Departamento.class))).thenReturn(departamento);

        // Act
        Departamento resultado = departamentoService.adicionar(departamento);

        // Assert
        assertNotNull(resultado);
        assertEquals("TI", resultado.getDepartamento());
        assertEquals(1L, resultado.getStatus().getIdStatus());
        verify(departamentoRepository, times(1)).save(any(Departamento.class));
        // Não deve buscar status porque já estava definido
        verify(statusRepository, never()).findById(anyLong());
    }

    @Test
    void adicionar_semStatus_deveBuscarStatusPadrao() {
        // Arrange
        Departamento depSemStatus = new Departamento();
        depSemStatus.setIdDepartamento(3L);
        depSemStatus.setDepartamento("REGULAÇÃO");
        // Status é nulo

        when(statusRepository.findById(1L)).thenReturn(Optional.of(status));
        when(departamentoRepository.save(any(Departamento.class))).thenAnswer(invocation -> {
            Departamento dep = invocation.getArgument(0);
            return dep; // Retorna o departamento que foi passado no save
        });

        // Act
        Departamento resultado = departamentoService.adicionar(depSemStatus);

        // Assert
        assertNotNull(resultado);
        assertEquals("REGULAÇÃO", resultado.getDepartamento());
        assertNotNull(resultado.getStatus());
        assertEquals(1L, resultado.getStatus().getIdStatus());
        assertEquals("Ativo", resultado.getStatus().getStatus());
        verify(statusRepository, times(1)).findById(1L);
        verify(departamentoRepository, times(1)).save(any(Departamento.class));
    }

    @Test
    void buscarPorId_idExistente_deveRetornarDepartamento() {
        // Arrange
        when(departamentoRepository.findById(1L)).thenReturn(Optional.of(departamento));

        // Act
        Departamento resultado = departamentoService.buscarPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdDepartamento());
        assertEquals("TI", resultado.getDepartamento());
        verify(departamentoRepository, times(1)).findById(1L);
    }

    @Test
    void alterar_departamentoExistente_deveAtualizarDepartamento() {
        // Arrange
        Departamento depAtualizado = new Departamento();
        depAtualizado.setIdDepartamento(1L);
        depAtualizado.setDepartamento("TI Atualizado");
        depAtualizado.setStatus(status);

        when(departamentoRepository.save(any(Departamento.class))).thenReturn(depAtualizado);

        // Act
        Departamento resultado = departamentoService.alterar(depAtualizado);

        // Assert
        assertNotNull(resultado);
        assertEquals("TI Atualizado", resultado.getDepartamento());
        verify(departamentoRepository, times(1)).save(any(Departamento.class));
    }

    @Test
    void excluir_departamentoExistente_deveExcluirDepartamento() {
        // Arrange
        doNothing().when(departamentoRepository).deleteById(1L);

        // Act
        departamentoService.excluir(1L);

        // Assert
        verify(departamentoRepository, times(1)).deleteById(1L);
    }

    @Test
    void buscarStatusPorId_deveRetornarStatus() {
        // Act
        Status resultado = departamentoService.buscarStatusPorId(1L);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdStatus());
        assertEquals("Ativo", resultado.getStatus());
    }

    // ========== TESTES DO CAMINHO RUIM ==========

    @Test
    void listarTodos_semDepartamentos_deveRetornarListaVazia() {
        // Arrange
        when(departamentoRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Departamento> resultado = departamentoService.listarTodos();

        // Assert
        assertTrue(resultado.isEmpty());
        verify(departamentoRepository, times(1)).findAll();
    }

    @Test
    void adicionar_semStatusENemStatusPadrao_deveCriarNovoStatus() {
        // Arrange
        Departamento depSemStatus = new Departamento();
        depSemStatus.setIdDepartamento(3L);
        depSemStatus.setDepartamento("Enfermagem");
        // Status é nulo

        // Não encontra o status padrão de id 1
        when(statusRepository.findById(1L)).thenReturn(Optional.empty());
        
        // Simulando o save do Status
        when(statusRepository.save(any(Status.class))).thenAnswer(invocation -> {
            Status statusSalvo = invocation.getArgument(0);
            statusSalvo.setIdStatus(1L);
            return statusSalvo;
        });
        
        // Simulando o save do Departamento
        when(departamentoRepository.save(any(Departamento.class))).thenAnswer(invocation -> {
            return invocation.getArgument(0);
        });

        // Act
        Departamento resultado = departamentoService.adicionar(depSemStatus);

        // Assert
        assertNotNull(resultado);
        assertEquals("Enfermagem", resultado.getDepartamento());
        assertNotNull(resultado.getStatus());
        assertEquals("Ativo", resultado.getStatus().getStatus());
        verify(statusRepository, times(1)).findById(1L);
        verify(statusRepository, times(1)).save(any(Status.class));
        verify(departamentoRepository, times(1)).save(any(Departamento.class));
    }

    @Test
    void buscarPorId_idInexistente_deveRetornarNull() {
        // Arrange
        when(departamentoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Departamento resultado = departamentoService.buscarPorId(999L);

        // Assert
        assertNull(resultado);
        verify(departamentoRepository, times(1)).findById(999L);
    }

    @Test
    void excluir_idInexistente_deveLancarException() {
        // Arrange
        doThrow(new RuntimeException("Departamento não encontrado")).when(departamentoRepository).deleteById(999L);

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            departamentoService.excluir(999L);
        });
        
        assertEquals("Departamento não encontrado", exception.getMessage());
        verify(departamentoRepository, times(1)).deleteById(999L);
    }

    @Test
    void alterar_departamentoInexistente_deveLancarException() {
        // Arrange
        Departamento depInexistente = new Departamento();
        depInexistente.setIdDepartamento(999L);
        depInexistente.setDepartamento("Inexistente");
        
        when(departamentoRepository.save(any(Departamento.class)))
            .thenThrow(new RuntimeException("Departamento não encontrado"));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            departamentoService.alterar(depInexistente);
        });
        
        assertEquals("Departamento não encontrado", exception.getMessage());
        verify(departamentoRepository, times(1)).save(any(Departamento.class));
    }
}
