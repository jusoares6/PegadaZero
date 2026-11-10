# PegadaZero — MVP acadêmico

Aplicação React + Node/Express + MongoDB Atlas. O backend mantém a lógica do cálculo e os fatores internos; o frontend apenas coleta respostas e apresenta resultados.

## Pré-requisitos
- Node.js 20+ (recomendado Node 24 LTS/current compatível)
- VS Code
- Conta MongoDB Atlas e cluster criado

## 1. MongoDB Atlas
1. Crie um cluster no MongoDB Atlas.
2. Em Database Access, crie usuário e senha do banco (não é o login da conta Atlas).
3. Em Network Access, libere o IP da sua máquina. Para testes temporários, `0.0.0.0/0` permite qualquer IP; restrinja depois.
4. Clique em Connect > Drivers > Node.js e copie a connection string.

## 2. Backend
No terminal:
```bash
cd backend
npm install
```
Copie `.env.example` para `.env` e preencha `MONGODB_URI` e `JWT_SECRET`.
```bash
npm run dev
```
API: `http://localhost:3000`; teste `http://localhost:3000/api/health`.

Em outro terminal, para cadastrar missões e dicas iniciais (com backend parado ou em outro terminal):
```bash
cd backend
node src/data/seed.js
```

Testes do cálculo:
```bash
npm test
```

## 3. Frontend
Em outro terminal:
```bash
cd frontend
npm install
```
Copie `.env.example` para `.env`.
```bash
npm run dev
```
Acesse `http://localhost:5173`.

## 4. Fluxo inicial
1. Crie uma conta em `/cadastro`.
2. Faça um cálculo em Calculadora.
3. Consulte o Dashboard.
4. Conclua uma missão e confira a pontuação.
5. Consulte o Feed de dicas.

## Endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/calculations`, `GET /api/calculations/history`
- `GET /api/dashboard`
- `GET /api/missions`, `POST /api/missions/:id/complete`
- `GET /api/tips`

## Observações importantes para a entrega
- Os fatores em `backend/src/data/emissionFactors.js` são demonstrativos, não devem ser apresentados como dados científicos validados. Substitua-os por fatores com fonte bibliográfica confiável e registre a fonte no relatório.
- A documentação define cinco funcionalidades centrais do MVP. O registro de pontos está implementado como parte do módulo de Missões.
- O mapa de calor Electricity Maps ficou fora deste MVP inicial, conforme a decisão de priorizar as cinco funcionalidades e manter o cálculo independente de APIs externas.
- Para produção, acrescente validação de entrada mais completa, política de privacidade, recuperação de senha, logs e gestão segura de segredos. Nunca publique `.env` no Git.
