package com.example.cardapaio.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.cardapaio.Profissional.Profissional;
import com.example.cardapaio.Profissional.ProfissionalRepository;
import com.example.cardapaio.Profissional.ProfissionalService;
import com.example.cardapaio.Status.Status;
import com.example.cardapaio.Status.StatusRepository;


@ExtendWith(MockitoExtension.class)
public class ProfissionalServiceTest {

    @Mock
    private ProfissionalRepository profissionalRepository;

    @Mock
    private StatusRepository statusRepository;

    @InjectMocks
    private ProfissionalService profissionalService;

    private Profissional profissional;
    private Status status;

    @BeforeEach
    void setUp() {
        status = new Status();
        status.setIdStatus(1L);
        status.setStatus("Ativo");

        profissional = new Profissional();
        profissional.setIdProfissional(1L);
        profissional.setNome("João Silva");
        profissional.setLogin("joao.silva");
        profissional.setSenha("senha123");
        profissional.setStatus(status);
    }

    // ========== TESTES DO CAMINHO FELIZ ==========

    @Test
    void listarTodos_deveRetornarListaDeProfissionais() {
        // Arrange
        List<Profissional> profissionais = Arrays.asList(
                profissional,
                new Profissional(2L, "Maria Sousa", "maria.sousa", "senha456", status)
        );
        when(profissionalRepository.findAll()).thenReturn(profissionais);

        // Act
        List<Profissional> resultado = profissionalService.listarTodos();

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("João Silva", resultado.get(0).getNome());
        assertEquals("Maria Sousa", resultado.get(1).getNome());
        verify(profissionalRepository, times(1)).findAll();
    }

    @Test
    void adicionar_comStatusExistente_deveSalvarProfissional() {
        // Arrange
        when(profissionalRepository.save(any(Profissional.class))).thenReturn(profissional);

        // Act
        Profissional resultado = profissionalService.adicionar(profissional);

        // Assert
        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        assertEquals("joao.silva", resultado.getLogin());
        assertEquals("senha123", resultado.getSenha());
        assertEquals(1L, resultado.getStatus().getIdStatus());
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
        // Não deve buscar status porque já estava definido
        verify(statusRepository, never()).findById(anyLong());
    }

    @Test
    void adicionar_semStatus_deveBuscarStatusPadrao() {
        // Arrange
        Profissional profSemStatus = new Profissional();
        profSemStatus.setIdProfissional(3L);
        profSemStatus.setNome("Carlos Mendes");
        profSemStatus.setLogin("carlos.mendes");
        profSemStatus.setSenha("senha789");
        // Status é nulo

        when(statusRepository.findById(1L)).thenReturn(Optional.of(status));
        when(profissionalRepository.save(any(Profissional.class))).thenAnswer(invocation -> {
            Profissional prof = invocation.getArgument(0);
            return prof; // Retorna o profissional que foi passado no save
        });

        // Act
        Profissional resultado = profissionalService.adicionar(profSemStatus);

        // Assert
        assertNotNull(resultado);
        assertEquals("Carlos Mendes", resultado.getNome());
        assertNotNull(resultado.getStatus());
        assertEquals(1L, resultado.getStatus().getIdStatus());
        assertEquals("Ativo", resultado.getStatus().getStatus());
        verify(statusRepository, times(1)).findById(1L);
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
    }

