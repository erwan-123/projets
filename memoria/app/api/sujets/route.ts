// app/api/sujets/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const sujetSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  domain: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  problematique: z.string().min(30),
  objectives: z.string().min(30),
  methodology: z.string().min(30),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = sujetSchema.parse(body)

    // Vérifier que l'utilisateur est un étudiant
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Seuls les étudiants peuvent proposer des sujets' },
        { status: 403 }
      )
    }

    // Vérifier que le domaine existe
    const domain = await prisma.domain.findUnique({
      where: { id: validated.domain },
    })
    if (!domain) {
      return NextResponse.json(
        { error: 'Domaine invalide' },
        { status: 400 }
      )
    }

    // Créer le sujet
    const sujet = await prisma.sujet.create({
      data: {
        title: validated.title,
        description: validated.description,
        keywords: validated.keywords,
        domainId: domain.id,
        problematique: validated.problematique,
        objectives: validated.objectives,
        methodology: validated.methodology,
        proposerId: session.user.id,
        status: 'PENDING',
        isPublic: true,
      },
    })

    // Créer une notification pour l'encadrant
    const encadrants = await prisma.user.findMany({
      where: { role: 'SUPERVISOR' },
      take: 1,
    })

    if (encadrants.length > 0) {
      await prisma.notification.create({
        data: {
          userId: encadrants[0].id,
          title: 'Nouvelle proposition de sujet',
          message: `${session.user.name} a proposé un nouveau sujet : ${validated.title}`,
          type: 'info',
          link: `/encadrant/validations/${sujet.id}`,
        },
      })
    }

    return NextResponse.json(sujet, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      )
    }
    console.error('Erreur création sujet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du sujet' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const domain = searchParams.get('domain')
    const search = searchParams.get('search')

    const where: Prisma.SujetWhereInput = {}

    if (status) {
      where.status = status as Prisma.SujetWhereInput['status']
    }
    if (domain) {
      where.domainId = domain
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Filtrer selon le rôle
    if (session.user.role === 'STUDENT') {
      where.proposerId = session.user.id
    } else if (session.user.role === 'SUPERVISOR') {
      where.supervisorId = session.user.id
    }

    const sujets = await prisma.sujet.findMany({
      where,
      include: {
        proposer: {
          select: { name: true, email: true }
        },
        supervisor: {
          select: { name: true, email: true }
        },
        domain: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(sujets)
  } catch (error) {
    console.error('Erreur récupération sujets:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des sujets' },
      { status: 500 }
    )
  }
}