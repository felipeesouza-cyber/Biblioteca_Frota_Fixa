import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
export async function GET(){
 const session=await auth(); if(!session) return NextResponse.json({error:'Não autorizado'},{status:401})
 const [people,svcs,trainings,attempts,approved,vec,geo,ticket]=await Promise.all([
  prisma.person.count(),prisma.svc.count(),prisma.training.count(),prisma.attempt.count(),prisma.attempt.count({where:{passed:true}}),
  prisma.person.count({where:{vec:'Sim'}}),prisma.person.count({where:{geotab:'Sim'}}),prisma.person.count({where:{ticketlog:'Sim'}})
 ])
 return NextResponse.json({people,svcs,trainings,attempts,approved,vec,geo,ticket})
}
