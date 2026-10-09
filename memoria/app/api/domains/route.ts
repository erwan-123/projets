// app/api/domains/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const domainSchema = z.object({
  name: z.string().min(2).max(191),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  isActive: z.boolean().default(true),
})

export async function GET() {
  try {
    const domains = await prisma.domain.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { subjects: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(domains)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des domaines' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = domainSchema.parse(body)

    const domain = await prisma.domain.create({
      data: validated,
    })

    return NextResponse.json(domain, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du domaine' },
      { status: 500 }
    )
  }
}