# Cris Nogueira — Rendas & Sonhos

Sistema web de estoque preparado para GitHub, Vercel e PostgreSQL.

## Recursos

- Login administrativo com senha criptografada.
- Dashboard com produtos, itens, estoque baixo e valor de custo.
- Cadastro, edição, busca e exclusão lógica de produtos.
- Leitura de código de barras com bipador USB.
- Entradas e saídas com atualização automática.
- Bloqueio de saída acima do saldo.
- Histórico com usuário, data, saldo anterior e saldo posterior.
- Layout responsivo em bege, rosa-claro e branco.

## 1. Rodar no computador

Instale Node.js 20 ou superior.

```bash
npm install
```

Copie `.env.example` para `.env.local` e preencha as variáveis.

```bash
npm run dev
```

## 2. Criar o banco pela Vercel

1. Importe o repositório do GitHub na Vercel.
2. No projeto, abra **Storage** ou **Marketplace**.
3. Adicione um banco PostgreSQL, como Neon.
4. Confirme que a conexão foi adicionada como `DATABASE_URL`.
5. Cadastre também:
   - `SESSION_SECRET`
   - `SETUP_KEY`
   - `ADMIN_NAME`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
6. Faça um novo deploy após alterar as variáveis.

## 3. Instalar as tabelas

Após o deploy, execute uma única vez no PowerShell, trocando os valores:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri "https://SEU-PROJETO.vercel.app/api/setup" `
  -Headers @{ "x-setup-key" = "SUA_SETUP_KEY" }
```

Resposta esperada:

```json
{
  "success": true,
  "message": "Banco instalado e usuário administrador configurado."
}
```

Depois, acesse `/login` usando `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

## 4. Enviar ao GitHub

```bash
git init
git add .
git commit -m "Sistema de estoque Cris Nogueira"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

## Bipador

O leitor USB normalmente atua como teclado. Na página **Bipar / Movimentar**, clique no campo, leia o código e pressione Enter. Muitos leitores já enviam Enter automaticamente após a leitura.

## Segurança

- Nunca envie `.env.local` ao GitHub.
- Use senhas fortes.
- Troque `SETUP_KEY` depois da instalação ou remova-a das variáveis.
- Para produção comercial, configure backups periódicos no provedor PostgreSQL.
