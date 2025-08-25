🖥️ Frontend (Recriado do Zero)

Principais recursos:

📄 Listagem: /policiais → tabela responsiva com filtros avançados

✅ Validações avançadas: CPF formatado e validado automaticamente

🚀 Lazy Loading: componentes carregados sob demanda

📱 Responsivo: desktop e mobile

🛡️ TypeScript strict: tipagem forte

🧩 Standalone Components: arquitetura moderna Angular 19

💡 Validações CPF:

Formato automático: 000.000.000-00

Tamanho mínimo

Mensagens de erro personalizadas

Estrutura de Pastas
├── backend/
│   ├── src/
│   │   ├── server.js        # Servidor Express com CORS
│   ├── create_table.sql     # Script de criação da tabela
│   └── package.json
│       ├── services/        # Serviços HTTP
│       ├── pages/
│       │   ├── cadastro/    # Página de cadastro
│       │   └── listagem/    # Página de listagem
│       ├── app.component.ts
│       └── app-routing.ts   # Rotas com lazy loading
│   ├── proxy.conf.json      # Proxy para backend
│   └── package.json
├── setup.bat                # Setup automático
├── start-backend.bat        # Iniciar backend
├── start-frontend.bat       # Iniciar frontend
├── gerar-chave.js           # Gerador de chave
└── README.md

✨ Novidades da Versão Recriada

🎨 Interface moderna e redesenhada

⚡ Lazy loading de componentes → melhor performance

🛠️ Validações em tempo real com feedback visual

📝 Formatação automática de CPF durante digitação

📱 Design responsivo otimizado

🛡️ TypeScript strict para maior segurança

🧩 Standalone components seguindo melhores práticas Angular 19

🎞️ Animações e transições suaves

🔍 Filtros avançados com limpeza automática de campos vazios

🎨 Cores e Design

Gradiente principal: Azul (#667eea) → Roxo (#764ba2)

Cards com glassmorphism: fundo branco, transparência e blur

Botões com hover effects: animações suaves

Formulários modernos: bordas arredondadas e feedback visual

Tabelas responsivas: design limpo com hover effects

✅ Boas Práticas Implementadas

Variáveis em .env via dotenv

CPF validado com regex personalizada

Matrícula e data de nascimento criptografadas com AES-256-GCM

Tratamento de erros com mensagens claras

CORS configurado para desenvolvimento

Scripts de automação para Windows

Lazy loading para otimização de performance

TypeScript strict para maior segurança
