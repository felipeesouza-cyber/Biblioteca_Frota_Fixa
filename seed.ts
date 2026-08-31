import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
const prisma=new PrismaClient()
const base=JSON.parse(fs.readFileSync('seed/base.json','utf8'))
const qs=JSON.parse(fs.readFileSync('seed/questions.json','utf8'))
const normalize=(s:any)=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim()
async function main(){
 for(const full of base.svcs){
   const [rawCode,...rest]=String(full||'').split(' - '); const code=rawCode.trim();
   if(code) await prisma.svc.upsert({where:{code},update:{name:rest.join(' - ')||null},create:{code,name:rest.join(' - ')||null}})
 }
 for(const p of base.people){
   const email=String(p.EMAIL||'').trim().toLowerCase(); if(!email) continue
   const svc=p.SVC?await prisma.svc.findUnique({where:{code:String(p.SVC).trim()}}):null
   const old=await prisma.person.findUnique({where:{email}})
   await prisma.person.upsert({where:{email},update:{name:p.NOME||email,cpf:p.CPF||null,phone:p.Telefone||null,profile:p.User||null,vec:p['VEC ']||null,geotab:p.GEOTAB||null,ticketlog:p['TICKET LOG']||null,svcId:svc?.id},create:{email,name:p.NOME||email,cpf:p.CPF||null,phone:p.Telefone||null,profile:p.User||null,vec:p['VEC ']||null,geotab:p.GEOTAB||null,ticketlog:p['TICKET LOG']||null,geotabRequested:old?.geotabRequested??false,geotabRequestedAt:old?.geotabRequestedAt??null,svcId:svc?.id}})
 }
 let training=await prisma.training.findFirst({where:{title:'Manual do OPs — Frota Fixa'}})
 if(!training) training=await prisma.training.create({data:{title:'Manual do OPs — Frota Fixa',questions:{create:qs.map((q:any,i:number)=>({order:i+1,text:q[0],correctAnswer:q[1]}))}}})
 const qlist=await prisma.question.findMany({where:{trainingId:training.id},orderBy:{order:'asc'}})
 for(const r of base.retention){
   const email=String(r['Endereço de e-mail']||'').trim().toLowerCase(); if(!email) continue
   const person=await prisma.person.findUnique({where:{email}}); if(!person) continue
   let correct=0
   for(let i=0;i<qlist.length;i++){const key=Object.keys(r)[4+i];if(normalize(r[key])===normalize(qlist[i].correctAnswer)) correct++}
   const rawDate=r['Carimbo de data/hora']; const createdAt=rawDate?new Date(rawDate):new Date()
   const sourceKey=String(rawDate||email)+'|'+email+'|'+training.id
   await prisma.attempt.upsert({where:{sourceKey},update:{score:correct,passed:correct>=8,createdAt},create:{sourceKey,score:correct,passed:correct>=8,personId:person.id,trainingId:training.id,createdAt}})
 }
 console.log('Seed concluido')
}
main().catch(err=>{console.error(err);process.exit(1)}).finally(()=>prisma.$disconnect())
