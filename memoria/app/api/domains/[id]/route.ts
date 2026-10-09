// app/api/domains/[id]/route.ts
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)


  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const validated = domainSchema.parse(body)


    const domain = await prisma.domain.update({
      where: { id },
      data: validated,
    })


    return NextResponse.json(domain)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du domaine' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)


  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }



  try {
    const { id } = await params
    await prisma.domain.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du domaine' },
      { status: 500 }
    )
  }
}