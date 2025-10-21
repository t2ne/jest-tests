# Mini Testes de JavaScript

Uma plataforma interativa para aprender e testar JavaScript, com dashboard administrativo para acompanhar o progresso dos alunos. Construída com **Node.js**, **Express**, **Jest** e **Tailwind CSS**.

**Demo ao vivo:** [jest.t2ne.eu](https://jest.t2ne.eu)

---

## Funcionalidades

### **Para Estudantes:**

- Interface moderna e responsiva com Tailwind CSS
- Sistema de autenticação por número de aluno
- 3 exercícios interativos de JavaScript:
  - Conversão Celsius ↔ Fahrenheit
  - Verificação de Palíndromos
  - Soma de Arrays
- Execução segura de código no browser
- Sistema de progresso local (localStorage)
- Feedback visual em tempo real

### **Para Administradores:**

- Dashboard protegido com autenticação HTTP Basic
- Visualização de todas as submissions dos alunos
- Estatísticas em tempo real (progresso, taxa de sucesso)
- Visualização do código submetido por cada aluno
- Interface administrativa moderna
- Auto-refresh automático

### **Sistema de Testes:**

- **77 testes Jest** abrangentes
- Testes de integração com Supertest
- Cobertura completa de APIs e funcionalidades
- Testes de performance e segurança
- Validação de dados e edge cases

---

## Estrutura do Projeto

```
eqs/
├── public/                  # Assets estáticos servidos
│   ├── index.html           # Página principal dos exercícios
│   ├── admin.html           # Dashboard administrativo
│   ├── admin.js             # JavaScript do dashboard
│   ├── exercises.js         # JavaScript dos exercícios (copiado)
│   └── tailwind.css         # CSS compilado
├── src/                     # Código-fonte
│   ├── app.js               # Configuração Express + API routes
│   ├── server.js            # Servidor HTTP
│   ├── frontend/            # Frontend JavaScript
│   │   └── exercises.js     # Lógica dos exercícios (source)
│   └── styles/              # Estilos CSS
│       └── tailwind.css     # Tailwind source
├── tests/                   # 71 testes Jest
│   ├── app.test.js          # Testes de integração
│   ├── utils.test.js        # Testes de utilidades
│   ├── validation.test.js   # Testes de validação
│   ├── frontend.test.js     # Testes do frontend
│   └── integration.test.js  # Testes de performance
├── .env                     # Variáveis de ambiente (local)
├── .env.example             # Template para variáveis
├── jest.config.js           # Configuração Jest
├── tailwind.config.js       # Configuração Tailwind
├── render.yaml              # Deploy no Render
└── package.json             # Dependências e scripts
```

---

## Instalação e Execução Local

### 1. **Clonar o repositório:**

```bash
git clone https://github.com/t2ne/jest-tests
cd jest-tests
```

### 2. **Instalar dependências:**

```bash
npm install
```

### 3. **Configurar variáveis de ambiente:**

```bash
cp .env.example .env
# Editar .env com as suas credenciais admin
```

**Conteúdo do `.env`:**

```env
ADMIN_USERNAME=um_username
ADMIN_PASSWORD=uma_password
PORT=3000
```

### 4. **Build do css:**

```bash
npm run build:css     # Compila Tailwind CSS
```

### 5. **Executar testes:**

```bash
npm test            # 77 testes Jest
```

### 6. **Executar em desenvolvimento:**

```bash
npm run dev         # Servidor + watch CSS
# ou
npm start           # Apenas servidor
```

**Acesso local:**

- **Estudantes:** `http://localhost:3000`
- **Admin:** `http://localhost:3000/admin`

---

## APIs Disponíveis

### **Públicas:**

- `GET /` - Página principal dos exercícios
- `POST /api/submissions` - Submeter exercício (estudantes)
- `GET /api/submissions/:studentId` - Submissions de aluno específico

### **Protegidas (HTTP Basic Auth):**

- `GET /admin` - Dashboard administrativo
- `GET /api/admin/submissions` - Todas as submissions (admin)

**Exemplo de uso:**

```bash
# Sem autenticação (401 Unauthorized)
curl https://jest.t2ne.eu/api/admin/submissions

# Com autenticação (200 OK)
curl -u admin:password https://jest.t2ne.eu/api/admin/submissions
```

---

## Sistema de Testes

### **Cobertura dos testes (71 total):**

- **`app.test.js`** - Testes de integração Express (14 testes)
- **`utils.test.js`** - Funções utilitárias (15 testes)
- **`validation.test.js`** - Validação e lógica de negócio (17 testes)
- **`frontend.test.js`** - Lógica do frontend (12 testes)
- **`integration.test.js`** - Performance e integração (17 testes)

**Executar testes:**

```bash
npm test                    # Todos os testes
npm test -- app.test.js    # Testes específicos
npm test -- --verbose      # Output detalhado
```

---

## Como Usar (Estudantes)

1. **Aceder à aplicação**
2. **Inserir número de aluno** (5 dígitos)
3. **Escolher exercício** para resolver
4. **Escrever código** JavaScript
5. **Executar** e ver resultados em tempo real
6. **Progresso guardado** automaticamente

### **Exercícios disponíveis:**

1. **Celsius ↔ Fahrenheit** - Conversão de temperaturas
2. **Palíndromos** - Verificação de strings
3. **Soma Arrays** - Operações matemáticas

---

## Dashboard Admin

**Acesso:** `/admin` (requer autenticação)

**Funcionalidades:**

- Estatísticas em tempo real
- Lista de todos os alunos
- Código submetido por exercício
- Estado dos exercícios (completo/pendente)
- Auto-refresh (30 segundos)
- Taxa de sucesso global

---

## Segurança

- Autenticação HTTP Basic para rotas admin
- Validação de input nos exercícios
- Sanitização de código executado
- Headers Express ocultados
- Variáveis de ambiente para credenciais
- Proteção contra XSS e code injection

---

## Scripts Disponíveis

```bash
npm start             # Produção
npm run dev           # Desenvolvimento (nodemon)
npm test              # Executar testes Jest
npm run build:css     # Compilar Tailwind CSS
npm run dev:css       # Watch mode CSS
npm run render-build  # Build completo para Render
```

---

## Tecnologias

- **Backend:** Node.js, Express.js, dotenv
- **Frontend:** Vanilla JavaScript, Tailwind CSS
- **Testing:** Jest, Supertest
- **Deploy:** Render.com
- **Segurança:** HTTP Basic Authentication

---

## Autores

- [t2ne](https://github.com/t2ne)
- [Renaxpto](https://github.com/Renaxpto)