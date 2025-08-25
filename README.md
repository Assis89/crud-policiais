# CRUD de Policiais Militares

## Objetivo
Aplicação web moderna para cadastrar e listar policiais militares com os campos: RG civil, RG militar, CPF, Data de nascimento e Matrícula.


## Setup Automático (Windows)
1. Execute `setup.bat` para instalar todas as dependências
2. Execute `node gerar-chave.js` para gerar uma chave de criptografia
5. Execute `start-backend.bat` e `start-frontend.bat`

### Opção 2: Setup manual

1. **Configure o banco MySQL**:
   ```sql
   CREATE DATABASE CadastroPoliciais;
   USE CadastroPoliciais;
   -- Execute o conteúdo do arquivo backend/create_table.sql
   ```

2. **Configure o .env**:
   ```powershell
   # Gere uma chave forte:
   node gerar-chave.js
   # Cole a chave no backend/.env
   ```

3. **Backend**:
   ```powershell
   cd backend
   npm install
   npm start
   ```

4. **Frontend**:
   ```powershell
   cd frontend/policiais-app
   npm install
   npm start
   ```

## Banco de Dados
Tabela `policiais` com:
- id (PK, auto increment)
- rg_civil (varchar(20), único, obrigatório)
- rg_militar (varchar(20), único, obrigatório)
- cpf (varchar(14), único, obrigatório)
- data_nascimento (varbinary(255), obrigatório, criptografado)
- matricula (varbinary(255), obrigatório, criptografado)

Índices adicionais: `idx_cpf` em cpf e `idx_matricula` em matricula.

## Endpoints da API
- **POST /policiais** - Cadastrar policial
- **GET /policiais?cpf=...&rg=...** - Listar policiais com filtros opcionais
- **PUT /policiais/:id** - Atualizar policial
- **DELETE /policiais/:id** - Deletar policial 

## Nova Estrutura Frontend (Recriada do Zero)

### Páginas
- **Listagem** (`/policiais`): Tabela responsiva com filtros avançados por CPF/RG
- **Validações Avançadas**: CPF com formatação automática e validação
- **Lazy Loading**: Componentes carregados sob demanda
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **TypeScript Strict**: Tipagem forte em todo o código
- **Standalone Components**: Arquitetura moderna do Angular 19

- CPF com formatação automática (000.000.000-00)
- Validação de tamanho mínimo
- Mensagens de erro personalizadas
```
├── backend/
│   ├── src/
│   │   ├── server.js      # Servidor Express com CORS
│   ├── create_table.sql   # Script de criação da tabela
│   └── package.json
│   │   ├── services/      # Serviços HTTP
│   │   ├── pages/
│   │   │   ├── cadastro/  # Página de cadastro
│   │   │   └── listagem/  # Página de listagem
│   │   ├── app.component.ts
│   │   └── app-routing.ts # Rotas com lazy loading
│   ├── proxy.conf.json    # Proxy para o backend
│   └── package.json
├── setup.bat              # Setup automático
├── start-backend.bat      # Iniciar backend
├── start-frontend.bat     # Iniciar frontend
├── gerar-chave.js         # Gerador de chave
└── README.md
```

## Novidades da Versão Recriada ✅
- **Interface completamente redesenhada** com design moderno
- **Lazy loading** de componentes para melhor performance
- **Validações em tempo real** com feedback visual
- **Formatação automática** de CPF durante digitação
- **Design responsivo** otimizado para mobile e desktop
- **TypeScript strict** para maior segurança de tipos
- **Standalone components** seguindo as melhores práticas do Angular 19
- **Animações e transições** suaves para melhor UX
- **Filtros avançados** com limpeza automática de campos vazios

## Cores e Design
- **Gradiente principal**: Azul (#667eea) para roxo (#764ba2)
- **Cards com glassmorphism**: Fundo branco com transparência e blur
- **Botões com hover effects**: Animações suaves ao passar o mouse
- **Formulários modernos**: Bordas arredondadas e feedback visual
- **Tabelas responsivas**: Design limpo com hover effects

## Boas práticas implementadas
- Variáveis em `.env` via dotenv
- CPF validado com regex personalizada
- Matrícula e data de nascimento criptografadas com AES-256-GCM
- Tratamento de erros com mensagens claras
- CORS configurado para desenvolvimento
- Scripts de automação para Windows
- Lazy loading para otimização de performance
- TypeScript strict para maior segurança
