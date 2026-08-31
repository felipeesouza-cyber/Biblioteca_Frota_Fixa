import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request }) {
      const isLogged = !!auth?.user
      const isLogin = request.nextUrl.pathname.startsWith('/login')
      if (isLogin) return true
      return isLogged
    },
  },
  providers: [],
} satisfies NextAuthConfig
