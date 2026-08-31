# Biblioteca Frota Fixa

Projeto Next.js para a Biblioteca Frota Fixa.

## Deploy Vercel
- Framework: Next.js
- Build Command: `npm run build`
- O build executa `prisma generate && next build`
- Configure `DATABASE_URL` nas Environment Variables da Vercel.

## Estrutura
- app/: páginas do sistema
- lib/: cliente Prisma
- prisma/: schema e seed
- seed/: carga inicial
- auth.ts / auth.config.ts: autenticação
