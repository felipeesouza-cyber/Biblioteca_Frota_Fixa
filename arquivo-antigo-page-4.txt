import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ImportPage(){
 const session=await auth(); if(!session) redirect('/login')
 return <><div className="hero"><h1>Importar base</h1><p>Atualize SVCs, pessoas e acessos a partir do Excel.</p></div><div className="card"><form action="/api/import" method="post" encType="multipart/form-data" style={{display:'grid',gap:12}}><input name="file" type="file" accept=".xlsx,.xls" required/><button type="submit">Importar Excel</button></form><div className="notice" style={{marginTop:15}}>A importação preserva o histórico de solicitação GeoTab por e-mail e ignora linhas vazias da aba Retenção.</div></div></>
}
