# 🌱 PegadaZero

**Plataforma de conscientização e acompanhamento da pegada de carbono.**

## 1. Sobre o projeto

O PegadaZero é uma aplicação web desenvolvida com o objetivo de conscientizar os usuários sobre o impacto ambiental de suas atividades cotidianas.

A plataforma permite acompanhar estimativas de emissões de carbono, visualizar informações ambientais e descobrir práticas sustentáveis que podem ser incorporadas à rotina.

O projeto busca incentivar mudanças de hábitos por meio de informações, acompanhamento e gamificação.

## 2. Objetivos do projeto

- Conscientizar os usuários sobre as emissões de gases de efeito estufa.
- Permitir o cálculo estimado da pegada de carbono.
- Apresentar informações para apoiar decisões mais sustentáveis.
- Incentivar hábitos positivos por meio de missões e pontuação.
- Disponibilizar conteúdos educativos sobre sustentabilidade.

## 3. Funcionalidades

O PegadaZero possui as seguintes funcionalidades:

- **Autenticação de usuários:** cadastro, login e gerenciamento de acesso.
- **Calculadora de carbono:** estimativa das emissões relacionadas às atividades informadas pelo usuário.
- **Dashboard:** apresentação de indicadores e informações consolidadas.
- **Farol de Carbono:** classificação visual dos resultados mensais de emissões.
- **Mapa de calor:** visualização da intensidade de carbono da eletricidade, com integração à Electricity Maps API.
- **Missões sustentáveis:** desafios semanais com pontuação e acompanhamento de conclusão.
- **Dicas sustentáveis:** conteúdos educativos organizados por categorias, com indicação das fontes de referência.

## 4. Tecnologias utilizadas

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios
- React Leaflet
- Leaflet
- Lucide React

### Backend
- Node.js
- Express
- JavaScript
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- node-cron

### Ferramentas e serviços
- Git e GitHub
- MongoDB Atlas
- Electricity Maps API
- Visual Studio Code

## 5. Arquitetura e organização do projeto

O projeto utiliza uma arquitetura dividida em duas aplicações principais: frontend e backend.

- **Frontend:** responsável pela interface e interação com os usuários.
- **Backend:** responsável pelas regras de negócio, autenticação, processamento das informações e comunicação com o banco de dados.

### Estrutura de diretórios

```text
PegadaZero/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações e conexão com o banco
│   │   ├── controllers/     # Controle das requisições
│   │   ├── data/            # Dados iniciais e fatores de emissão
│   │   ├── middleware/      # Autenticação e validações
│   │   ├── models/          # Modelos do MongoDB
│   │   ├── routes/          # Rotas da API
│   │   └── services/        # Regras de negócio e serviços
│   └── tests/               # Testes automatizados
│
├── frontend/
│   └── src/
│       ├── components/      # Componentes reutilizáveis
│       ├── context/         # Contextos da aplicação
│       ├── pages/           # Páginas do sistema
│       └── services/        # Comunicação com a API
│
└── README.md
```

Cada diretório possui uma responsabilidade específica, facilitando a manutenção, organização e evolução do sistema.

## 6. Pré-requisitos

Para executar o projeto, é necessário possuir:

- Node.js e npm instalados.
- Acesso a uma instância MongoDB ou MongoDB Atlas.
- Git instalado.
- Navegador web atualizado.

## 7. Instalação e configuração

### 7.1. Clonar o repositório

```bash
git clone https://github.com/jusoares6/PegadaZero.git
cd PegadaZero
```

### 7.2. Configurar o backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na pasta `backend`, utilizando as seguintes variáveis como referência:

```env
PORT=3000
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta
CLIENT_URL=http://localhost:5173
```

Substitua os valores de exemplo pelas configurações do seu ambiente. Não compartilhe nem publique credenciais reais.

### 7.3. Configurar o frontend

Em outro terminal, acesse a pasta `frontend`:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 8. Execução do projeto

Para executar a aplicação, é necessário iniciar o backend e o frontend em terminais separados.

### Backend

Dentro da pasta `backend`, execute:

```bash
npm run dev
```

A API será disponibilizada em:

```text
http://localhost:3000
```

### Frontend

Dentro da pasta `frontend`, execute:

```bash
npm run dev
```

O Vite disponibilizará a aplicação no endereço:

```text
http://localhost:5173
```

## 9. Banco de dados

O projeto utiliza MongoDB para armazenar os dados da aplicação.

O Mongoose é utilizado para modelagem dos documentos e comunicação com o banco de dados.

O backend possui um script de carga inicial (`src/data/seed.js`), responsável por cadastrar ou atualizar os dados iniciais de missões e dicas sustentáveis.

## 10. Controle de versão e gerência de configuração

O projeto utiliza Git para controle de versão e GitHub para hospedagem do código-fonte.

O desenvolvimento é organizado por meio de branches específicas para implementação de funcionalidades, que posteriormente são integradas à branch principal (`main`).

O histórico de commits permite acompanhar a evolução do projeto, identificar alterações e manter o controle das versões do código.

**Repositório oficial:**

https://github.com/jusoares6/PegadaZero

### 10.1. Histórico de desenvolvimento

O desenvolvimento do PegadaZero foi acompanhado pelo Git, utilizando commits para registrar as principais etapas de implementação.

| Commit | Descrição |
|---|---|
| `5a4809b` | Inicialização da documentação e configuração do Git |
| `a17047d` | Implementação da estrutura do backend e APIs |
| `0d90de8` | Desenvolvimento da interface e navegação do sistema |
| `bd03aa7` | Implementação do mapa de calor e integração com Electricity Maps |
| `bfb92c3` | Implementação do Farol de classificação da pegada de carbono |
| `79fc1f6` | Implementação do sistema de missões semanais |
| `d912b21` | Atualização do feed de dicas sustentáveis |
| `28c44a3` | Atualização do README do projeto |

O histórico completo pode ser consultado na aba **Commits** do repositório no GitHub.

## 11. Integrantes

| Nome completo | Registro Acadêmico (RA) |
|---|---|
| Andrey Lourenço Amancio | 82414003 |
| Bernardo Palavizini | 82417582 |
| Julio Francisco Pellegrin | 824126434 |
| Julia dos Santos e Silva Soares | 82415277 |

## 12. Documentação complementar

O projeto conta com documentação complementar desenvolvida pela equipe, disponibilizada separadamente do repositório, incluindo:

- Documento de requisitos funcionais e não funcionais.
- Diagrama de casos de uso.
- Diagrama de classes.
- Diagramas de sequência.

Esses materiais documentam os requisitos, a estrutura e os principais fluxos de funcionamento da aplicação.

## 13. Considerações finais

O PegadaZero foi desenvolvido como um projeto acadêmico, aplicando conceitos de desenvolvimento web, integração entre frontend e backend, persistência de dados, controle de versão e sustentabilidade.

A plataforma demonstra como a tecnologia pode contribuir para a conscientização ambiental e incentivar práticas mais sustentáveis no cotidiano.