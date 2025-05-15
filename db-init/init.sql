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

-- Criando a tabela senha com todos os campos necessários
CREATE TABLE IF NOT EXISTS senha (
    id_senha SERIAL PRIMARY KEY,
    senha VARCHAR(20) NOT NULL,
    tipo_senha VARCHAR(20) NOT NULL,
    dt_emissao TIMESTAMP NOT NULL,
    status VARCHAR(20),
    guiche VARCHAR(20),
    dt_chamada TIMESTAMP,
    dt_inicio TIMESTAMP,
    dt_fim TIMESTAMP,

);

-- Inserindo os valores "ativo" e "inativo" se ainda não existirem
INSERT INTO status (status) VALUES ('Ativo') ON CONFLICT (status) DO NOTHING;
INSERT INTO status (status) VALUES ('Inativo') ON CONFLICT (status) DO NOTHING;

INSERT INTO profissional (nome,login,senha,status_id) VALUES('adm','adm','adm',1) ON CONFLICT (login) DO NOTHING;

ALTER TABLE senha ADD CONSTRAINT senha_unique UNIQUE (senha);
