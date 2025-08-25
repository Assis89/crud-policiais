CREATE DATABASE CadastroPoliciais;
USE CadastroPoliciais;

CREATE TABLE policiais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rg_civil VARCHAR(20) NOT NULL UNIQUE,
    rg_militar VARCHAR(20) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento VARBINARY(255) NOT NULL,
    matricula VARCHAR(50)
);

-- Índices para otimizar consultas por CPF e matrícula
CREATE INDEX idx_cpf ON policiais (cpf);
CREATE INDEX idx_matricula ON policiais (matricula);
