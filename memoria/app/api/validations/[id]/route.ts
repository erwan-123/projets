// app/api/validations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const validationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'REVISION']),
  feedback: z.string().optional(),
  step: z.string().default('SUJET'),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPERVISOR') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validated = validationSchema.parse(body)
    const { id } = await params

    const sujet = await prisma.sujet.findUnique({
      where: { id },
    })

    if (!sujet) {
      return NextResponse.json(
        { error: 'Sujet non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le sujet
    const updatedSujet = await prisma.sujet.update({
      where: { id },
      data: {
        status: validated.status,
        feedback: validated.feedback,
        supervisorId: session.user.id,
        updatedAt: new Date(),
      },
    })

    // Créer une validation
    await prisma.validation.create({
      data: {
        sujetId: id,
        validatorId: session.user.id,
        status: validated.status,
        comment: validated.feedback,
        step: validated.step,
      },
    })

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        userId: sujet.proposerId,
        title: `Sujet ${validated.status === 'APPROVED' ? 'approuvé' : 'mis à jour'}`,
        message: `Votre sujet "${sujet.title}" a été ${validated.status === 'APPROVED' ? 'approuvé' : validated.status === 'REJECTED' ? 'rejeté' : 'révision demandée'}`,
        type: validated.status === 'APPROVED' ? 'success' : 'warning',
        link: `/etudiant/sujets/${id}`,
      },
    })

    return NextResponse.json(updatedSujet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation' },
      { status: 500 }
    )
  }
}