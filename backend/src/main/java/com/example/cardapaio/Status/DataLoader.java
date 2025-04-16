package com.example.cardapaio.Status;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(StatusRepository statusRepository) {
        return args -> {
            // Verifica se os status já existem no banco
            if (statusRepository.count() == 0) {
                // Inserir "Ativo" na linha 1
                Status ativo = new Status();
                ativo.setStatus("Ativo");
                statusRepository.save(ativo);

                // Inserir "Desativo" na linha 2
                Status desativo = new Status();
                desativo.setStatus("Desativo");
                statusRepository.save(desativo);

                System.out.println("Status 'Ativo' e 'Desativo' foram inseridos no banco!");
            } else {
                System.out.println("Os status já existem no banco.");
            }
        };
    }
}
