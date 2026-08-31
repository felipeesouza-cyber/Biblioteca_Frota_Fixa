import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

const clean=(v:any)=>v==null?'':String(v).trim()
const normalize=(v:any)=>clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim()
export async function POST(req:Request){
 const session=await auth(); if(!session) return NextResponse.json({error:'Não autorizado'},{status:401})
 const fd=await req.formData(); const file=fd.get('file');
 if(!(file instanceof File)) return NextResponse.json({error:'Arquivo não enviado'},{status:400})
 const buf=Buffer.from(await file.arrayBuffer()); const book=XLSX.read(buf,{type:'buffer'})
 const get=(name:string)=>book.Sheets[name]
 const svcRows=XLSX.utils.sheet_to_json<any>(get('SVC')||{}, {defval:''})
 const peopleRows=XLSX.utils.sheet_to_json<any>(get('Dados pessoais')||{}, {defval:''})
 const retentionRows=XLSX.utils.sheet_to_json<any>(get('Retenção')||{}, {defval:''})
 let svcCount=0,peopleCount=0,attemptsCount=0
 const training=await prisma.training.findFirst({where:{title:'Manual do OPs — Frota Fixa'},include:{questions:{orderBy:{order:'asc'}}}})
 for(const r of svcRows){const full=clean(r['SVC Implantação']);const [code,...rest]=full.split(' - ');if(!code)continue;await prisma.svc.upsert({where:{code},update:{name:rest.join(' - ')||null},create:{code,name:rest.join(' - ')||null}});svcCount++}
 for(const r of peopleRows){const email=clean(r.EMAIL);if(!email)continue;const svc=await prisma.svc.findUnique({where:{code:clean(r.SVC)}});const old=await prisma.person.findUnique({where:{email}});await prisma.person.upsert({where:{email},update:{name:clean(r.NOME)||email,cpf:clean(r.CPF)||null,phone:clean(r.Telefone)||null,profile:clean(r.User)||null,vec:clean(r['VEC '])||null,geotab:clean(r.GEOTAB)||null,ticketlog:clean(r['TICKET LOG'])||null,svcId:svc?.id},create:{email,name:clean(r.NOME)||email,cpf:clean(r.CPF)||null,phone:clean(r.Telefone)||null,profile:clean(r.User)||null,vec:clean(r['VEC '])||null,geotab:clean(r.GEOTAB)||null,ticketlog:clean(r['TICKET LOG'])||null,geotabRequested:old?.geotabRequested??false,geotabRequestedAt:old?.geotabRequestedAt??null,svcId:svc?.id}});peopleCount++}
 await prisma.importLog.create({data:{filename:file.name,peopleCount,svcCount}})
 return NextResponse.json({ok:true,filename:file.name,peopleCount,svcCount,retentionRows:retentionRows.filter(r=>clean(r['Endereço de e-mail'])).length})
}
