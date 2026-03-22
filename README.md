# Notification Backend

Backend em Node.js com PostgreSQL (Prisma), autenticação por API key, processamento assíncrono de mensagens, jobs agendados e documentação Swagger.

## Funcionalidades

- POST `/message`: cria mensagem para processamento assíncrono.
- GET `/message?id=...`: consulta `id`, `status`, `type` e `sendDate`.
- POST `/manager/key`: cria API key (somente com `IS_MANAGER_ON=true`).
- DELETE `/manager/key/:id`: remove API key (somente com `IS_MANAGER_ON=true`).
- Job de processamento a cada X minutos (`PROCESSING_INTERVAL_MINUTES`, padrão 2).
- Job diário às 20h (`CRON_DAILY_SUMMARY`) com resumo do dia anterior via WhatsApp para administrador.

## Tipos de envio

- `whatsapp` via API HTTP externa
- `email` via Resend
- `discord` via webhook do Discord

## Banco de dados (Prisma)

### Entidades

- `Message`
  - `id`
  - `createdAt`
  - `status` (`pending`, `sent`, `failure`)
  - `sendDate`
  - `title`
  - `text`
  - `type` (`discord`, `email`, `whatsapp`)
  - opcionais: `phone`, `email`, `discordWebhook`

- `ApiKey`
  - `id` (sequencial)
  - `keyHash` (chave armazenada criptografada)
  - `limitPerMinute`
  - `lastSend`
  - `totalMessages`
  - `name`

## Setup

1. Copiar o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Instalar dependências:

```bash
npm install
```

3. Gerar client Prisma e rodar migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. Iniciar em desenvolvimento:

```bash
npm run dev
```

## Swagger

Com a API rodando:

- `http://localhost:3000/docs`

## Exemplos

### Criar API key

```bash
curl -X POST http://localhost:3000/manager/key \
  -H "Content-Type: application/json" \
  -d '{"name":"cliente-a", "limit": 10}'
```

### Enviar mensagem

```bash
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_CHAVE" \
  -d '{
    "title":"Aviso",
    "text":"Teste de envio",
    "type":"whatsapp",
    "phone":"5511999999999"
  }'
```

### Consultar mensagem

```bash
curl "http://localhost:3000/message?id=<MESSAGE_ID>"
```

## Observações

- Processamento é assíncrono: a rota POST apenas enfileira no banco.
- Mensagens com status `pending` ou `failure` são reprocessadas pelo job.
- Se `IS_MANAGER_ON=false`, rotas de manager retornam `401`.
- Para WhatsApp, configure `WHATSAPP_API_URL` e `WHATSAPP_API_KEY` no `.env`.
