# Node + Jest Testing Demo

Este projeto demonstra de forma simples como utilizar **Node.js**, **Express** e **Jest** para criar e testar uma pequena aplicação web.

O mesmo foi publicado e está disponível no Render a partir deste [link](https://bit.ly/jest-tests).

O objetivo é mostrar **como escrever, executar e validar testes unitários e de integração** em JavaScript, bem como disponibilizar o projeto online através do **Render**.

---

## Funcionalidades

- API simples com operações matemáticas (`add` e `subtract`)
- Testes unitários e de integração com **Jest** e **Supertest**
- Interface web minimalista (HTML + CSS)

---

## Estrutura do Projeto

```
node-jest-demo/
├── public/            # Página HTML e estilos
├── src/               # Código-fonte da aplicação
│   ├── app.js         # Configuração do Express
│   ├── server.js      # Ponto de entrada do servidor
│   ├── math.js        # Funções matemáticas testadas
│   └── routes/
│       └── mathRoutes.js
├── tests/             # Testes Jest
│   └── math.test.js
├── jest.config.js     # Configuração do Jest
├── render.yaml        # Configuração do Render
├── README.md
├── package-lock.json
└── package.json
```

---

## Instalação e Execução Local

1. Clonar o repositório:
   ```bash
   git clone https://github.com/t2ne/jest-test
   cd jest-test
   ```

2. Instalar dependências:
   ```bash
   npm install
   ```

3. Correr o servidor localmente:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

4. Executar os testes:
   ```bash
   npm test
   ```

---

## Testes com Jest

O **Jest** é usado para garantir que as funções e endpoints funcionam corretamente.

Exemplos incluídos:
- Testes unitários para `add()` e `subtract()`
- Testes de integração aos endpoints `/api/add` e `/api/subtract`

```bash
npm test
```

Saída esperada:
```
 PASS  tests/math.test.js
  Math module
    ✓ add() should sum two numbers
    ✓ subtract() should subtract correctly
    ✓ should throw error for invalid input
  Math API endpoints
    ✓ GET /api/add returns correct result
    ✓ GET /api/subtract returns correct result
```

---

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)
- [Render](https://render.com)

---

## Autores

- [t2ne](https://github.com/t2ne)
- [Renaxpto](https://github.com/Renaxpto)
