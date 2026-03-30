# 🍦 Sorveteria API

Back-end completo para gestão de sorveteria/açaí — vendas, gastos e dashboard financeiro.

---

## 📁 Estrutura do Projeto

```
sorveteria-api/
├── src/
│   ├── config/
│   │   └── database.js          # Conexão com MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Registro, login e perfil
│   │   ├── vendasController.js  # CRUD de vendas
│   │   ├── gastosController.js  # CRUD de gastos
│   │   └── dashboardController.js # Resumo financeiro
│   ├── middlewares/
│   │   ├── autenticar.js        # Validação JWT
│   │   └── errorHandler.js      # Tratamento global de erros
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Venda.js
│   │   └── Gasto.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vendasRoutes.js
│   │   ├── gastosRoutes.js
│   │   └── dashboardRoutes.js
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [MongoDB](https://www.mongodb.com/) local **ou** conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuito)

---

## 🚀 Passo a Passo para Rodar

### 1. Clone / extraia o projeto

```bash
cd sorveteria-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sorveteria
JWT_SECRET=troque_por_uma_chave_secreta_longa_e_aleatoria
JWT_EXPIRES_IN=7d
```

> 💡 **MongoDB Atlas (nuvem gratuita):** substitua `MONGODB_URI` pela string de conexão do Atlas, ex:
> `mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/sorveteria`

### 4. Inicie o servidor

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

Saída esperada:
```
✅ MongoDB conectado: localhost
🚀 Servidor rodando na porta 3000
📍 http://localhost:3000
```

---

## 🗺️ Mapa de Rotas

| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| GET | `/` | ❌ | Health check |
| POST | `/api/auth/registro` | ❌ | Criar conta |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/perfil` | ✅ | Dados do usuário logado |
| GET | `/api/vendas` | ✅ | Listar vendas (com filtro) |
| POST | `/api/vendas` | ✅ | Registrar venda |
| GET | `/api/vendas/:id` | ✅ | Buscar venda por ID |
| PUT | `/api/vendas/:id` | ✅ | Atualizar venda |
| DELETE | `/api/vendas/:id` | ✅ | Deletar venda |
| GET | `/api/gastos` | ✅ | Listar gastos (com filtro) |
| POST | `/api/gastos` | ✅ | Registrar gasto |
| GET | `/api/gastos/:id` | ✅ | Buscar gasto por ID |
| PUT | `/api/gastos/:id` | ✅ | Atualizar gasto |
| DELETE | `/api/gastos/:id` | ✅ | Deletar gasto |
| GET | `/api/dashboard` | ✅ | Resumo financeiro do mês |

---

## 📬 Exemplos de Requisições (Postman)

> **Base URL:** `http://localhost:3000`
>
> **Header para rotas autenticadas:**
> ```
> Authorization: Bearer SEU_TOKEN_AQUI
> Content-Type: application/json
> ```

---

### 🔐 Autenticação

#### Registro de usuário

```
POST /api/auth/registro
```

**Body (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@sorveteria.com",
  "senha": "senha123"
}
```

**Resposta (201):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário criado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "nome": "João Silva",
      "email": "joao@sorveteria.com"
    }
  }
}
```

---

#### Login

```
POST /api/auth/login
```

**Body (JSON):**
```json
{
  "email": "joao@sorveteria.com",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "nome": "João Silva",
      "email": "joao@sorveteria.com"
    }
  }
}
```

> 💡 Copie o `token` retornado e use em todas as rotas protegidas.

---

#### Perfil do usuário logado

```
GET /api/auth/perfil
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "dados": {
    "usuario": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "nome": "João Silva",
      "email": "joao@sorveteria.com",
      "criadoEm": "2024-06-01T12:00:00.000Z"
    }
  }
}
```

---

### 💰 Vendas

#### Registrar venda

```
POST /api/vendas
Authorization: Bearer SEU_TOKEN
```

**Body (JSON):**
```json
{
  "valor": 150.00,
  "descricao": "Vendas do turno da tarde",
  "data": "2024-06-15"
}
```

**Resposta (201):**
```json
{
  "sucesso": true,
  "mensagem": "Venda registrada com sucesso",
  "dados": {
    "venda": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0e",
      "valor": 150,
      "descricao": "Vendas do turno da tarde",
      "data": "2024-06-15T00:00:00.000Z",
      "usuario": "665f1a2b3c4d5e6f7a8b9c0d",
      "createdAt": "2024-06-15T18:00:00.000Z"
    }
  }
}
```

---

#### Listar vendas (todos os registros)

```
GET /api/vendas
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "dados": {
    "vendas": [ ... ],
    "paginacao": {
      "total": 25,
      "pagina": 1,
      "totalPaginas": 2,
      "porPagina": 20
    }
  }
}
```

