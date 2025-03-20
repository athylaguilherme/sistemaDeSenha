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


-- Inserindo os valores "ativo" e "inativo" se ainda não existirem
INSERT INTO status (status) VALUES ('Ativo') ON CONFLICT (status) DO NOTHING;
INSERT INTO status (status) VALUES ('Inativo') ON CONFLICT (status) DO NOTHING;

INSERT INTO profissional (nome,login,senha,status_id) VALUES('adm','adm','adm',1) ON CONFLICT (login) DO NOTHING;