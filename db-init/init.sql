-- Criando a tabela status se não existir
CREATE TABLE IF NOT EXISTS status (
    id_status SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS profissional (
    id_profissional SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(50) NOT NULL,
    status_id BIGINT NOT NULL
);

-- Criando a tabela senha com todos os campos necessários (SEM vírgula extra)
CREATE TABLE IF NOT EXISTS senha (
    id_senha SERIAL PRIMARY KEY,
    senha VARCHAR(20) NOT NULL,
    tipo_senha VARCHAR(20) NOT NULL,
    dt_emissao TIMESTAMP NOT NULL,
    status VARCHAR(20),
    guiche VARCHAR(20),
    dt_chamada TIMESTAMP,
    dt_inicio TIMESTAMP,
    dt_fim TIMESTAMP
);

-- Inserindo os valores de status
INSERT INTO status (status) VALUES ('Ativo') ON CONFLICT (status) DO NOTHING;
INSERT INTO status (status) VALUES ('Desativo') ON CONFLICT (status) DO NOTHING;

-- Aguardar um pouco para garantir que a transação dos status foi commitada
SELECT pg_sleep(1);

-- Inserir profissional com tratamento de erro
DO $$
BEGIN
    -- Verificar se o usuário já existe
    IF NOT EXISTS (SELECT 1 FROM profissional WHERE login = 'adm') THEN
        INSERT INTO profissional (nome, login, senha, status_id) 
        VALUES ('Administrador', 'adm', 'adm', 1);
        RAISE NOTICE 'Usuário administrador criado com sucesso!';
    ELSE
        RAISE NOTICE 'Usuário administrador já existe!';
    END IF;
END $$;

-- Adicionando constraint unique na senha
ALTER TABLE senha ADD CONSTRAINT IF NOT EXISTS senha_unique UNIQUE (senha);