import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    name: 'Biblioteca Frota Fixa',
    credentials: { email: { label: 'E-mail', type: 'email' }, password: { label: 'Senha', type: 'password' } },
    async authorize(credentials) {
      const email = String(credentials?.email || '').toLowerCase().trim()
      const password = String(credentials?.password || '')
      const domainOk = email.endsWith('@mercadolivre.com') || email.endsWith('@mercadolibre.com')
      const adminEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim()
      const adminPassword = String(process.env.ADMIN_PASSWORD || '')
      if (domainOk && adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
        return { id: email, name: 'Administrador FF', email, role: 'ADMIN' }
      }
      return null
    },
  })],
  session: { strategy: 'jwt' },
})
