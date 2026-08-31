import { signIn } from '@/auth'

export default function LoginPage(){
 async function login(formData: FormData){
  'use server'
  await signIn('credentials', { email: formData.get('email'), password: formData.get('password'), redirectTo: '/' })
 }
 return <main style={{maxWidth:460,margin:'12vh auto'}}><div className="card"><div className="hero"><h1>Biblioteca Frota Fixa</h1><p>Acesso restrito à gestão da Biblioteca FF.</p></div><form action={login} style={{display:'grid',gap:12,marginTop:20}}><input name="email" type="email" placeholder="E-mail" required/><input name="password" type="password" placeholder="Senha" required/><button type="submit">Entrar</button></form><p className="muted" style={{marginTop:14}}>Em produção, substitua o acesso local pelo provedor corporativo.</p></div></main>
}