    @Test
    void buscarPorId_idExistente_deveRetornarProfissional() {
        // Arrange
        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));

        // Act
        Profissional resultado = profissionalService.buscarPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdProfissional());
        assertEquals("João Silva", resultado.getNome());
        assertEquals("joao.silva", resultado.getLogin());
        verify(profissionalRepository, times(1)).findById(1L);
    }

    @Test
    void buscarPorLogin_loginExistente_deveRetornarProfissional() {
        // Arrange
        when(profissionalRepository.findByLogin("joao.silva")).thenReturn(profissional);

        // Act
        Profissional resultado = profissionalService.buscarPorLogin("joao.silva");

        // Assert
        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        assertEquals("joao.silva", resultado.getLogin());
        verify(profissionalRepository, times(1)).findByLogin("joao.silva");
    }

    @Test
    void alterar_profissionalExistente_deveAtualizarProfissional() {
        // Arrange
        Profissional profAtualizado = new Profissional();
        profAtualizado.setIdProfissional(1L);
        profAtualizado.setNome("João Silva Atualizado");
        profAtualizado.setLogin("joao.silva");
        profAtualizado.setSenha("novaSenha123");
        profAtualizado.setStatus(status);

        when(profissionalRepository.save(any(Profissional.class))).thenReturn(profAtualizado);

        // Act
        Profissional resultado = profissionalService.alterar(profAtualizado);

        // Assert
        assertNotNull(resultado);
        assertEquals("João Silva Atualizado", resultado.getNome());
        assertEquals("novaSenha123", resultado.getSenha());
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
    }

    @Test
    void excluir_profissionalExistente_deveExcluirProfissional() {
        // Arrange
        doNothing().when(profissionalRepository).deleteById(1L);

        // Act
        profissionalService.excluir(1L);

        // Assert
        verify(profissionalRepository, times(1)).deleteById(1L);
    }

    @Test
    void buscarStatusPorId_deveRetornarStatus() {
        // Act
        Status resultado = profissionalService.buscarStatusPorId(1L);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdStatus());
        assertEquals("Ativo", resultado.getStatus());
    }

    // ========== TESTES DO CAMINHO RUIM ==========

    @Test
    void listarTodos_semProfissionais_deveRetornarListaVazia() {
        // Arrange
        when(profissionalRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Profissional> resultado = profissionalService.listarTodos();

        // Assert
        assertTrue(resultado.isEmpty());
        verify(profissionalRepository, times(1)).findAll();
    }

    @Test
    void adicionar_semStatusENemStatusPadrao_deveCriarNovoStatus() {
        // Arrange
        Profissional profSemStatus = new Profissional();
        profSemStatus.setIdProfissional(3L);
        profSemStatus.setNome("Ana Oliveira");
        profSemStatus.setLogin("ana.oliveira");
        profSemStatus.setSenha("senha321");
        // Status é nulo

        // Não encontra o status padrão de id 1
        when(statusRepository.findById(1L)).thenReturn(Optional.empty());
        
        // Simulando o save do Status
        when(statusRepository.save(any(Status.class))).thenAnswer(invocation -> {
            Status statusSalvo = invocation.getArgument(0);
            statusSalvo.setIdStatus(1L);
            return statusSalvo;
        });
        
        // Simulando o save do Profissional
        when(profissionalRepository.save(any(Profissional.class))).thenAnswer(invocation -> {
            return invocation.getArgument(0);
        });

        // Act
        Profissional resultado = profissionalService.adicionar(profSemStatus);

        // Assert
        assertNotNull(resultado);
        assertEquals("Ana Oliveira", resultado.getNome());
        assertNotNull(resultado.getStatus());
        assertEquals("Ativo", resultado.getStatus().getStatus());
        verify(statusRepository, times(1)).findById(1L);
        verify(statusRepository, times(1)).save(any(Status.class));
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
    }

    @Test
    void buscarPorId_idInexistente_deveRetornarNull() {
        // Arrange
        when(profissionalRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Profissional resultado = profissionalService.buscarPorId(999L);

        // Assert
        assertNull(resultado);
        verify(profissionalRepository, times(1)).findById(999L);
    }

    @Test
    void buscarPorLogin_loginInexistente_deveRetornarNull() {
        // Arrange
        when(profissionalRepository.findByLogin("inexistente")).thenReturn(null);

        // Act
        Profissional resultado = profissionalService.buscarPorLogin("inexistente");

        // Assert
        assertNull(resultado);
        verify(profissionalRepository, times(1)).findByLogin("inexistente");
    }

    @Test
    void excluir_idInexistente_deveLancarException() {
        // Arrange
        doThrow(new RuntimeException("Profissional não encontrado")).when(profissionalRepository).deleteById(999L);

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            profissionalService.excluir(999L);
        });
        
        assertEquals("Profissional não encontrado", exception.getMessage());
        verify(profissionalRepository, times(1)).deleteById(999L);
    }

    @Test
    void alterar_profissionalInexistente_deveLancarException() {
        // Arrange
        Profissional profInexistente = new Profissional();
        profInexistente.setIdProfissional(999L);
        profInexistente.setNome("Inexistente");
        profInexistente.setLogin("inexistente");
        profInexistente.setSenha("senha999");
        
        when(profissionalRepository.save(any(Profissional.class)))
            .thenThrow(new RuntimeException("Profissional não encontrado"));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            profissionalService.alterar(profInexistente);
        });
        
        assertEquals("Profissional não encontrado", exception.getMessage());
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
    }
}