---

#### Listar vendas com filtro por mês

```
GET /api/vendas?mes=6&ano=2024
Authorization: Bearer SEU_TOKEN
```

> Parâmetros disponíveis:
> - `mes` — número do mês (1–12)
> - `ano` — ano (padrão: ano atual)
> - `page` — página (padrão: 1)
> - `limit` — registros por página (padrão: 20)

---

#### Buscar venda por ID

```
GET /api/vendas/665f1a2b3c4d5e6f7a8b9c0e
Authorization: Bearer SEU_TOKEN
```

---

#### Atualizar venda

```
PUT /api/vendas/665f1a2b3c4d5e6f7a8b9c0e
Authorization: Bearer SEU_TOKEN
```

**Body (JSON):**
```json
{
  "valor": 180.00,
  "descricao": "Vendas do turno da tarde (corrigido)"
}
```

---

#### Deletar venda

```
DELETE /api/vendas/665f1a2b3c4d5e6f7a8b9c0e
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "mensagem": "Venda deletada com sucesso"
}
```

---

### 💸 Gastos

#### Registrar gasto

```
POST /api/gastos
Authorization: Bearer SEU_TOKEN
```

**Body (JSON):**
```json
{
  "valor": 80.00,
  "descricao": "Compra de insumos — polpa de açaí",
  "data": "2024-06-15"
}
```

---

#### Listar gastos com filtro por mês

```
GET /api/gastos?mes=6&ano=2024
Authorization: Bearer SEU_TOKEN
```

> Os mesmos parâmetros de paginação de vendas se aplicam aqui.

---

#### Atualizar gasto

```
PUT /api/gastos/665f1a2b3c4d5e6f7a8b9c0f
Authorization: Bearer SEU_TOKEN
```

**Body (JSON):**
```json
{
  "valor": 95.00,
  "descricao": "Compra de insumos — polpa de açaí (nota fiscal)"
}
```

---

#### Deletar gasto

```
DELETE /api/gastos/665f1a2b3c4d5e6f7a8b9c0f
Authorization: Bearer SEU_TOKEN
```

---

### 📊 Dashboard

#### Resumo financeiro do mês atual

```
GET /api/dashboard
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "dados": {
    "totalVendasMes": 3200.00,
    "totalGastosMes": 1150.00,
    "lucroMes": 2050.00,
    "evolucaoMensal": [
      { "mes": "Jan", "ano": 2024, "mesNumero": 1, "vendas": 2800, "gastos": 1000, "lucro": 1800 },
      { "mes": "Fev", "ano": 2024, "mesNumero": 2, "vendas": 3100, "gastos": 1200, "lucro": 1900 },
      { "mes": "Mar", "ano": 2024, "mesNumero": 3, "vendas": 2950, "gastos": 980,  "lucro": 1970 },
      { "mes": "Abr", "ano": 2024, "mesNumero": 4, "vendas": 3400, "gastos": 1300, "lucro": 2100 },
      { "mes": "Mai", "ano": 2024, "mesNumero": 5, "vendas": 3050, "gastos": 1100, "lucro": 1950 },
      { "mes": "Jun", "ano": 2024, "mesNumero": 6, "vendas": 3200, "gastos": 1150, "lucro": 2050 }
    ]
  }
}
```

---

## ❌ Padrão de Erros

Todos os erros seguem o mesmo formato:

```json
{
  "sucesso": false,
  "mensagem": "Descrição do erro aqui"
}
```

| Código | Situação |
|--------|----------|
| 400 | Dados inválidos ou ausentes |
| 401 | Não autenticado / token inválido |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: e-mail já cadastrado) |
| 500 | Erro interno do servidor |

---

## 🔧 Dicas para o Front-end React

### Configurar Axios com interceptor de token

```js
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### Exemplo de login

```js
const login = async (email, senha) => {
  const { data } = await api.post('/auth/login', { email, senha });
  localStorage.setItem('token', data.dados.token);
  return data.dados.usuario;
};
```

### Exemplo de buscar dashboard

```js
const getDashboard = async () => {
  const { data } = await api.get('/dashboard');
  return data.dados; // { totalVendasMes, totalGastosMes, lucroMes, evolucaoMensal }
};
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Node.js | v18+ | Runtime |
| Express | ^4.19 | Framework HTTP |
| Mongoose | ^8.4 | ODM para MongoDB |
| jsonwebtoken | ^9.0 | Autenticação JWT |
| bcryptjs | ^2.4 | Hash de senhas |
| cors | ^2.8 | Liberação de origens |
| dotenv | ^16.4 | Variáveis de ambiente |
| nodemon | ^3.1 | Hot-reload em dev |
